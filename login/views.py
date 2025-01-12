from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
from django.views.decorators.csrf import csrf_exempt
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

@csrf_exempt
def register(request):
    # Check if an owner already exists
    if User.objects.filter(role='owner').exists():
        messages.error(request, "Registration is closed. The owner has already registered.")
        return redirect('login:login_index')

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

        # Validate contact number length
        if len(contact_number) != 11 or not contact_number.isdigit():
            messages.error(request, "Contact number must be exactly 11 digits.")
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


@csrf_exempt
def forgot_pass(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm-password")

        # Check if username is provided
        if not username:
            messages.error(request, "Username is required.")
            return render(request, "login/forgot_pass.html")

        # Check if user exists in the database
        user = User.objects.filter(username=username).first()
        if not user:
            messages.error(request, "Username not found.")
            return render(request, "login/forgot_pass.html")

        # Validate passwords
        if not password or len(password) < 8:
            messages.error(request, "Password must be at least 8 characters long.")
            return render(request, "login/forgot_pass.html")

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, "login/forgot_pass.html")

        # Update user's password
        user.password = make_password(password)  # Hash the new password
        user.save()

        messages.success(request, "Your password has been reset successfully.")
        return redirect("login:login_index")  # Redirect to the login page

    return render(request, "login/forgot_pass.html")
