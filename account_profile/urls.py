# account_profile/urls.py
from django.urls import path
from . import views

app_name = 'account_profile'  # Namespace for the app

urlpatterns = [
    path('edit-profile/', views.edit_account, name='edit_account'),  # URL for editing account
]
