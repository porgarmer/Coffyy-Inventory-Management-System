from django.shortcuts import render, redirect
from .forms import EmployeeForm
from .models import Employee
from django.contrib import messages

def employee_list(request):
    employees = Employee.objects.all()
    return render(request, 'employee_management/employee_list.html', {'employees': employees})

def add_employee(request):
    if request.method == "POST":
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Employee added successfully!")
            return redirect('employee_list')  # Redirect to the employee list after submission
    else:
        form = EmployeeForm()
    return render(request, 'employee_management/add_employee.html', {'form': form})
