from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from login import views as login_views



app_name = 'account_profile'  # Namespace for the app

urlpatterns = [
    path('login/', login_views.index, name='login_index'),  # Login redirection
    path('', views.edit_account, name='edit_account'),  # URL for editing account
]