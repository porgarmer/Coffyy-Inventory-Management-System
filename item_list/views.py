from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.urls import reverse
from .models import Item  # Assuming your Item model is defined in `item_list.models`
from item_category.models import Category
#from supplier.models import Supplier  # Import Supplier model if it exists

def index(request):
    page = request.GET.get('page', 1)
    rows = request.GET.get('rows', 10)

    try:
        page = int(page)
        rows = int(rows)
    except ValueError:
        page = 1
        rows = 10

    search_query = request.GET.get('search', '').strip()

    if search_query:
        items = Item.objects.filter(
            name__icontains=search_query
        ).select_related('category')
    else:
        items = Item.objects.select_related('category').all()

    paginator = Paginator(items, rows)

    try:
        items_page = paginator.page(page)
    except PageNotAnInteger:
        items_page = paginator.page(1)
    except EmptyPage:
        items_page = paginator.page(paginator.num_pages)

    return render(request, 'item_list/index.html', {
        'items': items_page,
        'page': page,
        'rows_per_page': rows,
        'search_query': search_query,
    })


def add_item(request):
    categories = Category.objects.all()

    if request.method == "POST":
        # Required fields
        name = request.POST.get("name")
        price = request.POST.get("price")
        cost = request.POST.get("cost")

        # Optional fields
        default_purchase_cost = request.POST.get("default_purchase_cost", None)
        in_stock = request.POST.get("in_stock", None)
        optimal_stock = request.POST.get("optimal_stock", None)
        reorder_level = request.POST.get("reorder_level", None)
        volume_per_unit = request.POST.get("volume_weight_per_unit", None) if request.POST.get("sold_by") == "volume_weight" else None
        remaining_volume = (
            float(volume_per_unit) * int(in_stock) if volume_per_unit and in_stock else None
        )

        # Validation and conversion
        try:
            price = float(price) if price else 0.00
            cost = float(cost) if cost else 0.00
            default_purchase_cost = float(default_purchase_cost) if default_purchase_cost else None
        except ValueError:
            price = cost = 0.00
            default_purchase_cost = None

        category_id = request.POST.get("category")
        category = Category.objects.filter(id=category_id).first() if category_id else None

        # Create the item
        item = Item.objects.create(
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

        rows = request.session.get('item_list_rows', 10)
        page = request.session.get('item_list_page', 1)

        redirect_url = f"{reverse('item_list:item_list_index')}?page={page}&rows={rows}"
        return redirect(redirect_url)

    return render(request, "item_list/add_item.html", {"categories": categories})


def cancel_redirect(request):
    if request.method == 'POST':
        # Retrieve `page` and `rows` from the session (if needed)
        page = request.session.get('item_list_page', 1)
        rows = request.session.get('item_list_rows', 10)
        
        # Redirect to the index page with pagination parameters
        return redirect(f"{reverse('item_list_index')}?page={page}&rows={rows}")
