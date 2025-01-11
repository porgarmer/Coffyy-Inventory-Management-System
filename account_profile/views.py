from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from login.models import User
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.shortcuts import redirect, render

@csrf_exempt
def edit_account(request):
    user_id = request.session.get('user_id')
    if not user_id:
        messages.error(request, "You must be logged in.")
        return redirect("{% url 'login:login_index' %}")

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        messages.error(request, "User not found.")
        return redirect("{% url 'login:login_index' %}")

    if request.method == 'POST':
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

                # Optional: Validate email format
                from django.core.validators import validate_email
                from django.core.exceptions import ValidationError

                try:
                    validate_email(email)
                except ValidationError:
                    return JsonResponse({"success": False, "error": "Invalid email format."})

                # Update fields
                user.contact_number = contact_number
                user.first_name = first_name
                user.last_name = last_name
                user.email_address = email
                user.save()

                return JsonResponse({"success": True, "message": "Profile updated successfully!"})

            elif operation == 'update_password':
                new_password = data.get('password')

                # Validate password length
                if len(new_password) < 8:
                    return JsonResponse({"success": False, "error": "Password must be at least 8 characters long."})

                # Check if new password is the same as the current password
                if check_password(new_password, user.password):
                    return JsonResponse({"success": False, "error": "The new password cannot be the same as the current password."})

                # Save the new password
                user.password = make_password(new_password)
                user.save()

                return JsonResponse({"success": True, "message": "Password updated successfully!"})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON data."})
        except Exception as e:
            return JsonResponse({"success": False, "error": "An unexpected error occurred. Please try again."})

    return render(request, "account_profile/profile_admin.html", {"user": user})
