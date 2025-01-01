# Generated by Django 5.0.6 on 2025-01-01 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_list', '0019_alter_item_purchase_cost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='purchase_cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
    ]
