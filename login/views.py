from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
from .models import User

def index(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                request.session['username'] = user.username
                request.session['user_id'] = user.id  # Store user ID for hidden purposes
                messages.success(request, f"Welcome back, {user.first_name}!")
                return redirect('dashboard:index')  # Redirect to the dashboard
            else:
                messages.error(request, "Incorrect password. Please try again.")
        except User.DoesNotExist:
            messages.error(request, "Account does not exist. Please register first.")
    
    return render(request, "login/login.html")


def register(request):
    # Check if an owner already exists
    if User.objects.filter(role='owner').exists():
        # Redirect with an error message if the owner has already registered
        messages.error(request, "Registration is closed. The owner has already registered.")
        return redirect('login:login_index')  # Redirect to the login page or another appropriate page

    if request.method == 'POST':
        # Extract form data
        first_name = request.POST.get('first-name')
        last_name = request.POST.get('last-name')
        username = request.POST.get('username')
        contact_number = request.POST.get('contact-number')
        email_address = request.POST.get('email-address')
        password = request.POST.get('password')

        # Validate password length
        if len(password) < 8:
            messages.error(request, "Password must be at least 8 characters long.")
            return redirect('login:register')

        # Save the user with the 'owner' role
        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            contact_number=contact_number,
            email_address=email_address,
            password=make_password(password),
            role='owner'
        )
        user.save()

        # Success message
        messages.success(request, "Registration successful! You are now the owner. Please log in.")
        return redirect('login:login_index')

    # If the owner does not exist, render the registration form
    return render(request, 'login/register.html')

def forgot_pass(request):
    return render(request, "login/forgot_pass.html")

def forgot_pass_email(request):
    return render(request, "login/forgot_pass_email.html")
