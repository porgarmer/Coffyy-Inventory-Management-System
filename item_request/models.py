from django.db import models
from item_list.models import Item
from login.models import User
from datetime import date
# Create your models here.

class ItemRequest(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=False, auto_now=False, default=date.today, null=True)
    status = models.CharField(max_length=50, default="Pending")
    notes = models.TextField(null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)
    denial_reason = models.TextField(null=True)

    user = models.ForeignKey(User, models.CASCADE, related_name='user', null=True)
    
    def __str__(self):
        return f"{self.id} - {self.date} - {self.status} - {self.notes} - {self.denial_reason}"
    
class RequestedItem(models.Model):
    id = models.AutoField(primary_key=True)   
    qty = models.PositiveIntegerField(null=True)    
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    item_req = models.ForeignKey(ItemRequest, models.CASCADE, null=True, related_name='requested_items')

    def __str__(self):
        return f"{self.id} -- {self.item_req} - {self.item.name} - {self.qty}"