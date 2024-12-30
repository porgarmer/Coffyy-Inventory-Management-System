# Generated by Django 5.0.6 on 2024-12-29 14:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_list', '0005_delete_compositeitem'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompositeItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('component_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='used_in_composites', to='item_list.item')),
                ('parent_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='composite_items', to='item_list.item')),
            ],
        ),
    ]
