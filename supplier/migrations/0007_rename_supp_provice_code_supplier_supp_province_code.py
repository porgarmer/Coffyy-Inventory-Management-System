# Generated by Django 5.1.4 on 2025-01-13 20:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('supplier', '0006_rename_sup_barangay_supplier_supp_barangay_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supplier',
            old_name='supp_provice_code',
            new_name='supp_province_code',
        ),
    ]
