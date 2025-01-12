from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from login.models import User
from django.db import transaction

# @login_required
def employee_list(request):
    employees = User.objects.filter(role='employee')
    return render(request, 'employee_manage/employee_list.html', {'employees': employees})

# @login_required
def add_employee(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        contact_number = request.POST['contact_number']
        username = request.POST['username']
        password = request.POST['password']
        
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    contact_number=contact_number,
                    role='employee'
                )
                messages.success(request, 'Employee added successfully.')
                return redirect('employee_list')
        except Exception as e:
            messages.error(request, f'Error adding employee: {str(e)}')
    
    return render(request, 'employee_manage/add_employee.html')

# @login_required
def delete_employees(request):
    if request.method == 'POST':
        employee_ids = request.POST.getlist('employee_ids')
        try:
            User.objects.filter(id__in=employee_ids, role='employee').delete()
            messages.success(request, 'Selected employees deleted successfully.')
        except Exception as e:
            messages.error(request, f'Error deleting employees: {str(e)}')
    
    return redirect('employee_list')