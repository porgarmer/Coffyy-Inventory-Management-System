from django.contrib import admin
from .models import Item

# Register the Item model
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    # Customize the list display
    list_display = ('name', 'category', 'is_for_sale', 'price', 'sold_by', 'cost', 'in_stock', 'optimal_stock', 'reorder_level','purchase_cost','volume_per_unit','remaining_volume')
    search_fields = ('name', 'description')
    list_filter = ('category', 'is_for_sale')
