from django.db import models
from item_category.models import Category
#from supplier.models import Supplier  # Assuming supplier model exists

class Item(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(null=True, blank=True)
    is_for_sale = models.BooleanField(default=False)
    sold_by = models.CharField(max_length=50, choices=[("each", "Each"), ("volume_weight", "Volume/Weight")], null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    in_stock = models.IntegerField(null=True, blank=True, default=0)
    optimal_stock = models.IntegerField(null=True, blank=True, default=0)
    reorder_level = models.IntegerField(null=True, blank=True, default=0)
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    volume_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    remaining_volume = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    #supplier = models.ForeignKey(Supplier, null=True, blank=True, on_delete=models.SET_NULL)
    is_composite = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class CompositeItem(models.Model):
    parent_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="composite_items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="component_of")
    quantity = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)  # New field for soft delete

    def __str__(self):
        return f"{self.item.name} x {self.quantity} for {self.parent_item.name}"
