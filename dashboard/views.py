from django.shortcuts import render, redirect
from django.db.models import Q, F, Sum
from item_list.models import Item  # Import the Item model
from supplier.models import Supplier
from item_category.models import Category  # Import the Category model from item_category app
from login.models import User
from purchase_order.models import PurchaseItem
from item_request.models import ItemRequest


def index(request):
    if request.session['role'] == 'owner':
        # Calculate the number of low-stock items
        low_stock_count = Item.objects.filter(in_stock__lte=F('reorder_level')).count()

        # Calculate the total number of items
        total_items_count = Item.objects.count()

        # Calculate the number of categories
        category_count = Category.objects.count()

        # Calculate the number of suppliers
        supplier_count = Supplier.objects.count()
        
        pending_request_count = ItemRequest.objects.filter(status="Pending").count() or 0
        
        incoming_items = PurchaseItem.objects.annotate(
            incoming=F('pur_item_qty') - F('pur_item_received_items')
        ).aggregate(total=Sum('incoming'))['total']
        
        incoming_items = incoming_items or 0
        
        employee_count = User.objects.filter(role='employee').count()
    elif request.session['role'] == 'employee':
        # Calculate the number of low-stock items
        low_stock_count = Item.objects.filter(in_stock__lte=F('reorder_level')).count()

        # Calculate the total number of items
        total_items_count = Item.objects.count()

        # Calculate the number of categories
        category_count = Category.objects.count()

        # Calculate the number of suppliers
        supplier_count = Supplier.objects.count()
        
        pending_request_count = ItemRequest.objects.filter(status="Pending").count() or 0

        
        incoming_items = PurchaseItem.objects.annotate(
            incoming=F('pur_item_qty') - F('pur_item_received_items')
        ).aggregate(total=Sum('incoming'))['total']
        
        incoming_items = incoming_items or 0

        employee_count = 0
    else:
        return redirect('https://www.google.com')
        

    employee_count = User.objects.exclude(role='owner').count()

    # Pass the counts to the template
    context = {
        'low_stock_count': low_stock_count,
        'total_items_count': total_items_count,
        'category_count': category_count,
        'supplier_count': supplier_count,
        'employee_count': employee_count,
        'incoming_items': incoming_items,
        'pending_requests_count': pending_request_count,
    }
    return render(request, "dashboard/dashboard.html", context)
