from django.contrib import admin
from .models import Item, CompositeItem
from item_category.models import Category

# Register the CompositeItem model with inline editing
class CompositeItemInline(admin.TabularInline):
    model = CompositeItem
    extra = 1  # Number of empty forms to display by default
    fk_name = "parent_item"  # Link to the parent item
    verbose_name = "Component Item"
    verbose_name_plural = "Component Items"
    fields = ("item", "quantity")
    autocomplete_fields = ("item",)

# Customize the Item admin page
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    # Customize the list display
    list_display = (
        "name", "description","category", "is_for_sale", "price", "sold_by",
        "cost", "in_stock", "optimal_stock", "reorder_level",
        "purchase_cost", "volume_per_unit", "remaining_volume", "cost_per_m", "is_composite"
    )
    search_fields = ("name", "description")
    list_filter = ("category", "is_for_sale", "is_composite")
    
    # Inline composite items for composite parent items
    inlines = [CompositeItemInline]

    # Make the admin form dynamic based on `is_composite`
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if obj and obj.is_composite:
            # Add composite items inline if the item is a composite
            fields = list(fields)  # Convert to list for modification
            fields.append("is_composite")
        return fields
