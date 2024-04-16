# Generated by Django 4.2.10 on 2024-03-19 14:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_delete_userpreference'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme', models.CharField(choices=[('light', 'Light'), ('dark', 'Dark')], default='light', max_length=10)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]