from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages
from login.models import User
from django.views.decorators.csrf import csrf_exempt
import json

def view_account(request):
    """
    View to load the profile page with user data.
    """
    user_id = request.session.get('user_id')
    if not user_id:
        messages.error(request, "You must be logged in.")
        return redirect('account_profile:login_index')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        messages.error(request, "User not found.")
        return redirect('account_profile:login_index')

    # Render profile_admin.html with user data
    return render(request, 'account_profile/profile_admin.html', {'user': user})


@csrf_exempt
def edit_account(request):
    """
    API endpoint to handle profile edits.
    """
    if request.method == 'POST':
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({"success": False, "error": "User not authenticated."})

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found."})

        try:
            data = json.loads(request.body)
            operation = data.get('operation')

            if operation == 'update_profile':
                contact_number = data.get('contact-number', '').strip()
                first_name = data.get('first-name', '').strip()
                last_name = data.get('last-name', '').strip()
                email = data.get('email', '').strip()

                # Validate contact number
                if len(contact_number) != 11 or not contact_number.isdigit():
                    return JsonResponse({"success": False, "error": "Invalid contact number. Must be 11 digits long."})

                # Validate email format
                from django.core.validators import validate_email
                from django.core.exceptions import ValidationError
                try:
                    validate_email(email)
                except ValidationError:
                    return JsonResponse({"success": False, "error": "Invalid email format."})
                
                # Validate contact number uniqueness
                if User.objects.filter(contact_number=contact_number).exclude(id=user_id).exists():
                    return JsonResponse({"success": False, "error": "Contact number already exists. Please use a different one."})


                # Update user details
                user.contact_number = contact_number
                user.first_name = first_name
                user.last_name = last_name
                user.email_address = email
                user.save()

                return JsonResponse({"success": True, "message": "Profile updated successfully!"})

            elif operation == 'update_password':
                new_password = data.get('password')

                if len(new_password) < 8:
                    return JsonResponse({"success": False, "error": "Password must be at least 8 characters long."})

                if check_password(new_password, user.password):
                    return JsonResponse({"success": False, "error": "The new password cannot be the same as the current password."})

                user.password = make_password(new_password)
                user.save()
                return JsonResponse({"success": True, "message": "Password updated successfully!"})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON data."})
        except Exception as e:
            return JsonResponse({"success": False, "error": f"Unexpected error: {str(e)}"})

    return JsonResponse({"success": False, "error": "Invalid request method."})

def update_password(request):
    """
    View to handle password updates.
    """
    if request.method == 'POST':
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({"success": False, "error": "User not authenticated."})

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found."})

        data = json.loads(request.body)
        new_password = data.get('password')

        if len(new_password) < 8:
            return JsonResponse({"success": False, "error": "Password must be at least 8 characters long."})

        if check_password(new_password, user.password):
            return JsonResponse({"success": False, "error": "The new password cannot be the same as the current password."})

        user.password = make_password(new_password)
        user.save()
        return JsonResponse({"success": True, "message": "Password updated successfully!"})

    return JsonResponse({"success": False, "error": "Invalid request method."})

@csrf_exempt
def delete_accounts(request):
    """
    View to delete.
    """
    if request.method == 'POST':
        user_id = request.session.get('user_id')
        if not user_id:
            return JsonResponse({"success": False, "error": "User not authenticated."})

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found. Please ensure you're registered before attempting to login."})
        try:
            User.objects.all().delete()  # Delete all user accounts
            return JsonResponse({"success": True, "redirect": "/"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=400)