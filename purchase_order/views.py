from django.shortcuts import render
from supplier.models import Supplier
from .models import PurchaseOrder, PurchaseItem
from item_list.models import Item
from django.http import HttpResponse
# Create your views here.

#Purchase order table
def purchase_order(request):
    
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
            
    
    
    return render(request, "purchase_order/purchase_order.html")

#Add purchase order
def create_purchase_order(request):
    
    suppliers = Supplier.objects.all()
    items = Item.objects.all()
    return render(request, "purchase_order/create_purchase_order.html", {
        'suppliers': suppliers,
        'items': items
    })