from django.shortcuts import render
from django.db.models import Q, F
from item_list.models import Item  # Import the Item model
from supplier.models import Supplier
from item_category.models import Category  # Import the Category model from item_category app
from login.models import User
def index(request):
    
    # Calculate the number of low-stock items
    low_stock_count = Item.objects.filter(in_stock__lte=F('reorder_level')).count()

    # Calculate the total number of items
    total_items_count = Item.objects.count()

    # Calculate the number of categories
    category_count = Category.objects.count()

    # Calculate the number of suppliers
    supplier_count = Supplier.objects.count()
    
    #employee_count = User.objects.count(role = 'employee')

    # Pass the counts to the template
    context = {
        'low_stock_count': low_stock_count,
        'total_items_count': total_items_count,
        'category_count': category_count,
        'supplier_count': supplier_count,
        #'employee_count': employee_count,
    }
    return render(request, "dashboard/dashboard.html", context)
