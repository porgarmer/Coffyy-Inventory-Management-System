from django.urls import path
from . import views

app_name = 'employee_management'  # Add this line

urlpatterns = [
    path('employees/', views.employee_list, name='employee_list'),
    path('add_employee/', views.add_employee, name='add_employee'),
]
