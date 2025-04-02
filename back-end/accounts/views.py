from .serializers import *
from .models import *
from .authentication import *
from .utils import *
from .permissions import *

from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from django.utils import timezone
from django.contrib.auth import login
from django.conf import settings
from datetime import datetime, timedelta

import requests, json, jwt
import django_filters

# return a pair of JWT tokens if login is successful
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# create customer account
class CustomerCreateAPIView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data
            data['user']['is_active'] = False # account is inactive until verified
            data['user']['type'] = 'C'

            # save user and customer to database
            user = User.objects.create_user(**data['user'])
            customer = Customer.objects.create(user=user)
            
            # generate OTP code, cache it, and send it to user's email
            otp_code = create_otp_code()
            email = data['user']['email']
            hashed_email = hash_email(email)

            register_data_cache(email, otp_code)
            send_registration_otp_email(email, otp_code)

            response = {
                "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.", 
                "hashed_email": hashed_email
            }
            
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# retrieve and update customer information
class CustomerRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsOwner]
    authentication_classes = [CustomTokenAuthentication]

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Phương thức không được phép."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if request.data.get("user.password"):
            response = {
                "detail": "Không được phép đổi mật khẩu thông qua phương thức này."
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
        customer = self.get_object()
        user_data = {}
        
        # Xử lý dữ liệu gửi lên từ client, hỗ trợ cả JSON và FormData
        for key, value in request.data.items():
            if key.startswith("user."):
                user_field = key.split(".", 1)[1]
                user_data[user_field] = value
        
        serializer = self.get_serializer(customer, data={'user': user_data}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        response = {
            "message": "Thông tin đã được cập nhật thành công",
            "data": serializer.data
        }
        
        return Response(response, status=status.HTTP_200_OK)
    
# retrieve and update admin information
class AdminRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.filter(type='A')
    serializer_class = UserSerializer
    permission_classes = [IsOwner]
    authentication_classes = [CustomTokenAuthentication]

    def retrieve(self, request, *args, **kwargs):
        admin = self.get_object()
        serializer = self.get_serializer(admin)
        data = serializer.data

        response = {
            "user" : data
        }

        return Response(response, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        return Response({"detail": "Phương thức không được phép."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if request.data.get("password"):
            response = {
                "detail": "Không được phép đổi mật khẩu thông qua phương thức này."
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        
        admin = self.get_object()
        
        user_data = {}
        
        # data from front-end has {"user.field" : value } format
        for key, value in request.data.items():
            if key.startswith("user."):
                user_field = key.split(".", 1)[1]
                user_data[user_field] = value
        
        serializer = self.get_serializer(admin, data=user_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        response = {
            "message": "Thông tin đã được cập nhật thành công",
            "data": serializer.data
        }
        
        return Response(response, status=status.HTTP_200_OK)
                
    
# get all employees in the same branch as the manager and create new employee
class EmployeeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsManager]
    authentication_classes = [CustomTokenAuthentication]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['department', 'branch']
    
    def get(self, request):
        # Filter employees by branch's manager
        if hasattr(request, 'branch'):
            branch_id = request.branch.id if hasattr(request.branch, 'id') else request.branch
            employees = self.filter_queryset(Employee.objects.filter(branch=branch_id))
            
            # sort by resignation_date with None (active employees) first
            employees = employees.order_by('resignation_date', 'user__full_name')
        else:
            employees = Employee.objects.none()
            
        serializer = self.serializer_class(employees, many=True)
        data = serializer.data

        for employee in data:
            if employee.get('department'):
                department_id = employee['department']
                try:
                    department = Department.objects.get(id=department_id)
                    employee['department_name'] = department.name
                except Department.DoesNotExist:
                    employee['department_name'] = 'Không tìm thấy bộ phận'

            employee.pop('salary', None)
            employee.pop('branch', None)
        
        return Response(data, status=status.HTTP_200_OK)

    # create new employee
    def post(self, request):
        # token of manager user does not have branch attribute so permission add it to request
        data = request.data.copy()
        
        if hasattr(request, 'branch'):
            branch_id = request.branch.id if hasattr(request.branch, 'id') else request.branch
            data['branch'] = branch_id

        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            data['user']['is_active'] = False
            data['user']['type'] = 'E'
            
            user_data = {k: v for k, v in data['user'].items()}
            user = User.objects.create_user(**user_data)
            
            # remove user data from employee data
            employee_data = {k: v for k, v in data.items() if k != 'user'}
            employee = Employee.objects.create(user=user, **employee_data)
            otp_code = create_otp_code()
            email = data['user']['email']
            hashed_email = hash_email(email)

            register_data_cache(email, otp_code)
            send_registration_otp_email(email, otp_code)

            response = {
                "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.", 
                "hashed_email": hashed_email
            }
            
            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# retrieve, update, and delete employee information
class EmployeeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsEmployeeOrSameBranchManager]
    authentication_classes = [CustomTokenAuthentication]

    # retrieve employee information with additional branch and department names
    def retrieve(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = self.get_serializer(employee)
        data = serializer.data

        if employee.branch:
            data["branch_name"] = employee.branch.name
        if employee.department:
            data["department_name"] = employee.department.name
            data["salary"] = employee.department.salary

        return Response(data, status=status.HTTP_200_OK)


    # put request is denied
    def put(self, request, *args, **kwargs):
        return Response({"detail": "Phương thức không được phép."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    # update employee information
    def patch(self, request, pk):
        employee = self.get_object()

        # employee can only update their own information
        if request.user.type == 'E':
            allowed_user_fields = [
                'username', 'phone_number', 'email', 'citizen_id', 
                'full_name', 'gender', 'date_of_birth', 'avatar'
            ]
            allowed_employee_fields = ['address']
        # manager can only update employee's department
        elif request.user.type == 'M':
            allowed_user_fields = []
            allowed_employee_fields = ['department']
        else:
            return Response({"detail": "Bạn không có quyền thực hiện hành động này"}, status=status.HTTP_403_FORBIDDEN)
        
        user_data = {}
        employee_data = {}

        # handle all both json and formdata data
        for key, value in request.data.items():
            if key.startswith("user."):
                user_field = key.split(".", 1)[1]
                user_data[user_field] = value
            else:
                employee_data[key] = value

        # filter out invalid fields
        user_data = {key: value for key, value in user_data.items() if key in allowed_user_fields}
        employee_data = {key: value for key, value in employee_data.items() if key in allowed_employee_fields}

        serializer = self.get_serializer(employee, data={'user': user_data, **employee_data}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = {
            "message": "Thông tin đã được cập nhật thành công.",
            "data": serializer.data
        }

        return Response(response, status=status.HTTP_200_OK)
    
    # delete employee
    def delete(self, request, pk):
        if request.user.type != 'M':
            return Response({"detail": "Bạn không có quyền thực hiện hành động này"}, status=status.HTTP_403_FORBIDDEN)

        employee = self.get_object()
        user = employee.user

        user.is_active = False
        user.save()
        employee.resignation_date = timezone.now()
        employee.save()

        return Response({"message": "Sa thải nhân viên thành công."}, status=status.HTTP_200_OK)
    
class ManagerListCreateAPIView(generics.ListCreateAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    permission_classes = [IsAdmin]
    authentication_classes = [CustomTokenAuthentication]

    def get(self, request):
        managers = self.get_queryset()
        serializer = self.serializer_class(managers, many=True)
        data = serializer.data

        for manager in data:
            if manager.get('branch'):
                branch_id = manager['branch']
                try:
                    branch = Branch.objects.get(id=branch_id)
                    manager['branch_name'] = branch.name
                except Branch.DoesNotExist:
                    manager['branch_name'] = 'Không tìm thấy chi nhánh'
                    

        return Response(data, status=status.HTTP_200_OK)
    
    # validate manager registration data -> save OTP and data to cache -> send OTP to email
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            data['user']['is_active'] = False
            data['user']['type'] = 'M'
            
            user = User.objects.create_user(**data['user'])

            manager_data = {k: v for k, v in data.items() if k != 'user'}
            manager = Manager.objects.create(user=user, **manager_data)

            otp_code = create_otp_code()
            email = data['user']['email']
            hashed_email = hash_email(email)

            register_data_cache(email, otp_code)
            send_registration_otp_email(email, otp_code)

            response = {
                "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.", 
                "hashed_email": hashed_email
            }

            return Response(response, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ManagerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    permission_classes = [IsManagerOrAdmin]
    authentication_classes = [CustomTokenAuthentication]

    # retrieve manager information with additional branch name
    def retrieve(self, request, *args, **kwargs):
        manager = self.get_object()
        serializer = self.get_serializer(manager)
        data = serializer.data
        
        # Add branch name for frontend convenience
        if manager.branch:
            data['branch_name'] = manager.branch.name

        return Response(data, status=status.HTTP_200_OK)

    # put request is denied
    def put(self, request, *args, **kwargs):
        return Response({"detail": "Phương thức không được phép."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    # update manager information
    def patch(self, request, pk):
        manager = self.get_object()

        # managers can only update their own information
        if request.user.type == 'M':
            allowed_user_fields = [
                'username', 'phone_number', 'email', 'citizen_id', 
                'full_name', 'gender', 'date_of_birth', 'avatar'
            ]
            allowed_manager_fields = ['address', 'years_of_experience']
        # admin can only update manager's branch and salary
        elif request.user.type == 'A':
            allowed_user_fields = []
            allowed_manager_fields = ['branch', 'salary']
        else:
            return Response({"detail": "Bạn không có quyền thực hiện hành động này"}, status=status.HTTP_403_FORBIDDEN)

        user_data = {}
        manager_data = {}

        for key, value in request.data.items():
            if key.startswith("user."):
                user_field = key.split(".", 1)[1]
                user_data[user_field] = value
            else:
                manager_data[key] = value

        user_data = {key: value for key, value in user_data.items() if key in allowed_user_fields}
        manager_data = {key: value for key, value in manager_data.items() if key in allowed_manager_fields}

        serializer = self.get_serializer(manager, data={'user': user_data, **manager_data}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = {
            "message": "Thông tin đã được cập nhật thành công",
            "data": serializer.data
        }

        return Response(response, status=status.HTTP_200_OK)
    
    # delete manager
    def delete(self, request, pk):
        if request.user.type != "A":
            return Response({"detail": "Bạn không có quyền thực hiện hành động này"}, status=status.HTTP_403_FORBIDDEN)
        
        manager = self.get_object()
        user = manager.user

        user.is_active = False
        user.save()
        
        manager.resignation_date = timezone.now()
        manager.save()

        return Response({"message": "Sa thải quản lý thành công"}, status=status.HTTP_200_OK)

# client send hashed email + otp code -> verify otp code -> activate account
class RegisterVerifyOTPAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        hashed_email = request.data.get('hashed_email')
        otp_code = request.data.get('otp_code')
        
        if not hashed_email or not otp_code:
            return Response({"detail": "Thông tin không đầy đủ"}, status=status.HTTP_400_BAD_REQUEST)
        
        # get otp code from cache
        cache_key = f"register_{hashed_email}"
        cache_data = cache.get(cache_key)
        
        if not cache_data:
            return Response({"detail": "Mã OTP đã hết hạn hoặc không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)
        
        cache_data = json.loads(cache_data)
        if cache_data['otp_code'] != otp_code:
            return Response({"detail": "Mã OTP không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)
        
        # check if there's an inactive user with this hashed email
        inactive_users = User.objects.filter(is_active=False)
        
        for user in inactive_users:
            if hash_email(user.email) == hashed_email:
                user.is_active = True
                user.save()
                cache.delete(cache_key)

                return Response({"message": "Tài khoản đã được kích hoạt"}, status=status.HTTP_200_OK)
        
        return Response({"detail": "Không tìm thấy tài khoản"}, status=status.HTTP_400_BAD_REQUEST)

# client send hashed email -> resend otp if hashed email exists in cache 
class ResendRegisterOTPAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        hashed_email = request.data.get('hashed_email')
        
        if not hashed_email:
            return Response({"detail": "Thông tin không đầy đủ"}, status=status.HTTP_400_BAD_REQUEST)
        
        resend_registration_otp(hashed_email)

        return Response({"message": "Mã OTP đã được gửi lại"}, status=status.HTTP_200_OK)

# client send username or email -> send otp to email -> cache otp code
class ForgotPasswordAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username_or_email')

        if not username_or_email:
            return Response({"detail": "Vui lòng nhập tên đăng nhập/email"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()

        if not user:
            return Response({"detail": "Tài khoản không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
        
        otp_code = create_otp_code()

        forgot_password_data_cache(user.username, otp_code)

        send_forgot_password_otp_email(user.username, user.email, otp_code)

        response = {        
            "message": "Mã OTP đã được gửi đến email của bạn",
            "username": user.username
        }

        return Response(response, status=status.HTTP_200_OK)

# validate otp code -> create reset token -> return reset token
class ForgotPasswordVerifyOTPAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        otp_code = request.data.get('otp_code')

        cache_key = f"forgot_password_{username}"
        cache_data = cache.get(cache_key)

        if cache_data:
            cache_data = json.loads(cache_data)
            if cache_data['otp_code'] == otp_code:
                cache.delete(cache_key)
                
                user = User.objects.filter(username=username).first()
                
                if not user:
                    return Response({"detail": "Tài khoản không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
                
                # generate reset token
                reset_token = RefreshToken.for_user(user)
                
                # add special info to mark this is a password reset token
                reset_token['token_type'] = 'password_reset'
                
                # expiry time is 30 minutes
                expiry_time = datetime.now() + timedelta(minutes=30)
                
                response = {
                    "message": "Mã OTP hợp lệ",
                    "reset_token": str(reset_token),
                    "expires_at": expiry_time.isoformat()
                }
                
                return Response(response, status=status.HTTP_200_OK)
            
            return Response({"detail": "Mã OTP không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"detail": "Mã OTP đã hết hạn hoặc không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

# validate token -> validate new password -> reset password
class ResetPasswordAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        reset_token = request.data.get('reset_token')
        new_password = request.data.get('new_password')
        
        if not reset_token or not new_password:
            return Response(
                {"detail": "Vui lòng cung cấp token đặt lại mật khẩu và mật khẩu mới"}, 
                status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # decode token without verifying signature
            decoded_token = jwt.decode(
                reset_token,
                settings.SECRET_KEY,
                algorithms=["HS256"],
                options={"verify_signature": True})
            
            # check token type
            if decoded_token.get('token_type') != 'password_reset':
                return Response(
                    {"detail": "Token không hợp lệ cho việc đặt lại mật khẩu"},
                    status=status.HTTP_400_BAD_REQUEST)
            
            # get user_id from token
            user_id = decoded_token.get('user_id')
            
            # find user
            user = User.objects.filter(id=user_id).first()
            if not user:
                return Response({"detail": "Người dùng không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
            
            # set new password
            user.set_password(new_password)
            user.save()
            
            # add token to blacklist to prevent reuse
            try:
                outstanding_token = OutstandingToken.objects.get(token=reset_token)
                BlacklistedToken.objects.create(token=outstanding_token)
            except OutstandingToken.DoesNotExist:
                pass  # token does not exist in DB, possible because it's a new token
            
            return Response({
                "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới."
                }, status=status.HTTP_200_OK)
            
        except (TokenError, jwt.PyJWTError) as e:
            return Response(
                {"detail": f"Token không hợp lệ hoặc đã hết hạn: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"detail": f"Lỗi khi đặt lại mật khẩu: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# validate username -> send otp to email -> set new cache otp code
class ResendForgotPasswordOTPAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username')

            if not username:
                return Response({"detail": "Không tìm thấy username. Thử lại sau."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.filter(username=username).first()
            
            if not user:
                return Response({"detail": "Người dùng không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
            
            resend_forgot_password_otp_email(username)

            return Response({"detail": "Mã OTP đã được gửi lại đến email của bạn"}, status=status.HTTP_200_OK)
        
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# validate token -> validate new password -> change password
class ChangePasswordAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"detail": "Vui lòng nhập đầy đủ thông tin"}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(old_password):
            return Response({"detail": "Mật khẩu cũ không chính xác"}, status=status.HTTP_400_BAD_REQUEST)

        if old_password == new_password:
            return Response({"detail": "Mật khẩu mới phải khác mật khẩu cũ"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        return Response({"detail": "Password has been changed successfully"}, status=status.HTTP_200_OK)

# validate refresh token -> blacklist token
class LogoutAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response({"detail": "Token lỗi."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                token = RefreshToken(refresh_token)
                token.blacklist()

                return Response({"message": "Đăng xuất thành công."}, status=status.HTTP_200_OK)

            except TokenError as e:
                return Response({"detail": f"Gặp lỗi khi đăng xuất: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": f"Lỗi: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleLoginAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # one-time code from Google when user clicks "Sign in with Google"
        code = request.data.get("code")

        if not code:
            return Response({"error": "Không có code trả về"}, status=400)

        # send code to Google to get access token
        google_token_url = "https://oauth2.googleapis.com/token"
        params = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.OAUTH2_GOOGLE_REDIRECT_URI,
            "client_id": settings.OAUTH2_GOOGLE_KEY,
            "client_secret": settings.OAUTH2_GOOGLE_SECRET,
        }

        token_response = requests.post(google_token_url, data=params)

        if token_response.status_code != 200:
            return Response({"error": "Lấy token thất bại"}, status=400)

        google_access_token = token_response.json().get("access_token")

        # get user info from Google
        google_user_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        user_response = requests.get(google_user_url, headers={"Authorization": f"Bearer {google_access_token}"})
        google_data = user_response.json()

        email = google_data.get("email")
        full_name = google_data.get("name")
        avatar_url = google_data.get("picture")
        phone_number = google_data.get("phone_number")

        if not email:
            return Response({"error": "Không lấy được email"}, status=400)

        # Check if user exists by email
        try:
            user = User.objects.get(email=email)
            created = False
            
            if user.type == 'E':
                try:
                    employee = Employee.objects.get(user=user)
                    if employee.resignation_date is not None:
                        return Response({"error": "Nhân viên đã nghỉ việc không thể đăng nhập"}, status=400)
                except Employee.DoesNotExist:
                    pass
            elif user.type == 'M':
                try:
                    manager = Manager.objects.get(user=user)
                    if manager.resignation_date is not None:
                        return Response({"error": "Quản lý đã nghỉ việc không thể đăng nhập"}, status=400)
                except Manager.DoesNotExist:
                    pass
                    
        except User.DoesNotExist:
            # Create a new user with a unique username
            base_username = email.split("@")[0]
            unique_username = generate_unique_username(base_username)
            
            user = User.objects.create_user(
                username=unique_username,
                email=email,
                full_name=full_name,
                phone_number=phone_number,
                password=None  # Social login users don't need a password
            )
            customer = Customer.objects.create(user=user)
            created = True

        # set unusable password for social login and additional info
        if created:
            user.set_unusable_password()

            if avatar_url:
                avatar_path = download_and_save_avatar(avatar_url, email)
                if avatar_path:
                    user.avatar = avatar_path

            user.save()

        user.backend = "django.contrib.auth.backends.ModelBackend"
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        # generate JWT token
        refresh = RefreshToken.for_user(user)
        refresh["type"] = user.type
        refresh["username"] = user.username

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })

class FacebookLoginAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        code = request.data.get("code")

        if not code:
            return Response({"error": "Không lấy được code"}, status=400)

        fb_token_url = "https://graph.facebook.com/v17.0/oauth/access_token"
        params = {
            "client_id": settings.OAUTH2_FACEBOOK_KEY,
            "client_secret": settings.OAUTH2_FACEBOOK_SECRET,
            "redirect_uri": settings.OAUTH2_FACEBOOK_REDIRECT_URI,
            "code": code
        }

        token_response = requests.get(fb_token_url, params=params)

        if token_response.status_code != 200:
            return Response({"error": "Không lấy được token"}, status=400)

        fb_access_token = token_response.json().get("access_token")

        fb_user_url = "https://graph.facebook.com/v17.0/me"
        params = {
            "fields": "id,email,name,picture.type(large)",
            "access_token": fb_access_token
        }

        user_response = requests.get(fb_user_url, params=params)
        fb_data = user_response.json()

        email = fb_data.get("email")
        full_name = fb_data.get("name")
        avatar_url = fb_data.get("picture", {}).get("data", {}).get("url")
        phone_number = fb_data.get("phone_number")

        if not email:
            return Response({"error": "Không lấy được email"}, status=400)

        try:
            user = User.objects.get(email=email)
            created = False
            
            if user.type == 'E':
                try:
                    employee = Employee.objects.get(user=user)
                    if employee.resignation_date is not None:
                        return Response({"error": "Nhân viên đã nghỉ việc không thể đăng nhập"}, status=400)
                except Employee.DoesNotExist:
                    pass
            elif user.type == 'M':
                try:
                    manager = Manager.objects.get(user=user)
                    if manager.resignation_date is not None:
                        return Response({"error": "Quản lý đã nghỉ việc không thể đăng nhập"}, status=400)
                except Manager.DoesNotExist:
                    pass
                    
        except User.DoesNotExist:
            base_username = email.split("@")[0]
            unique_username = generate_unique_username(base_username)
            
            user = User.objects.create_user(
                username=unique_username,
                email=email,
                full_name=full_name,
                phone_number=phone_number,
                password=None
            )
            customer = Customer.objects.create(user=user)
            created = True

        if created:
            user.set_unusable_password()

            if avatar_url:
                avatar_path = download_and_save_avatar(avatar_url, email)
                if avatar_path:
                    user.avatar = avatar_path

            user.save()

        user.backend = "django.contrib.auth.backends.ModelBackend"
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        refresh = RefreshToken.for_user(user)
        refresh["type"] = user.type
        refresh["username"] = user.username

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })

class GitHubLoginAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        code = request.data.get("code")

        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        github_token_url = "https://github.com/login/oauth/access_token"
        params = {
            "code": code,
            "client_id": settings.OAUTH2_GITHUB_KEY,
            "client_secret": settings.OAUTH2_GITHUB_SECRET,
            "redirect_uri": settings.OAUTH2_GITHUB_REDIRECT_URI
        }

        headers = {"Accept": "application/json"}

        token_response = requests.post(github_token_url, data=params, headers=headers)

        if token_response.status_code != 200:
            return Response({"error": "Failed to exchange code for token"}, status=status.HTTP_400_BAD_REQUEST)

        github_access_token = token_response.json().get("access_token")

        # fetch user profile from GitHub
        github_user_url = "https://api.github.com/user"
        github_email_url = "https://api.github.com/user/emails"

        headers = {"Authorization": f"Bearer {github_access_token}"}
        user_response = requests.get(github_user_url, headers=headers)

        if user_response.status_code != 200:
            return Response({"error": "Failed to fetch user info"}, status=status.HTTP_400_BAD_REQUEST)

        github_data = user_response.json()
        email = github_data.get("email")
        full_name = github_data.get("name") or github_data.get("login")
        avatar_url = github_data.get("avatar_url")

        if not email:
            email_response = requests.get(github_email_url, headers=headers)

            if email_response.status_code == 200:
                emails = email_response.json()
                primary_email = next((e["email"] for e in emails if e["primary"] and e["verified"]), None)
                email = primary_email or (emails[0]["email"] if emails else None)

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # create or get user
        try:
            user = User.objects.get(email=email)
            created = False
            
            if user.type == 'E':
                try:
                    employee = Employee.objects.get(user=user)
                    if employee.resignation_date is not None:
                        return Response({"error": "Nhân viên đã nghỉ việc không thể đăng nhập"}, status=400)
                except Employee.DoesNotExist:
                    pass
            elif user.type == 'M':
                try:
                    manager = Manager.objects.get(user=user)
                    if manager.resignation_date is not None:
                        return Response({"error": "Quản lý đã nghỉ việc không thể đăng nhập"}, status=400)
                except Manager.DoesNotExist:
                    pass
                    
        except User.DoesNotExist:
            # Create a new user with a unique username
            base_username = email.split("@")[0]
            unique_username = generate_unique_username(base_username)
            
            user = User.objects.create_user(
                username=unique_username,
                email=email,
                full_name=full_name,
                password=None  # Social login users don't need a password
            )
            customer = Customer.objects.create(user=user)
            created = True

        if created:
            user.set_unusable_password()

            if avatar_url:
                avatar_path = download_and_save_avatar(avatar_url, email)
                if avatar_path:
                    user.avatar = avatar_path

            user.save()

        user.backend = "django.contrib.auth.backends.ModelBackend"
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        # generate JWT token
        refresh = RefreshToken.for_user(user)
        refresh["type"] = user.type
        refresh["username"] = user.username

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })
