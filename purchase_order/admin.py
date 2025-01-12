from django.contrib import admin

# Register your models here.
from .models import PurchaseOrder, PurchaseItem

admin.site.register(PurchaseOrder)
admin.site.register(PurchaseItem)