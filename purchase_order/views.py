from django.shortcuts import render

# Create your views here.

#Purchase order table
def purchase_order(request):
    
    if request.method == "POST":
        selected_option = request.POST.get("supplier")
        
    
    
    return render(request, "purchase_order/purchase_order.html")

#Add purchase order
def create_purchase_order(request):
    return render(request, "purchase_order/create_purchase_order.html")