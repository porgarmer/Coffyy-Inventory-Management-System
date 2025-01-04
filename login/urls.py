from django.urls import path
from . import views

app_name = 'login'  # Define the namespace for the app

urlpatterns = [
    path('', views.index, name='login_index'),  # Root URL points to the index view
    path('register/', views.register, name='register'),
    path('forgot-password/', views.forgot_pass, name='forgot_pass'),
    path('forgot-password-email/', views.forgot_pass_email, name='forgot_pass_email'),
]
