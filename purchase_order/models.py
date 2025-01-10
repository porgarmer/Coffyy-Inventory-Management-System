from django.db import models
from item_list.models import Item
from supplier.models import Supplier
from datetime import date
# Create your models here.

class PurchaseOrder(models.Model):
    po_id = models.AutoField(primary_key=True)
    po_date = models.DateField(auto_now_add=False, auto_now=False, default=date.today, null=True)
    po_expected_date = models.DateField(auto_now_add=False, auto_now=False, null=True)
    po_status = models.CharField(max_length=50, default="Pending")
    po_notes = models.TextField(null=True)
    po_total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)

    # user_id = models.ForeignKey()
    supp_id = models.ForeignKey(Supplier, models.CASCADE, related_name="purchase_order")
    
    def __str__(self):
        return f"{self.po_id} - {self.po_date} - {self.po_expected_date} - {self.po_status} - {self.po_notes}"
    
class PurchaseItem(models.Model):
    pur_item_id = models.AutoField(primary_key=True)   
    pur_item_qty = models.PositiveIntegerField(null=True)    
    pur_item_received_items = models.PositiveIntegerField(null=True, default=0)
    pur_item_to_receive = models.PositiveIntegerField(null=True, default=0)
    pur_item_incoming = models.PositiveIntegerField(null=True, default=0)
    pur_item_purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)
    pur_item_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, default=0.00)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    po_id = models.ForeignKey(PurchaseOrder, models.CASCADE, null=True, related_name='items')
    
    def __str__(self):
        return f"{self.pur_item_id} -- {self.po_id} - {self.item_id.name} - {self.pur_item_qty}"