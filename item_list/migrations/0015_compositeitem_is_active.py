# Generated by Django 5.0.6 on 2024-12-31 09:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_list', '0014_compositeitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='compositeitem',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]