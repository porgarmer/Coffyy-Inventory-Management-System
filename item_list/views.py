from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
import json
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.urls import reverse
from .models import Item
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

    # Paginate items
    paginator = Paginator(items, rows)
    try:
        items_page = paginator.page(page)
    except PageNotAnInteger:
        items_page = paginator.page(1)
    except EmptyPage:
        items_page = paginator.page(paginator.num_pages)

    # Context for rendering the template
    return render(request, 'item_list/index.html', {
        'items': items_page,
        'rows_per_page': rows,
        'search_query': search_query,
    })


def add_item(request):
    categories = Category.objects.all()

    if request.method == "POST":
        name = request.POST.get("name")
        if Item.objects.filter(name=name).exists():
            messages.error(request, f"The item name '{name}' already exists.")
            return redirect(reverse("item_list:add_item"))

        price = request.POST.get("price")
        cost = request.POST.get("cost")

        # Optional fields
        default_purchase_cost = request.POST.get("default_purchase_cost", None)
        in_stock = request.POST.get("in_stock", None)
        optimal_stock = request.POST.get("optimal_stock", None)
        reorder_level = request.POST.get("reorder_level", None)
        volume_per_unit = (
            request.POST.get("volume_weight_per_unit", None)
            if request.POST.get("sold_by") == "volume_weight" else None
        )
        remaining_volume = (
            float(volume_per_unit) * int(in_stock) if volume_per_unit and in_stock else None
        )

        try:
            price = float(price) if price else 0.00
            cost = float(cost) if cost else 0.00
            default_purchase_cost = float(default_purchase_cost) if default_purchase_cost else None
        except ValueError:
            price = cost = 0.00
            default_purchase_cost = None

        category_id = request.POST.get("category")
        category = Category.objects.filter(id=category_id).first() if category_id else None

        # Create item
        Item.objects.create(
            name=name,
            category=category,
            price=price,
            cost=cost,
            purchase_cost=default_purchase_cost,
            in_stock=in_stock,
            optimal_stock=optimal_stock,
            reorder_level=reorder_level,
            volume_per_unit=volume_per_unit,
            remaining_volume=remaining_volume,
            is_for_sale=request.POST.get("is_for_sale") == "on",
            sold_by=request.POST.get("sold_by"),
        )

        # Redirect back to the current item list page
        page = request.session.get('item_list_page', 1)
        rows = request.session.get('item_list_row', 10)
        redirect_url = f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}"
        messages.success(request, 'Item added successfully!')
        return redirect(redirect_url)

    return render(request, "item_list/add_item.html", {"categories": categories})


def cancel_redirect(request):
    # Retrieve `page` and `rows` from session variables for item_list
    page = request.session.get('item_list_page', 1)
    rows = request.session.get('item_list_row', 10)

    # Redirect to the index page with item_list pagination parameters
    return redirect(f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}")

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
