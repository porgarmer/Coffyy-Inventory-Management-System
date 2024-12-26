from django.core.paginator import Paginator
from django.shortcuts import render, redirect, get_object_or_404
from .models import Category  # Ensure this matches your actual model

def index(request):
    # Get the number of rows per page, default to 10 if not set
    rows_per_page = int(request.GET.get('rows', 10))  # Default to 10 if no 'rows' parameter
    
    # Get the page number from the request, default to 1 if not set
    page_number = request.GET.get('page', 1)
    
    # Fetch all categories
    categories = Category.objects.all()

    # Create the paginator object
    paginator = Paginator(categories, rows_per_page)

    # Check if the current page number is valid after changing rows per page
    try:
        categories_page = paginator.page(page_number)
    except PageNotAnInteger:
        # If the page number is not an integer, fall back to the first page
        categories_page = paginator.page(1)
    except EmptyPage:
        # If the page number is out of range, fall back to the last page
        categories_page = paginator.page(paginator.num_pages)

    # Ensure that the current page is valid and within the total number of pages
    if categories_page.number > 1:
        categories_page = paginator.page(1)

    # Pass the categories, rows_per_page, and paginator to the template
    return render(request, 'item_category/index.html', {
        'categories': categories_page,
        'rows_per_page': rows_per_page,
        'paginator': paginator,
    })

def add_category(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        color = request.POST.get('color')
        # Save to the database
        Category.objects.create(name=name, color=color)
        return redirect('item_categories_index')  # Redirect to index after saving
    return render(request, 'item_category/add_category.html')

def edit_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    predefined_colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"]
    
    if request.method == "POST":
        category.name = request.POST.get("name")
        category.color = request.POST.get("color")
        category.save()
        return redirect("item_categories_index")

    return render(request, "item_category/edit_category.html", {"category": category, "predefined_colors": predefined_colors})

def delete_categories(request):
    if request.method == 'POST':
        selected_ids = request.POST.getlist('selected_categories')
        Category.objects.filter(id__in=selected_ids).delete()
        return redirect('item_categories_index')
