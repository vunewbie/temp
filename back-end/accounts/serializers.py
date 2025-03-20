from .models import *
from .utils import *

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth.models import update_last_login

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# custom JWT serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['type'] = user.type
        token['username'] = user.username
        return token

    def authenticate_user(self, identifier, password):
        try:
            user = get_user_model().objects.get(Q(username=identifier) | Q(email=identifier))

            if user.check_password(password):
                return user
        except Exception as e:
            return None

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # check username and password
        self.user = self.authenticate_user(username, password)
        if not self.user:
            raise serializers.ValidationError('Tài khoản hoặc mật khẩu không đúng')
            
        # if user is inactive, check for verification or resignation status
        if not self.user.is_active:
            # customer just needs verification
            if self.user.type == 'C':
                hashed_email = hash_email(self.user.email)
                otp_code = create_otp_code()

                register_data_cache(self.user.email, otp_code)
                send_registration_otp_email(self.user.email, otp_code)
                
                raise serializers.ValidationError({
                    'detail': 'Tài khoản chưa được xác thực',
                    'hashed_email': hashed_email,
                    'require_verification': True,
                    'type': 'C'
                })
            # employee or manager needs verification and resignation status check
            elif self.user.type in ['E', 'M']:
                if self.user.type == 'E':
                    try:
                        employee = Employee.objects.get(user=self.user)

                        if employee.resignation_date is not None:
                            raise serializers.ValidationError('Nhân viên đã nghỉ việc')
                        else:
                            # employee account needs verification - generate and send OTP
                            hashed_email = hash_email(self.user.email)
                            otp_code = create_otp_code()

                            register_data_cache(self.user.email, otp_code)
                            send_registration_otp_email(self.user.email, otp_code)
                            
                            raise serializers.ValidationError({
                                'detail': 'Tài khoản chưa được xác thực',
                                'hashed_email': hashed_email,
                                'require_verification': True,
                                'type': 'E'
                            })
                    except Employee.DoesNotExist:
                        raise serializers.ValidationError('Nhân viên không tồn tại')
                else:
                    try:
                        manager = Manager.objects.get(user=self.user)

                        if manager.resignation_date is not None:
                            raise serializers.ValidationError('Quản lý đã nghỉ việc')
                        else:
                            # manager account needs verification - generate and send OTP
                            hashed_email = hash_email(self.user.email)
                            otp_code = create_otp_code()

                            register_data_cache(self.user.email, otp_code)
                            send_registration_otp_email(self.user.email, otp_code)
                            
                            raise serializers.ValidationError({
                                'detail': 'Tài khoản chưa được xác thực',
                                'hashed_email': hashed_email,
                                'require_verification': True,
                                'type': 'M'
                            })
                    except Manager.DoesNotExist:
                        raise serializers.ValidationError('Quản lý không tồn tại')

        # if user is active, generate tokens
        refresh = self.get_token(self.user)
        access = refresh.access_token
        data = {
            'refresh': str(refresh),
            'access': str(access),
        }
        
        update_last_login(None, self.user)

        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
            'type': {'read_only': True},
        }

    def validate(self, attrs):
        if attrs.get('password'):
            try:
                validate_password(attrs['password'])
            except ValidationError as e:
                raise serializers.ValidationError({'password': list(e.messages)})
    
        return attrs
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        instance.save()
        
        return instance
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Not display groups and user_permissions on admin page
        representation.pop('groups', None)
        representation.pop('user_permissions', None)
        
        return representation

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Customer
        fields = ['user', 'cumulative_points', 'total_points', 'tier', 'last_tier_update']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Employee
        fields = ['user', 'resignation_date', 'address', 'department', 'branch']

    def validate(self, attrs):
        # staff must have phone number,... while customer just needs email, username, password when registering
        if not self.partial:
            return validate_staff_info(attrs)
        
        return attrs
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
    
class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Manager
        fields = ['user', 'resignation_date', 'address', 'years_of_experience', 'salary', 'branch']

    def validate(self, attrs):
        if not self.partial:
            return validate_staff_info(attrs)
        
        return attrs
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance