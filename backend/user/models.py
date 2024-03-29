from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.dispatch import receiver
import pyotp
from django.db.models.signals import post_save

# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, is_instructor=False, is_student=False):
        """
        Creates and saves a User with the given email, name, and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            is_instructor=is_instructor,
            is_student=is_student,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_student(self, email, name, password=None):
        """
        Creates and saves a student user with the given email and name.
        """
        return self.create_user(email, name, password=password, is_student=True)

    def create_instructor(self, email, name, password=None):
        """
        Creates and saves an instructor user with the given email and name.
        """
        return self.create_user(email, name, password=password, is_instructor=True)

    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, name, and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            is_instructor=True,  # Superusers are considered instructors
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_instructor = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)  # New field to differentiate between students
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Choices for user type
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )

    # Add the user_type field
    user_type = models.CharField(choices=USER_TYPE_CHOICES, max_length=20, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin
    
    

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


class OTP(models.Model):
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    otp_secret = models.CharField(max_length=16)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user.name
    
    def generate_otp(self):
        totp = pyotp.TOTP(self.otp_secret)
        return totp.now()
    
    def verify(self, entered_otp):
        totp = pyotp.TOTP(self.otp_secret)
        return totp.verify(entered_otp)

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    theme = models.CharField(max_length=10, choices=(('light', 'Light'), ('dark', 'Dark')), default='light')

    def __str__(self):
        return f"{self.user.name}'s Preference"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='userprofile_pics')
    name = models.CharField(max_length=200)
    bio =  models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.name
   
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        UserPreference.objects.create(user=instance, theme='light')
    else:
        instance.profile.save()


  
# @receiver(post_save, sender=User)
# def create_or_update_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)
#     else:
#         instance.profile.save()



