from django.db import models
from item_category.models import Category
#from supplier.models import Supplier  # Assuming supplier model exists

class Item(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(null=True, blank=True)
    is_for_sale = models.BooleanField(default=False)
    sold_by = models.CharField(max_length=50, choices=[("each", "Each"), ("volume_weight", "Volume/Weight")])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.PositiveIntegerField()
    optimal_stock = models.PositiveIntegerField()
    reorder_level = models.PositiveIntegerField()
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2)
    volume_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    remaining_volume = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    #supplier = models.ForeignKey(Supplier, null=True, blank=True, on_delete=models.SET_NULL)
