from django.contrib import admin
from .models import ItemRequest, RequestedItem
# Register your models here.
admin.site.register(ItemRequest)
admin.site.register(RequestedItem)