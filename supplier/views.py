from django.contrib import messages

from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Supplier
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
import requests
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def suppliers(request):
    page = request.GET.get('page', 1)
    rows = request.GET.get('rows', 10)
    search_query = request.GET.get('search', '').strip()


    if search_query:
        suppliers = Supplier.objects.filter(
            Q(supp_name__icontains=search_query)|
            Q(supp_contact_person__icontains=search_query)|
            Q(supp_contact_number__icontains=search_query)|
            Q(supp_email__icontains=search_query)
        )
    else:
        suppliers= Supplier.objects.all()
        
    suppliers = suppliers.order_by("-created_at").values()
    paginator = Paginator(suppliers, rows)
    suppliers_page = paginator.get_page(page)
    return render(request, 'supplier/supplier.html', {
        "suppliers": suppliers_page,
        "rows_per_page": rows,
        "search_query": search_query
        })

def add_supplier(request):
    if request.method == "POST":
        name = request.POST.get("supplier-name")
        contact_person = request.POST.get("contact-person")
        contact_number = request.POST.get("contact-number")
        email = request.POST.get("email")
        website = request.POST.get("website")
        social_media = request.POST.get("social-media")
        
        # Codes
        province = request.POST.get("province")
        municipality = request.POST.get("municipality")
        barangay = request.POST.get("barangay")
        
        province_name = request.POST.get("province-name")
        municipality_name = request.POST.get("municipality-name")
        barangay_name = request.POST.get("barangay-name")
        
        
        zipcode = request.POST.get("zip-code")
        specific_location = request.POST.get("specific-location")
        

        notes = request.POST.get("notes")
        
        Supplier.objects.create(
            supp_name=name,
            supp_contact_person=contact_person,
            supp_contact_number=contact_number,
            supp_email=email,
            supp_website=website,
            supp_social_media=social_media,
            
            supp_province_code = province,
            supp_municipality_code=municipality,
            supp_barangay_code=barangay,
            
            supp_province=province_name,
            supp_municipality=municipality_name,
            supp_barangay=barangay_name,
            
            supp_zipcode=zipcode,
            supp_address=specific_location,
            supp_notes=notes
        )
        
        return redirect(reverse("suppliers"))
        
    provinces = requests.get("https://psgc.gitlab.io/api/provinces/")
    if provinces.status_code == 200:
        provinces = provinces.json()
        provinces = sorted(provinces, key=lambda x: x["name"])
        return render(request, 'supplier/add_supplier.html',{
            "provinces": provinces
        })
    else:
        provinces = []
        return render(request, 'supplier/add_supplier.html',{
            "provinces": provinces
        })
    

def edit_supplier(request, supp_id):    
    if request.method == "POST":
        supplier = Supplier.objects.get(supp_id=supp_id)
        name = request.POST.get("supplier-name")
        contact_person = request.POST.get("contact-person")
        contact_number = request.POST.get("contact-number")
        email = request.POST.get("email")
        website = request.POST.get("website")
        social_media = request.POST.get("social-media")
        
        # Codes
        province = request.POST.get("province")
        municipality = request.POST.get("municipality")
        barangay = request.POST.get("barangay")
        
        province_name = request.POST.get("province-name")
        municipality_name = request.POST.get("municipality-name")
        barangay_name = request.POST.get("barangay-name")
        
        
        zipcode = request.POST.get("zip-code")
        specific_location = request.POST.get("specific-location")
        

        notes = request.POST.get("notes")
        
        supplier.supp_name=name
        supplier.supp_contact_person=contact_person
        supplier.supp_contact_number=contact_number
        supplier.supp_email=email
        supplier.supp_website=website
        supplier.supp_social_media=social_media
            
        supplier.supp_province_code = province
        supplier.supp_municipality_code=municipality
        supplier.supp_barangay_code=barangay
    
        if province_name:
            supplier.supp_province=province_name
        if municipality_name:
            supplier.supp_municipality=municipality_name
        if barangay_name:
            supplier.supp_barangay=barangay_name
        
        supplier.supp_zipcode=zipcode
        supplier.supp_address=specific_location
        supplier.supp_notes=notes
        
        supplier.save()
        messages.success(request, "Supplier edited.")
        return redirect(reverse('suppliers'))
    
    else:
        supplier = Supplier.objects.get(supp_id=supp_id)
        province_code = supplier.supp_province_code
        municipality_code = supplier.supp_municipality_code
        
        provinces = requests.get("https://psgc.gitlab.io/api/provinces/")
        municipalities = requests.get(f"https://psgc.gitlab.io/api/provinces/{province_code}/cities-municipalities/")
        barangays = requests.get(f"https://psgc.gitlab.io/api/cities-municipalities/{municipality_code}/barangays/")
        
        if provinces.status_code == 200  and municipalities.status_code == 200 and barangays.status_code == 200:
            provinces = provinces.json()
            provinces = sorted(provinces, key=lambda x: x["name"])
            
            municipalities = municipalities.json()
            municipalities = sorted(municipalities, key=lambda x: x["name"])
            
            barangays = barangays.json()
            barangays = sorted(barangays, key=lambda x: x["name"])

        else:
            provinces = []
            municipalities = []
            barangays = []
        
        return render(request, "supplier/edit_supplier.html", {
            "provinces": provinces,
            "municipalities": municipalities,
            "supplier": supplier,
            "barangays": barangays
        })
    
@csrf_exempt
def delete_supplier(request):
    if request.method == "POST":
        # Retrieve the list of selected item IDs from the form
        selected_ids = request.POST.getlist('selected_ids')

        if selected_ids:
            try:
                # Delete the selected items
                Supplier.objects.filter(supp_id__in=selected_ids).delete()

                # Calculate updated pagination
                rows = request.session.get('rows', 10)
                current_page = int(request.session.get('page', 1))
                purchase_order_count = Supplier.objects.count()
                total_pages = (purchase_order_count + rows - 1) // rows  # Calculate total pages

                if current_page > total_pages:
                    current_page = max(total_pages, 1) 
                    
                # Show success message to the user
                if len(selected_ids) > 1:
                    messages.success(request, "Supppliers deleted successfully!")
                else:
                    messages.success(request, "Suppplier deleted successfully!")


                return redirect(f"{reverse('suppliers')}?page={current_page}&rows={rows}")

            except Exception as e:
                # Handle any errors that occur during deletion
                messages.error(request, f"Error deleting items: {str(e)}")

        else:
            # Handle case where no items were selected
            messages.error(request, "No items selected for deletion.")
        current_page = request.session.get('page', 1)
        rows = request.session.get('rows', 10)
        return redirect(f"{reverse('suppliers')}?page={current_page}&rows={rows}")
    

def zip_codes(request):
    file_path = "supplier\static\zip_codes\zipco.json"

    with open(file_path, "r") as file:
        data = json.load(file)
        
    print(data)
    return JsonResponse(data=data, safe=False)
    
    
def check_supplier(request, supp_name):
    if request.method == "GET":
        try:
            supplier = Supplier.objects.get(supp_name=supp_name)
            if supplier:
                return JsonResponse({"supplierExists": True})

        except Supplier.DoesNotExist:
            return JsonResponse({"supplierExists": False})    
