# Generated by Django 4.2.10 on 2024-03-18 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_userpreference_profile_theme_preference'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userpreference',
            name='dark_mode',
        ),
        migrations.AddField(
            model_name='userpreference',
            name='theme',
            field=models.CharField(choices=[('light', 'Light'), ('dark', 'Dark')], default='light', max_length=10),
        ),
    ]
