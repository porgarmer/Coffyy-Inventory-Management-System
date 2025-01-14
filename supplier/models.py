from django.db import models
from django.utils.timezone import now
# Create your models here.
class Supplier(models.Model):
    supp_id = models.AutoField(primary_key=True)
    supp_name = models.CharField(max_length=100)
    supp_contact_person = models.CharField(max_length=100, null=True)
    supp_contact_number = models.CharField(max_length=100, null=True)
    supp_province =  models.CharField(max_length=255, null=True)
    supp_municipality = models.CharField(max_length=255, null=True)
    supp_barangay = models.CharField(max_length=255, null=True)
    supp_province_code =  models.CharField(max_length=255, null=True)
    supp_municipality_code = models.CharField(max_length=255, null=True)
    supp_barangay_code = models.CharField(max_length=255, null=True)
    supp_zipcode = models.CharField(max_length=255, null=True)
    supp_address = models.CharField(max_length=255, null=True)
    supp_email = models.EmailField(max_length=100, null=True)
    supp_social_media = models.URLField(max_length=100, null=True)
    supp_website = models.URLField(max_length=100, null=True)
    supp_notes = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(default=now)
    
    def __str__(self):
        return self.supp_name
    