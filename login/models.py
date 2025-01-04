from django.db import models
from django.core.validators import MinLengthValidator

class User(models.Model):
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    username = models.CharField(max_length=50, unique=True)
    business_name = models.CharField(max_length=100, blank=True, null=True)
    email_address = models.EmailField(unique=True)
    password = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(8)]
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"
