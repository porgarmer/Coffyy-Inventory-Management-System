# Generated by Django 5.1.4 on 2025-01-01 05:35

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('item_list', '0014_compositeitem'),
        ('supplier', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PurchaseOrder',
            fields=[
                ('po_id', models.AutoField(primary_key=True, serialize=False)),
                ('po_date', models.DateField(default=datetime.date.today, null=True)),
                ('po_expected_date', models.DateField(null=True)),
                ('po_status', models.CharField(default='Pending', max_length=50)),
                ('po_notes', models.TextField(null=True)),
                ('supp_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='supplier.supplier')),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseItem',
            fields=[
                ('pur_item_id', models.AutoField(primary_key=True, serialize=False)),
                ('pur_item_qty', models.PositiveIntegerField(null=True)),
                ('pur_item_received_items', models.PositiveIntegerField(null=True)),
                ('pur_item_to_receive', models.PositiveIntegerField(null=True)),
                ('pur_item_incoming', models.PositiveIntegerField(null=True)),
                ('pur_item_purchase_cost', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('pur_item_total_amount', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('item_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='item_list.item')),
                ('po_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='purchase_order.purchaseorder')),
            ],
            
        ),
         migrations.RunSQL(
           "UPDATE sqlite_sequence SET seq = 1000 WHERE name = 'PurchaseOrder';",
           "UPDATE sqlite_sequence SET seq = 0 WHERE name = 'PurchaseOrder';"
        )
    ]