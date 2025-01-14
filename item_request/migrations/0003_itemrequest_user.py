# Generated by Django 5.1.4 on 2025-01-14 14:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_request', '0002_requesteditem_purchase_cost'),
        ('login', '0005_alter_user_contact_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemrequest',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to='login.user'),
        ),
    ]
