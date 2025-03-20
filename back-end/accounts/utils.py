from .models import User

from rest_framework import serializers

from django.core.cache import cache
from django.core.mail import EmailMessage
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from datetime import date, datetime, timedelta

import hashlib, hmac, json, random, requests, uuid, time

# staff must have full information
def validate_staff_info(attrs):
    user_data = attrs.get('user', {})
    required_fields = ['phone_number', 'citizen_id', 'full_name', 'avatar', 'date_of_birth']
    errors = {}

    for field in required_fields:
        if not user_data.get(field):
            errors[field] = f"{field.replace('_', ' ').title()} không được để trống"

    if errors:
        raise serializers.ValidationError({'user': errors})
    
    return attrs

# hash email with secret key before storing in cache
def hash_email(email):
    return hmac.new(settings.SECRET_KEY.encode(), email.encode(), hashlib.sha256).hexdigest()

# create otp code
def create_otp_code():
    digits = "0123456789"
    otp = ''.join(random.choice(digits) for i in range(6))
    return otp

# cache can not store datetime objects -> turn datetime objects into string
def convert_type(obj):
    if isinstance(obj, (date)):
        return obj.isoformat()
    raise TypeError(f"Object of type '{type(obj).__name__}' is not JSON serializable")

# cache for 5 minutes
def register_data_cache(email, otp_code):
    hashed_email = hash_email(email)
    cache_key = f"register_{hashed_email}"
    cache_data = {
        'otp_code': otp_code,
        """
        if we don't store email in cache data, each time we resend otp code, 
        we need to access database -> hash each email -> compare with hashed email in cache -> slow
        """
        'email': email,
        'last_sent': datetime.now().isoformat()
    }

    cache.set(cache_key, json.dumps(cache_data, default=convert_type), timeout=300)

# send otp code to email
def send_registration_otp_email(email, otp_code):
    subject = "Mã xác thực OTP từ nhà hàng Vunewbie"
    html_body = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                padding: 20px;
            }}
            .container {{
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }}
            h1 {{
                color: #2c3e50;
            }}
            p {{
                font-size: 16px;
                line-height: 1.6;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #d35400;
                padding: 10px;
                background-color: #f2f2f2;
                display: inline-block;
                border-radius: 4px;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Mã OTP xác thực yêu cầu đăng ký tài khoản</h1>
            <p>Khách hàng thân mến của chúng tôi,</p>
            <p>Mã xác thực OTP của bạn là:</p>
            <div class="otp-code">{otp_code}</div>
            <p>Mã xác thực chỉ có hiệu lực 5 phút. Vui lòng dùng nó để hoàn thành quá trình xác thực.</p>
            <p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
            <div class="footer">
                Trân trọng, <br>
                Vunewbie
            </div>
        </div>
    </body>
    </html>
    """
    from_email = settings.EMAIL_HOST_USER
    email_message = EmailMessage(
        subject=subject,
        body=html_body,
        from_email=from_email,
        to=[email]
    )
    email_message.content_subtype = "html"
    email_message.send(fail_silently=False) # raise error if email is not sent

# update otp code, last_sent in cache and resend email
def resend_registration_otp(hashed_email):
    cache_key = f"register_{hashed_email}"
    cache_data = cache.get(cache_key)

    if not cache_data:
        raise ValueError("Tài khoản không tồn tại hoặc quá trình xác thực đã quá 5 phút.\
                         Vui lòng đăng nhập bằng tài khoản đã tạo để tiến hành xác thực.")
    
    cache_data = json.loads(cache_data)
    last_sent = datetime.fromisoformat(cache_data['last_sent'])

    if datetime.now() - last_sent < timedelta(minutes=1):
        raise ValueError("Vui lòng đợi ít nhất 1 phút trước khi gửi lại mã OTP")
    
    cache.delete(cache_key)

    new_otp_code = create_otp_code()
    cache_data['otp_code'] = new_otp_code
    cache_data['last_sent'] = datetime.now().isoformat()

    cache.set(cache_key, json.dumps(cache_data, default=convert_type), timeout=300)
    email = cache_data['email']
    send_registration_otp_email(email, new_otp_code)

# store otp code for forgot password request in cache
def forgot_password_data_cache(username, otp_code):
    """
    username does not need to be protected -> no need to hash it
    do not need to use token because username is used for security
    """
    cache_key = f"forgot_password_{username}"
    cache_data = {
        "otp_code": otp_code,
        "last_sent": datetime.now().isoformat()
    }

    cache.set(cache_key, json.dumps(cache_data, default=convert_type), timeout=300)

# send otp code to email for forgot password request
def send_forgot_password_otp_email(username, email, otp_code):
    subject = "Mã xác thực OTP từ nhà hàng Vunewbie"
    html_body = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                padding: 20px;
            }}
            .container {{
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }}
            h1 {{
                color: #2c3e50;
            }}
            p {{
                font-size: 16px;
                line-height: 1.6;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #d35400;
                padding: 10px;
                background-color: #f2f2f2;
                display: inline-block;
                border-radius: 4px;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Mã OTP xác thực yêu cầu đổi mật khẩu</h1>
            <p>{username} thân mến,</p>
            <p>Mã xác thực OTP của bạn là:</p>
            <div class="otp-code">{otp_code}</div>
            <p>Mã xác thực chỉ có hiệu lực 5 phút. Vui lòng dùng nó để hoàn thành quá trình xác thực.</p>
            <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
            <div class="footer">
                Trân trọng, <br>
                Vunewbie
            </div>
        </div>
    </body>
    </html>
    """
    from_email = settings.EMAIL_HOST_USER
    email_message = EmailMessage(
        subject=subject,
        body=html_body,
        from_email=from_email,
        to=[email]
    )
    email_message.content_subtype = "html"
    email_message.send(fail_silently=False)

# update OTP code, last sent time and resend email
def resend_forgot_password_otp_email(username):
    cache_key = f"forgot_password_{username}"
    cache_data = cache.get(cache_key)
    print(cache_data)

    if not cache_data:
        raise ValueError("Tài khoản không tồn tại hoặc quá trình xác thực đã quá 5 phút.\
                         Vui lòng về trang đăng nhập và chọn 'Quên mật khẩu' lần nữa.")
    
    cache_data = json.loads(cache_data)
    last_sent = datetime.fromisoformat(cache_data['last_sent'])

    if datetime.now() - last_sent < timedelta(minutes=1):
        raise ValueError("Vui lòng đợi 1 phút trước khi gửi lại mã OTP")
    
    cache.delete(cache_key)
    
    new_otp_code = create_otp_code()

    cache_data['otp_code'] = new_otp_code
    cache_data['last_sent'] = datetime.now().isoformat()

    cache.set(cache_key, json.dumps(cache_data, default=convert_type), timeout=300)

    # username in cache is not hashed -> can compare directly -> can accept this approach
    user = User.objects.get(username=username)
    send_forgot_password_otp_email(username, user.email, new_otp_code)

# download and save avatar from social account when user hasn't existed in database
def download_and_save_avatar(avatar_url, email):
    try:
        response = requests.get(avatar_url, stream=True)

        if response.status_code == 200:
            # check if picture does not have filename extension
            content_type = response.headers.get('Content-Type', '')
            if 'image/jpeg' in content_type:
                file_extension = 'jpg'
            elif 'image/png' in content_type:
                file_extension = 'png'
            else:
                print(f"Unsupported content type: {content_type}")
                return None

            # generate unique filename and save avatar to media folder
            filename = f"{uuid.uuid4().hex}_{email.split('@')[0]}.{file_extension}"
            
            # use "/" directly
            file_path = f"avatars/{filename}"

            image_content = ContentFile(response.content)
            default_storage.save(file_path, image_content)

            return file_path
        else:
            print(f"Lỗi khi tải ảnh đại diện: {response.status_code}")
            return None
    except Exception as e:
        print(f"Lỗi khi tải ảnh đại diện: {e}")
        return None

def generate_unique_username(base_username):
    """
    Create a unique username by using UUID and timestamp
    - base_username: base username (usually the part before @ of email)
    - if username already exists, add an underscore and a string of UUID + timestamp to ensure uniqueness
    - UUID is shortened to avoid being too long
    """
    # check if base username already exists
    if not User.objects.filter(username=base_username).exists():
        return base_username
    
    # generate unique suffix
    timestamp = int(time.time())
    random_uuid = str(uuid.uuid4()).replace('-', '')[:8] # shorten UUID to avoid being too long
    
    unique_suffix = f"{timestamp}_{random_uuid}"
    new_username = f"{base_username}_{unique_suffix}"
    
    # ensure username is not too long
    max_length = 150
    if len(new_username) > max_length:
        # cut base_username if needed
        available_length = max_length - len(unique_suffix) - 1 # -1 for underscore
        base_username = base_username[:available_length]
        new_username = f"{base_username}_{unique_suffix}"
    
    return new_username