from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
import json
from django.db.models import Q
from django.shortcuts import get_list_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.urls import reverse
from .models import Item, CompositeItem
from item_category.models import Category

def index(request):
    # Retrieve session variables for pagination and rows-per-page
    page = request.session.get('item_list_page', 1)
    rows = request.session.get('item_list_row', 10)

    # Override session variables with GET parameters if provided
    page = request.GET.get('page', page)
    rows = request.GET.get('rows', rows)

    # Validate and update session variables
    try:
        page = int(page)
        rows = int(rows)
    except ValueError:
        page = 1
        rows = 10

    request.session['item_list_page'] = page
    request.session['item_list_row'] = rows

    # Handle search query
    search_query = request.GET.get('search', '').strip()
    if search_query:
        items = Item.objects.filter(
            name__icontains=search_query
        ).select_related('category')
    else:
        items = Item.objects.select_related('category').all()

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

    # Get page range for pagination (limit to 10 pages)
    page_range = items_page.paginator.page_range
    current_page = items_page.number
    start_page = max(current_page - 5, 1)
    end_page = min(current_page + 4, paginator.num_pages)
    page_range = page_range[start_page - 1:end_page]

    # Context for rendering the template
    return render(request, 'item_list/index.html', {
        'items': items_page,
        'rows_per_page': rows,
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


        # Parse numeric fields
        def parse_float(field, default=0.00):
            try:
                return float(request.POST.get(field, default))
            except (ValueError, TypeError):
                return default

        price = parse_float("price")
        cost = parse_float("cost")
        default_purchase_cost = parse_float("default_purchase_cost", None)

        # Parse optional integer fields
        in_stock = request.POST.get("in_stock", None)
        optimal_stock = request.POST.get("optimal_stock", None)
        reorder_level = request.POST.get("reorder_level", None)

        # Parse volume-related fields
        sold_by = request.POST.get("sold_by", None)
        volume_per_unit = parse_float("volume_weight_per_unit", None) if sold_by == "volume_weight" else None
        remaining_volume = (
            float(volume_per_unit) * int(in_stock)
            if volume_per_unit and in_stock and in_stock.isdigit()
            else None
        )

        # Fetch category
        category_id = request.POST.get("category")
        category = Category.objects.filter(id=category_id).first() if category_id else None

        try:
            # Create the parent item
            parent_item = Item.objects.create(
                name=name,
                category=category,
                description=request.POST.get("description"),
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

@csrf_exempt
def delete_items(request):
    if request.method == "POST":
        # Retrieve the list of selected item IDs from the form
        selected_ids = request.POST.getlist('selected_ids')

        if selected_ids:
            try:
                # Delete the selected items
                Item.objects.filter(id__in=selected_ids).delete()

                # Calculate updated pagination
                rows = request.session.get('item_list_row', 10)
                items_count = Item.objects.count()
                total_pages = (items_count + rows - 1) // rows  # Calculate total pages

                # Show success message to the user
                messages.success(request, "Items deleted successfully!")

                return redirect(f"{reverse('item_list:item_list_index')}?page={total_pages}&rows={rows}")

            except Exception as e:
                # Handle any errors that occur during deletion
                messages.error(request, f"Error deleting items: {str(e)}")

        else:
            # Handle case where no items were selected
            messages.error(request, "No items selected for deletion.")

        return redirect(f"{reverse('item_list:item_list_index')}?page={request.session.get('item_list_page', 1)}&rows={request.session.get('item_list_row', 10)}")
