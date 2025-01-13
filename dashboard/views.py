from django.shortcuts import render
from django.db.models import Q, F
from item_list.models import Item  # Import the Item model
from supplier.models import Supplier
from item_category.models import Category  # Import the Category model from item_category app
from login.models import User  # Import the User model from login app

def index(request):
    
    # Get the current user's role
    user_role = None
    if request.user.is_authenticated:
        try:
            user = User.objects.get(id=request.user.id)  # Retrieve user by the ID
            user_role = user.role  # Get the user's role
            request.session['role'] = user_role  # Store role in session for later use
        except User.DoesNotExist:
            user_role = None
    
    # Calculate the number of low-stock items
    low_stock_count = Item.objects.filter(in_stock__lte=F('reorder_level')).count()

    # Calculate the total number of items
    total_items_count = Item.objects.count()

    # Calculate the number of categories
    category_count = Category.objects.count()

    # Calculate the number of suppliers
    supplier_count = Supplier.objects.count()

    # Pass the counts to the template
    context = {
        'low_stock_count': low_stock_count,
        'total_items_count': total_items_count,
        'category_count': category_count,
        'supplier_count': supplier_count,
        'user_role': user_role,
    }
    return render(request, "dashboard/dashboard.html", context)
