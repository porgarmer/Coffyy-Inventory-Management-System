from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import json
from login.models import User

def edit_account(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        user_data = {
            'contact_number': user.contact_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email_address': user.email_address,
        }
    else:
        user_data = {
            'contact_number': 'N/A',
            'first_name': 'Guest',
            'last_name': '',
            'email_address': '',
        }

    return render(request, 'account_profile/profile_admin.html', {'user_data': user_data})

@login_required
def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=request.user.id)
        user.contact_number = data.get('contactNumber', user.contact_number)
        user.first_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)
        user.email = data.get('email', user.email)
        user.save()

        # Update the session data
        request.session['user_data'] = {
            'contact_number': user.contact_number,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email_address': user.email,
        }

        # Add success message
        messages.success(request, 'Profile updated successfully!')

        return redirect('account_profile:edit_profile')  # Redirect back to profile admin page

@login_required
def update_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(id=request.user.id)
        user.set_password(data['password'])  # Securely hash the password
        user.save()

        # Add success message
        messages.success(request, 'Password updated successfully!')

        return redirect('account_profile:edit_profile')  # Redirect back to profile admin page

@login_required
def delete_account(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        user.delete()
        request.session.flush()  # Clear all session data

        # Add success message
        messages.success(request, 'Account deleted successfully!')

        return redirect('login:login_index')  # Redirect to login page
