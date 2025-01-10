from django.shortcuts import render,redirect
from django.urls import reverse
from supplier.models import Supplier
from .models import PurchaseOrder, PurchaseItem
from item_list.models import Item
from django.db.models import Sum, Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib import messages

# Create your views here.

#Purchase order table
def purchase_order(request):

    page = request.session.get('page', 1)
    rows = request.session.get('rows', 10)
    page = request.GET.get('page', page)
    rows = request.GET.get('rows', rows)
    
    try:
        page = int(page)
        rows = int(rows)
    except ValueError:
        page = 1
        rows = 10
        
    request.session['purchase_order_list'] = page
    request.session['purchase_order_list'] = rows
    
    status = request.GET.get('status', 'All')
    search_query = request.GET.get('search', '').strip()
    
    suppliers = Supplier.objects.all()
    selected_supplier = request.GET.get('supplier', '')

    purchase_orders = PurchaseOrder.objects.annotate(
        total_received_items=Sum('items__pur_item_received_items')
    )
    
    if search_query:
        purchase_orders = purchase_orders.filter(
                Q(po_id__icontains=search_query) |
                Q(supp_id__supp_name__icontains=search_query) |
                Q(po_status__icontains=search_query)
            )
        
    if status == "All":
        purchase_orders = purchase_orders.all()
    else:
        purchase_orders = purchase_orders.filter(
                    po_status=status
                )
        
    if selected_supplier == "All Suppliers":
        purchase_orders = purchase_orders.all()
    else:
        purchase_orders = purchase_orders.filter(
                    Q(supp_id__supp_name__icontains=selected_supplier)
                )
            
    purchase_orders = purchase_orders.order_by('-po_id')
    paginator = Paginator(purchase_orders, rows)
    
    try:
        purchase_orders_page = paginator.page(page)
    except PageNotAnInteger:
        purchase_orders_page = paginator.page(1)
    except EmptyPage:
        purchase_orders_page = paginator.page(paginator.num_pages)
        
    page_range = purchase_orders_page.paginator.page_range
    current_page = purchase_orders_page.number
    start_page = max(current_page - 5, 1)
    end_page = min(current_page + 4, paginator.num_pages)
    page_range = page_range[start_page - 1:end_page]
    
    return render(request, "purchase_order/purchase_order.html", {
        "purchase_orders": purchase_orders_page,
        'rows_per_page': rows,
        'page_range': page_range,
        "search_query": search_query,
        "status": status,
        "suppliers": suppliers,
        "selected_supplier": selected_supplier
    })
#Add purchase order
def create_purchase_order(request):
    
    
    if request.method == "POST":
        supp_id = request.POST.get("supplier")
        supplier = Supplier.objects.get(supp_id=supp_id)
        date = request.POST.get("date")
        expected_date = request.POST.get("expected-date")
        notes = request.POST.get("notes")
        total_amount = request.POST.get("items-total-amount")
        
        purchase_order_entry = PurchaseOrder.objects.create(
            po_date = date,
            po_expected_date = expected_date,
            po_status = "Pending",
            po_notes = notes,
            po_total_amount = total_amount,
            supp_id = supplier
        )
        
        
        index = 0
        while True:
            # Check for the presence of an item at the current index
            item_id = request.POST.get(f'items-{index}-id')
            purchase_cost = request.POST.get(f'items-{index}-purchase-cost')
            quantity = request.POST.get(f'items-{index}-quantity')
            amount = request.POST.get(f'items-{index}-amount')
            if not item_id:  # Stop if no more items are found
                break

            PurchaseItem.objects.create(
                po_id = purchase_order_entry,
                item_id = Item.objects.get(id=item_id),
                pur_item_qty = quantity,
                pur_item_purchase_cost = purchase_cost,
                pur_item_amount = amount
            )

            index += 1
            
        messages.success(request, "Purchase order created.")
        return redirect(reverse('purchase-order'))
            
    suppliers = Supplier.objects.all()
    items = Item.objects.all()
    return render(request, "purchase_order/create_purchase_order.html", {
        'suppliers': suppliers,
        'items': items
    })