# Generated by Django 5.1.4 on 2025-01-13 20:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('supplier', '0007_rename_supp_provice_code_supplier_supp_province_code'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supplier',
            old_name='supp_provice',
            new_name='supp_province',
        ),
    ]
