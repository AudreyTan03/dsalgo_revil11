from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from user.models import User
from user.models import Profile
from user.models import UserPreference

class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ["id" , "email", "name", "is_student", "is_instructor", "is_active", "is_admin"]  # Add 'is_student' and 'is_instructor' to list_display
    list_filter = ["is_admin", "is_active", "is_student", "is_instructor"]  # Add 'is_student' and 'is_instructor' to list_filter
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name"]}),
        ("Permissions", {"fields": ["is_admin", "is_active", "is_student", "is_instructor"]}),  # Add 'is_student' and 'is_instructor' to fieldsets
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "password1", "password2", "is_admin", "is_active", "is_student", "is_instructor"],  # Add 'is_student' and 'is_instructor' to add_fieldsets
            },
        ),
    ]
    search_fields = ["email",]
    ordering = ["email", "id"]
    filter_horizontal = []
    list_editable = ["is_student", "is_instructor"]  # Allow editing 'is_student' and 'is_instructor' directly from the list view

# Register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
admin.site.register(Profile)


class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'theme')  # Display the user and theme preference in the list view
    search_fields = ('user__name',)  # Add search functionality based on the user's name
    list_filter = ('theme',)  # Add filter options for the theme preference

admin.site.register(UserPreference, UserPreferenceAdmin)

