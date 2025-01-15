from django.shortcuts import render,redirect
from django.urls import reverse
from supplier.models import Supplier
from .models import PurchaseOrder, PurchaseItem
from item_list.models import Item
from django.db.models import Sum, Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
# Create your views here.

#Purchase order table
def purchase_order(request):

    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
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
        total_received_items=Sum('items__pur_item_received_items'),
        total_ordered=Sum('items__pur_item_qty')
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
    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
    
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
        return redirect(reverse('order-details', kwargs={"po_id": purchase_order_entry.po_id}))
            
    suppliers = Supplier.objects.all()
    items = Item.objects.all()
    return render(request, "purchase_order/create_purchase_order.html", {
        'suppliers': suppliers,
        'items': items
    })
    
def order_details(request, po_id):
    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
    
    order = PurchaseOrder.objects.filter(po_id=po_id).annotate(
        total_qty=Sum("items__pur_item_qty"),
        total_received=Sum("items__pur_item_received_items")
    ).first()
    
    if order.total_received == order.total_qty:
        order.po_status = "Closed"
        order.save()
        
    elif (order.total_received != 0) and (order.total_received < order.total_qty):
        order.po_status = "Partially Received"
        order.save()
    items = order.items.all()
    
    return render(request, "purchase_order/purchase_order_details.html",{
        "purchase_order": order,
        "items": items,
    })
    
def receive_items(request, po_id):
    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
    if request.method == "POST":
                # Retrieve all IDs as a list
        item_ids = request.POST.getlist("pur-item-id")
        to_receive = request.POST.getlist("to-receive")
        
        for item_id, receive in zip(item_ids, to_receive):
            if receive:
                pur_item = PurchaseItem.objects.get(pur_item_id=item_id)
                pur_item.pur_item_received_items += int(receive)
                pur_item.pur_item_incoming = int(pur_item.pur_item_qty) - (pur_item.pur_item_received_items)
                pur_item.item_id.in_stock += int(receive)
                pur_item.item_id.save()
                pur_item.save()

        return redirect(reverse('order-details', kwargs={"po_id": po_id}))

    items = PurchaseItem.objects.filter(po_id=po_id)
    return render(request, "purchase_order/receive_items.html", {
        "po_id": po_id,
        "items": items
    })

def edit_purchase_order(request, po_id=None):
    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
    if request.method == "POST":
        order = PurchaseOrder.objects.get(po_id=po_id)
        
        supp_id = request.POST.get("supplier")
        supplier = Supplier.objects.get(supp_id=supp_id)
        date = request.POST.get("date")
        expected_date = request.POST.get("expected-date")
        notes = request.POST.get("notes", '')
        total_amount = request.POST.get("items-total-amount")
    
        order.po_date = date
        order.po_expected_date = expected_date
        order.po_notes = notes
        order.po_total_amount = total_amount
        order.supp_id = supplier
        order.save()

        # For existing items
        index = 1
        while True:
            pur_item_id = request.POST.get(f'items-{index}-pur_item-exist')
            item_id = request.POST.get(f'items-{index}-id-exist')
            purchase_cost = request.POST.get(f'items-{index}-purchase-cost-exist')
            quantity = request.POST.get(f'items-{index}-quantity-exist')
            amount = request.POST.get(f'items-{index}-amount-exist')
            
            if not pur_item_id:  # Stop if no more items are found
                break
            
            else:
                try:
                    pur_item = PurchaseItem.objects.get(pur_item_id=pur_item_id)
                    pur_item.pur_item_qty = int(quantity)
                    pur_item.pur_item_purchase_cost = float(purchase_cost)
                    pur_item.pur_item_amount = float(amount)
                    pur_item.save()
                except pur_item.DoesNotExist:
                    pass
                
            index += 1
            
        # For newly added items
        index = 0
        while True:
            item_id = request.POST.get(f'items-{index}-id')
            purchase_cost = request.POST.get(f'items-{index}-purchase-cost')
            quantity = request.POST.get(f'items-{index}-quantity')
            amount = request.POST.get(f'items-{index}-amount')
            
            if not item_id:  # Stop if no more items are found
                break
            
            PurchaseItem.objects.create(
                    po_id = order,
                    item_id = Item.objects.get(id=item_id),
                    pur_item_qty = quantity,
                    pur_item_purchase_cost = purchase_cost,
                    pur_item_amount = amount
                )

            index += 1
        
        # Get the list of deleted items from the hidden input
        deleted_items = request.POST.get('deleted_items', '')
        
        # Split the string of deleted item IDs into a list of integers
        if deleted_items:
            deleted_item_ids = [int(item_id) for item_id in deleted_items.split(',')]
            
            # Delete the items from the database
            PurchaseItem.objects.filter(pur_item_id__in=deleted_item_ids).delete()
            
        messages.success(request, "Purchase order edited.")
        return redirect(reverse('order-details', kwargs={"po_id": po_id}))
        
    order = PurchaseOrder.objects.filter(po_id=po_id).first()
    pur_items = order.items.all()
    items = Item.objects.all()
    
    suppliers = Supplier.objects.all()
    
    return render(request, "purchase_order/edit_purchase_order.html",{
        "purchase_order": order,
        "suppliers": suppliers,
        "pur_items": pur_items,
        "items": items
    })

@csrf_exempt
def delete_purchase_order(request):
    if request.session['role'] == "employee":
        return redirect(reverse('dashboard:index'))
    
    if request.method == "POST":
        # Retrieve the list of selected item IDs from the form
        selected_ids = request.POST.getlist('selected_ids')

        if selected_ids:
            try:
                # Delete the selected items
                PurchaseOrder.objects.filter(po_id__in=selected_ids).delete()

                # Calculate updated pagination
                rows = request.session.get('rows', 10)
                current_page = int(request.session.get('page', 1))
                purchase_order_count = PurchaseOrder.objects.count()
                total_pages = (purchase_order_count + rows - 1) // rows  # Calculate total pages

                if current_page > total_pages:
                    current_page = max(total_pages, 1) 
                    
                # Show success message to the user
                if len(selected_ids) > 1:
                    messages.success(request, "Purchase orders deleted successfully!")
                else:
                    messages.success(request, "Purchase order deleted successfully!")

                return redirect(f"{reverse('purchase-order')}?page={current_page}&rows={rows}")

            except Exception as e:
                # Handle any errors that occur during deletion
                messages.error(request, f"Error deleting items: {str(e)}")

        else:
            # Handle case where no items were selected
            messages.error(request, "No items selected for deletion.")
        current_page = request.session.get('page', 1)
        rows = request.session.get('rows', 10)
        return redirect(f"{reverse('purchase-order')}?page={current_page}&rows={rows}")
    
