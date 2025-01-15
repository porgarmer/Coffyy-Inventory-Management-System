from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from login.models import User
from django.db import transaction
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q


def employee_list(request):
    if request.session['role'] == 'owner':
        query = request.GET.get('q', '')
        employees = User.objects.filter(role='employee')
        if query:
            employees = employees.filter(
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) 
            )
        return render(request, 'employee_manage/employee_list.html', {'employees': employees, 'query': query})
    else:
        return redirect('dashboard:index')
    

def add_employee(request):
    if request.session['role'] == 'owner':
        if request.method == 'POST':
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            email_address = request.POST['email_address']
            contact_number = request.POST['contact_number']
            username = request.POST['username']
            password = request.POST['password']
            
            try:
                if User.objects.filter(username=username).exists():
                    messages.error(request, 'Username already exists.')
                    return redirect('add_employee')
                if User.objects.filter(email_address=email_address).exists():
                    messages.error(request, 'Email address already exists.')
                    return redirect('add_employee')
                
                with transaction.atomic():
                    user = User(
                        username=username,
                        email_address=email_address,
                        password=make_password(password),
                        first_name=first_name,
                        last_name=last_name,
                        contact_number=contact_number,
                    )
                    user.role = 'employee'  # Explicitly set the role
                    user.save()
                    messages.success(request, 'Employee added successfully.')
                    return redirect('employee_list')
            except Exception as e:
                messages.error(request, f'Error adding employee: {str(e)}')
    
        return render(request, 'employee_manage/add_employee.html')
    else:
        return redirect('dashboard:index')

def delete_employees(request):
    if request.session['role'] == 'owner':
        if request.method == 'POST':
            employee_ids = request.POST.getlist('employee_ids')
            try:
                User.objects.filter(id__in=employee_ids, role='employee').delete()
                messages.success(request, 'Selected employees deleted successfully.')
            except Exception as e:
                messages.error(request, f'Error deleting employees: {str(e)}')
        
        return redirect('employee_list')
    else:
        return redirect('dashboard:index')