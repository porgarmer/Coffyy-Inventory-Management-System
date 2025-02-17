# Generated by Django 5.0.6 on 2025-01-04 07:30

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_name', models.CharField(max_length=100)),
                ('first_name', models.CharField(max_length=100)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('business_name', models.CharField(blank=True, max_length=100, null=True)),
                ('email_address', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255, validators=[django.core.validators.MinLengthValidator(8)])),
            ],
        ),
    ]
