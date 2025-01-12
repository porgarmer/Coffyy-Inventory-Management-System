from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Supplier
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
import requests
import json
import pandas as pd
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
        
    suppliers = suppliers.order_by("supp_name")
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
        province = request.POST.get("province")
        municipality = request.POST.get("municipality")
        barangay = request.POST.get("barangay")
        zip_code = request.POST.get("zip-code")
        specific_location = request.POST.get("specific-location")
        notes = request.POST.get("notes")
        address = f"{specific_location}-{barangay}-{municipality}-{zip_code}-{province}"
        
        Supplier.objects.create(
            supp_name=name,
            supp_contact_person=contact_person,
            supp_contact_number=contact_number,
            supp_email=email,
            supp_website=website,
            supp_social_media=social_media,
            supp_address=address,
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
    

def edit_supplier(request):
    pass

def delete_supplier(request):
    pass

def zip_codes(request):
    file_path = "supplier\static\zip_codes\zipco.json"

    with open(file_path, "r") as file:
        data = json.load(file)
        
    print(data)
    return JsonResponse(data=data, safe=False)
    