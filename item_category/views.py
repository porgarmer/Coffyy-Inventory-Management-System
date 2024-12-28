from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .models import Category  # Ensure this matches your actual model

def index(request):
    # Check if page and rows are set in session
    page = request.session.get('item_category_page', 1)  # Default to 1 if not in session
    rows = request.session.get('item_category_row', 10)  # Default to 10 if not in session

    # If page or rows are passed in the query parameters, update session
    page = request.GET.get('page', page)  # Override with query param if present
    rows = request.GET.get('rows', rows)  # Override with query param if present

    try:
        # Convert to integers
        page = int(page)
        rows = int(rows)
    except ValueError:
        # Fallback to defaults if invalid values are provided
        page = 1
        rows = 10

    # Store page and rows in session for next request
    request.session['item_category_page'] = page
    request.session['item_category_row'] = rows

    # Fetch the search query from the GET parameters
    search_query = request.GET.get('search', '').strip()

    # Filter categories based on the search query (case-insensitive)
    if search_query:
        categories = Category.objects.filter(name__icontains=search_query)
    else:
        categories = Category.objects.all()

    # Create the paginator object
    paginator = Paginator(categories, rows)

    try:
        categories_page = paginator.page(page)
    except PageNotAnInteger:
        categories_page = paginator.page(1)
    except EmptyPage:
        categories_page = paginator.page(paginator.num_pages)

    # Pass categories, pagination parameters, and the search query to the template
    return render(request, 'item_category/index.html', {
        'categories': categories_page,
        'page': 1,
        'rows_per_page': 10,
        'search_query': search_query,  # Include this for pre-filling the search bar
    })


def add_category(request):
    # Get pagination parameters
    page = request.session.get('item_category_page', 1)
    rows = request.session.get('item_category_row', 10)

    if request.method == 'POST':
        name = request.POST.get('name')
        color = request.POST.get('color')

        # Validate category name
        if Category.objects.filter(name=name).exists():
            messages.error(request, "A category with this name already exists.")
            return render(request, 'item_category/add_category.html', {'name': name, 'color': color, 'page': page, 'rows': rows})

        # Save new category
        Category.objects.create(name=name, color=color)
        messages.success(request,"Category added!")
        # Redirect with pagination parameters
        return redirect(f"{reverse('item_categories_index')}?page={page}&rows={rows}")

    return render(request, 'item_category/add_category.html', {'page': page, 'rows': rows})

def cancel_redirect(request):
    if request.method == 'POST':
        # Retrieve `page` and `rows` from the session
        page = request.session.get('item_category_page', 1)
        rows = request.session.get('item_category_row', 10)
        
        # Redirect to the index page with pagination parameters
        return redirect(f"{reverse('item_categories_index')}?page={page}&rows={rows}")

def edit_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    predefined_colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"]

    # Get pagination parameters
    page = request.session.get('item_category_page', 1)
    rows = request.session.get('item_category_row', 10)

    if request.method == 'POST':
        name = request.POST.get('name')
        color = request.POST.get('color')

        # Check for duplicate names
        if Category.objects.filter(name=name).exclude(id=category.id).exists():
            messages.error(request, "Category already exists.")
            return render(request, 'item_category/edit_category.html', {
                'category': category,
                'predefined_colors': predefined_colors,
                'page': page,
                'rows': rows,
            })

        # Update category
        category.name = name
        category.color = color
        category.save()
        messages.success(request, "Category edited!")
        # Redirect with pagination parameters
        return redirect(f"{reverse('item_categories_index')}?page={page}&rows={rows}")

    return render(request, 'item_category/edit_category.html', {
        'category': category,
        'predefined_colors': predefined_colors,
        'page': page,
        'rows': rows,
    })

def delete_categories(request):
    if request.method == 'POST':
        selected_categories = request.POST.getlist('selected_categories')
        categories = Category.objects.filter(id__in=selected_categories)

        # Delete the selected categories
        if categories.exists():
            categories.delete()
            messages.success(request, 'Category/ies deleted!')

    return redirect('item_categories_index')  # Redirect after deletion
