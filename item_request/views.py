from django.shortcuts import render,redirect
from django.urls import reverse
from supplier.models import Supplier
from item_list.models import Item
from .models import ItemRequest, RequestedItem
from django.db.models import Sum, Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
# Create your views here.

#Item request table
def item_request(request):

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
        
    request.session['item_request_list'] = page
    request.session['item_request_list'] = rows
    
    status = request.GET.get('status', 'All')
    search_query = request.GET.get('search', '').strip()
    #selected_requester = request.GET.get('requester')


    item_requests = ItemRequest.objects.all()
    
    if search_query:
        item_requests = item_requests.filter(
                Q(id__icontains=search_query) |
                Q(notes__icontains=search_query) |
                Q(status__icontains=search_query) |
                Q(denial_reason__icontains=search_query) 
            )
        
    if status == "All":
        item_requests = item_requests.all()
    else:
        item_requests = item_requests.filter(
                    status=status
                )
        
    item_requests = item_requests.order_by('date')
    paginator = Paginator(item_requests, rows)
    
    try:
        item_requests_page = paginator.page(page)
    except PageNotAnInteger:
        item_requests_page = paginator.page(1)
    except EmptyPage:
        item_requests_page = paginator.page(paginator.num_pages)
        
    page_range = item_requests_page.paginator.page_range
    current_page = item_requests_page.number
    start_page = max(current_page - 5, 1)
    end_page = min(current_page + 4, paginator.num_pages)
    page_range = page_range[start_page - 1:end_page]
    
    return render(request, "item_request/item_request.html", {
        "item_requests": item_requests_page,
        'rows_per_page': rows,
        'page_range': page_range,
        "search_query": search_query,
        #"selected_requester": selected_requester,
        "status": status,
    })
#Create item request
def create_item_request(request):
    if request.method == "POST":
        date = request.POST.get("date")
        notes = request.POST.get("notes")
        total_amount = request.POST.get("items-total-amount")
        
        item_request_entry = ItemRequest.objects.create(
            date = date,
            status = "Pending",
            notes = notes,
            total_amount = total_amount,
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

            RequestedItem.objects.create(
                item_req = item_request_entry,
                item = Item.objects.get(id=item_id),
                qty = quantity,
                purchase_cost = purchase_cost,
                amount = amount
            )

            index += 1
            
        messages.success(request, "Item request created.")
        # return redirect(reverse('order-details', kwargs={"po_id": purchase_order_entry.po_id}))
        return redirect(reverse('item-request'))
    items = Item.objects.all()
    return render(request, "item_request/create_item_request.html", {
        'items': items
    })
    
def request_details(request, id):
    item_request = ItemRequest.objects.filter(id=id).annotate(
        total_qty=Sum("requested_items__qty"),
    ).first()

    items = item_request.requested_items.all()
    
    return render(request, "item_request/item_request_details.html",{
        "item_request": item_request,
        "items": items,
    })
    
# def receive_items(request, po_id):
#     if request.method == "POST":
#                 # Retrieve all IDs as a list
#         item_ids = request.POST.getlist("pur-item-id")
#         to_receive = request.POST.getlist("to-receive")
        
#         for item_id, receive in zip(item_ids, to_receive):
#             if receive:
#                 pur_item = PurchaseItem.objects.get(pur_item_id=item_id)
#                 pur_item.pur_item_received_items += int(receive)
#                 pur_item.item_id.in_stock += int(receive)
#                 pur_item.item_id.save()
#                 pur_item.save()

#         return redirect(reverse('order-details', kwargs={"po_id": po_id}))

#     items = PurchaseItem.objects.filter(po_id=po_id)
#     return render(request, "purchase_order/receive_items.html", {
#         "po_id": po_id,
#         "items": items
#     })

def edit_item_request(request, id=None):
    if request.method == "POST":
        item_request = ItemRequest.objects.get(id=id)
        
        date = request.POST.get("date")
        notes = request.POST.get("notes", '')
        total_amount = request.POST.get("items-total-amount")
    
        item_request.date = date
        item_request.notes = notes
        item_request.total_amount = total_amount
        item_request.save()

        # For existing items
        index = 1
        while True:
            requested_item_id = request.POST.get(f'items-{index}-requested-item-exist')
            item_id = request.POST.get(f'items-{index}-id-exist')
            purchase_cost = request.POST.get(f'items-{index}-purchase-cost-exist')
            quantity = request.POST.get(f'items-{index}-quantity-exist')
            amount = request.POST.get(f'items-{index}-amount-exist')
            
            if not requested_item_id:  # Stop if no more items are found
                break
            
            else:
                try:
                    requested_item = RequestedItem.objects.get(id=requested_item_id)
                    requested_item.qty = int(quantity)
                    requested_item.purchase_cost = float(purchase_cost)
                    requested_item.amount = float(amount)
                    requested_item.save()
                except requested_item.DoesNotExist:
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
            
            RequestedItem.objects.create(
                    item_req = item_request,
                    item = Item.objects.get(id=item_id),
                    qty = quantity,
                    purchase_cost = purchase_cost,
                    amount = amount
                )

            index += 1
        
        # Get the list of deleted items from the hidden input
        deleted_items = request.POST.get('deleted_items', '')
        
        # Split the string of deleted item IDs into a list of integers
        if deleted_items:
            deleted_item_ids = [int(item_id) for item_id in deleted_items.split(',')]
            
            # Delete the items from the database
            RequestedItem.objects.filter(id__in=deleted_item_ids).delete()
            
        messages.success(request, "Item request edited.")
        return redirect(reverse('request-details', kwargs={"id": id}))
        
    item_request = ItemRequest.objects.filter(id=id).first()
    requested_items = item_request.requested_items.all()
    items = Item.objects.all()
    
    
    return render(request, "item_request/edit_item_request.html",{
        "item_request": item_request,
        "items": items,
        "requested_items": requested_items
    })

@csrf_exempt
def delete_item_request(request):
    if request.method == "POST":
        # Retrieve the list of selected item IDs from the form
        selected_ids = request.POST.getlist('selected_ids')

        if selected_ids:
            try:
                # Delete the selected items
                ItemRequest.objects.filter(id__in=selected_ids).delete()

                # Calculate updated pagination
                rows = request.session.get('rows', 10)
                current_page = int(request.session.get('page', 1))
                item_request_count = ItemRequest.objects.count()
                total_pages = (item_request_count + rows - 1) // rows  # Calculate total pages

                if current_page > total_pages:
                    current_page = max(total_pages, 1) 
                    
                # Show success message to the user
                if len(selected_ids) > 1:
                    
                    messages.success(request, "Item requests deleted successfully!")
                else:
                    messages.success(request, "Item request deleted successfully!")

                return redirect(f"{reverse('item-request')}?page={current_page}&rows={rows}")

            except Exception as e:
                # Handle any errors that occur during deletion
                messages.error(request, f"Error deleting items: {str(e)}")

        else:
            # Handle case where no items were selected
            messages.error(request, "No items selected for deletion.")
        current_page = request.session.get('page', 1)
        rows = request.session.get('rows', 10)
        return redirect(f"{reverse('item-request')}?page={current_page}&rows={rows}")
    

