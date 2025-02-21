# Generated by Django 5.0.6 on 2025-01-01 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_list', '0024_alter_item_in_stock_alter_item_optimal_stock_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='in_stock',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='item',
            name='optimal_stock',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='item',
            name='reorder_level',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]
