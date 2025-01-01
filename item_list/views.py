from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
import json
from django.db.models import Q, F
from django.shortcuts import get_list_or_404, get_object_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.urls import reverse
from .models import Item, CompositeItem
from item_category.models import Category
from django.core.serializers.json import DjangoJSONEncoder  # Import JSON encoder
from django.views.decorators.cache import never_cache

def index(request):
    page = request.GET.get('page', 1)
    rows = request.GET.get('rows', 10)
    category_id = request.GET.get('category', '')  # Get category filter
    stock_alert = request.GET.get('stock_alert', '')  # Get stock alert filter
    search_query = request.GET.get('search', '').strip()

    # Validate pagination inputs
    try:
        page = int(page)
        rows = int(rows)
    except ValueError:
        page = 1
        rows = 10

    # Store session variables
    request.session['item_list_page'] = page
    request.session['item_list_row'] = rows

    # Fetch categories for the dropdown
    categories = Category.objects.all()

    # Start with all items
    items = Item.objects.select_related('category').all()

    categories = Category.objects.filter(item__isnull=False).distinct()

    # Apply Category Filter
    if category_id == "no-category":
        items = items.filter(category__isnull=True)  # Items with no category
    elif category_id:  # If a specific category is selected
        items = items.filter(category_id=category_id)

    # Apply Stock Alert Filter
    if stock_alert == "low":
        items = items.filter(in_stock__lte=F('reorder_level'))  # Low stock: In stock <= reorder level
    elif stock_alert == "out-of-stock":
        items = items.filter(in_stock=0)  # Out of stock: In stock == 0

    # Apply Search Query Filter
    if search_query:
        items = items.filter(name__icontains=search_query)

    # Order items alphabetically
    items = items.order_by('name')

    # Paginate items
    paginator = Paginator(items, rows)
    try:
        items_page = paginator.page(page)
    except PageNotAnInteger:
        items_page = paginator.page(1)
    except EmptyPage:
        items_page = paginator.page(paginator.num_pages)

    # Get page range for pagination
    page_range = items_page.paginator.page_range
    current_page = items_page.number
    start_page = max(current_page - 5, 1)
    end_page = min(current_page + 4, paginator.num_pages)
    page_range = page_range[start_page - 1:end_page]

    # Context for rendering the template
    return render(request, 'item_list/index.html', {
        'items': items_page,
        'rows_per_page': rows,
        'categories': categories,
        'selected_category': category_id,  # For persisting category selection
        'selected_stock_alert': stock_alert,  # For persisting stock alert selection
        'search_query': search_query,
        'page_range': page_range,
    })

def check_item_name(request):
    try:
        name = request.GET.get('name', None)
        if name and Item.objects.filter(name=name).exists():
            return JsonResponse({'exists': True})
        return JsonResponse({'exists': False})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def check_item_name_edit(request):
    name = request.GET.get('name', '').strip()
    exclude_id = request.GET.get('exclude')
    
    if exclude_id:
        exists = Item.objects.filter(name=name).exclude(id=exclude_id).exists()
    else:
        exists = Item.objects.filter(name=name).exists()
    
    return JsonResponse({'exists': exists})


        
def search_items(request):
    query = request.GET.get('q', '')
    if query:
        results = Item.objects.filter(name__icontains=query).values('name', 'cost')
        return JsonResponse({'results': list(results)})
    return JsonResponse({'results': []})


def add_item(request):
    categories = Category.objects.all()

    if request.method == "POST":
        # Parse general item details
        name = request.POST.get("name", "").strip()
        is_composite = request.POST.get("composite_item") == "on"

        description = request.POST.get("description", "").strip()


        # Parse numeric fields
        def parse_float(field, default=0.00):
            try:
                return float(request.POST.get(field, default))
            except (ValueError, TypeError):
                return default
        
        price = parse_float("price")
        cost = parse_float("cost")
        default_purchase_cost = parse_float("default_purchase_cost")

        # Parse optional integer fields
        in_stock = request.POST.get("in_stock")
        optimal_stock = request.POST.get("optimal_stock")
        reorder_level = request.POST.get("reorder_level")

        # Parse volume-related fields
        sold_by = request.POST.get("sold_by", None)
        if request.POST.get("composite_item") == "on":
            sold_by = None  # Override sold_by for composite items
            
        volume_per_unit = parse_float("volume_weight_per_unit", None) if sold_by == "volume_weight" else None
        remaining_volume = None  # Default to None

        # Check if the item is sold by volume/weight
        if sold_by == "volume_weight":
            if volume_per_unit:
                remaining_volume = float(volume_per_unit) * int(in_stock) if in_stock and in_stock.isdigit() else 0.00
            else:
                remaining_volume = 0.00

        # Fetch category
        category_id = request.POST.get("category")
        category = Category.objects.filter(id=category_id).first() if category_id else None

        try:
            # Create the parent item
            parent_item = Item.objects.create(
                name=name,
                category=category,
                description=description,
                price=price,
                cost=cost,
                purchase_cost=default_purchase_cost,
                in_stock=int(in_stock) if in_stock and in_stock.isdigit() else None,
                optimal_stock=int(optimal_stock) if optimal_stock and optimal_stock.isdigit() else None,
                reorder_level=int(reorder_level) if reorder_level and reorder_level.isdigit() else None,
                volume_per_unit=volume_per_unit,
                remaining_volume=remaining_volume,
                is_for_sale=request.POST.get("is_for_sale") == "on",
                sold_by=sold_by,
                is_composite=is_composite,
            )

            # Handle composite items
            if is_composite:
                composite_items_data = request.POST.get("composite_items_data", "[]")
                composite_items = json.loads(composite_items_data)

                for item_data in composite_items:
                    item_name = item_data.get("item_name")
                    quantity = item_data.get("quantity", 0)

                    # Fetch the child item
                    item = Item.objects.filter(name=item_name).first()
                    if not item:
                        messages.error(request, f"Item '{item_name}' not found.")
                        return redirect(reverse("item_list:add_item"))

                    # Create the composite item relationship
                    CompositeItem.objects.create(
                        parent_item=parent_item,
                        item=item,
                        quantity=quantity,
                    )

            messages.success(request, "Item added successfully!")
        except Exception as e:
            messages.error(request, f"An error occurred while adding the item: {str(e)}")
            return redirect(reverse("item_list:add_item"))

        # Redirect to item list with pagination
        page = request.session.get("item_list_page", 1)
        rows = request.session.get("item_list_row", 10)
        redirect_url = f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}"
        return redirect(redirect_url)

    return render(request, "item_list/add_item.html", {"categories": categories})

def cancel_redirect(request):
    # Retrieve page and rows from session or set defaults
    page = request.session.get('item_list_page', 1)
    rows = request.session.get('item_list_row', 10)

    # Ensure valid integer values
    try:
        page = int(page)
        rows = int(rows)
    except ValueError:
        page = 1
        rows = 10

    # Redirect with pagination parameters
    redirect_url = f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}"
    return redirect(redirect_url)

def edit_item(request, item_id):
    # Get the item to be edited
    item = get_object_or_404(Item, id=item_id)
    categories = Category.objects.all()

    sold_by = request.POST.get('sold_by', None)  # Default to None if not provided

    if request.method == "POST":
        # Update the item's fields with POST data
        item.name = request.POST.get('name')
        item.category = Category.objects.get(id=request.POST.get('category')) if request.POST.get('category') else None
        item.description = request.POST.get('description', '').strip()
        item.is_for_sale = 'is_for_sale' in request.POST
        item.sold_by = sold_by
        item.price = request.POST.get('price')
        item.cost = request.POST.get('cost')
        item.in_stock = request.POST.get('in_stock')
        item.reorder_level = request.POST.get('reorder_level')
        item.purchase_cost = request.POST.get('default_purchase_cost')
        item.optimal_stock = request.POST.get('optimal_stock')

        # Handle volume per unit for 'volume_weight' items
        if item.sold_by == 'volume_weight':
            item.volume_per_unit = request.POST.get('volume_weight_per_unit')
            item.remaining_volume = request.POST.get('remaining_volume')
        else:
            item.volume_per_unit = None
            item.remaining_volume = None


        # Update composite items if applicable
        if request.POST.get('composite_item') == 'on':
            item.is_composite = True
            composite_items_data = json.loads(request.POST.get('composite_items_data', '[]'))
            CompositeItem.objects.filter(parent_item=item).delete()  # Clear existing relationships
            for item_data in composite_items_data:
                child_item = Item.objects.filter(name=item_data['item_name']).first()
                if child_item:
                    CompositeItem.objects.create(
                        parent_item=item,
                        item=child_item,
                        quantity=item_data['quantity']
                    )
        else:
            item.is_composite = False
            CompositeItem.objects.filter(parent_item=item).update(is_active=False)

        # Save the updated item
        item.save()

        messages.success(request, "Item updated successfully!")
        page = request.session.get("item_list_page", 1)
        rows = request.session.get("item_list_row", 10)
        redirect_url = f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}"
        return redirect(redirect_url)

    # Prepopulate form data
    form_data = {
        'name': item.name,
        'category': item.category.id if item.category else '',
        'description': item.description,
        'is_for_sale': item.is_for_sale,
        'sold_by': item.sold_by,
        'price': item.price,
        'cost': item.cost,
        'in_stock': item.in_stock,
        'optimal_stock': item.optimal_stock,
        'reorder_level': item.reorder_level,
        'volume_weight_per_unit': item.volume_per_unit,
        'remaining_volume': item.remaining_volume,
        'default_purchase_cost': item.purchase_cost,
    }

    # Prepopulate composite item data
    composite_items = CompositeItem.objects.filter(parent_item=item).select_related('item')
    composite_data = [
        {'name': ci.item.name, 'quantity': ci.quantity, 'cost': ci.item.cost}
        for ci in composite_items
    ]

    # Pass all data to the template
    context = {
        'item': item,
        'categories': categories,
        'form_data': form_data,
        'is_composite': item.is_composite,  # True if the item is composite
        'composite_data': json.dumps(composite_data, cls=DjangoJSONEncoder),  # Use DjangoJSONEncoder
    }

    return render(request, 'item_list/edit_item.html', context)

    
@csrf_exempt
def delete_items(request):
    if request.method == "POST":
        selected_ids = request.POST.getlist('selected_ids')

        if selected_ids:
            try:
                # Delete the selected items
                Item.objects.filter(id__in=selected_ids).delete()

                # Get current page and rows from session or default values
                rows = request.session.get('item_list_row', 10)
                current_page = int(request.session.get('item_list_page', 1))

                # Calculate the total number of remaining items
                items_count = Item.objects.count()

                # Calculate the total number of pages
                total_pages = (items_count + rows - 1) // rows  # Total pages based on rows per page

                # Redirect to the current page if valid
                if current_page > total_pages:  # If the current page is now invalid (all items on it deleted)
                    current_page = max(total_pages, 1)  # Redirect to the last valid page (or first if no items remain)

                # Show success message to the user
                messages.success(request, "Items deleted successfully!")
                return redirect(f"{reverse('item_list:item_list_index')}?page={current_page}&rows={rows}")

            except Exception as e:
                messages.error(request, f"Error deleting items: {str(e)}")

        else:
            messages.error(request, "No items selected for deletion.")

        # Redirect to the current page with existing parameters
        current_page = request.session.get('item_list_page', 1)
        rows = request.session.get('item_list_row', 10)
        return redirect(f"{reverse('item_list:item_list_index')}?page={current_page}&rows={rows}")

