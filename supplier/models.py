from django.db import models

# Create your models here.
class Supplier(models.Model):
    supp_id = models.AutoField(primary_key=True)
    supp_name = models.CharField(max_length=100)
    supp_contact_person = models.CharField(max_length=100, null=True)
    supp_contact_number = models.CharField(max_length=100, null=True)
    supp_address = models.CharField(max_length=255, null=True)
    supp_address_info = models.CharField(max_length=255, null=True)
    supp_email = models.EmailField(max_length=100, null=True)
    supp_social_media = models.URLField(max_length=100, null=True)
    supp_website = models.URLField(max_length=100, null=True)
    supp_notes = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.supp_name
    