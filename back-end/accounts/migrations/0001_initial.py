# Generated by Django 5.1.7 on 2025-03-24 13:59

import django.contrib.auth.validators
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('establishments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(default=None, max_length=128, null=True, region=None, unique=True)),
                ('citizen_id', models.CharField(default=None, max_length=12, null=True, unique=True)),
                ('full_name', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('gender', models.CharField(choices=[('M', 'Nam'), ('F', 'Nữ')], default='M', max_length=1)),
                ('date_of_birth', models.DateField(default=None, null=True)),
                ('avatar', models.ImageField(default='avatars/default-avatar.jpg', null=True, upload_to='avatars/')),
                ('is_active', models.BooleanField(default=True)),
                ('type', models.CharField(choices=[('A', 'Chủ sở hữu'), ('E', 'Nhân viên'), ('C', 'Khách hàng'), ('M', 'Quản lý')], default='C', max_length=1)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'User',
            },
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('cumulative_points', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('total_points', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('tier', models.CharField(choices=[('B', 'Đồng'), ('S', 'Bạc'), ('G', 'Vàng')], default='B', max_length=1)),
                ('last_tier_update', models.DateField(auto_now_add=True)),
            ],
            options={
                'db_table': 'Customer',
            },
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('resignation_date', models.DateField(default=None, null=True)),
                ('address', models.CharField(max_length=300)),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='establishments.branch')),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='establishments.department')),
            ],
            options={
                'db_table': 'Employee',
            },
        ),
        migrations.CreateModel(
            name='Manager',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('resignation_date', models.DateField(default=None, null=True)),
                ('address', models.CharField(max_length=300)),
                ('years_of_experience', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('salary', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='establishments.branch')),
            ],
            options={
                'db_table': 'Manager',
            },
        ),
    ]
