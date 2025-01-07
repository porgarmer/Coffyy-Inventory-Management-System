from django.db import models
from django.core.validators import MinLengthValidator

class User(models.Model):
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    username = models.CharField(max_length=50, unique=True)
    business_name = models.CharField(max_length=100, blank=True, null=True)
    contact_number = models.CharField(max_length=50, blank=True, null=True)
    email_address = models.EmailField(unique=True)
    password = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(8)]
    )
    role = models.CharField(max_length=50, default='unassigned')  

    def save(self, *args, **kwargs):
        # Ensure that the first user is assigned the 'owner' role
        if not User.objects.exists():
            self.role = 'owner'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"
