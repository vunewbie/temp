from .models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class CustomTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        # Check if the token is valid
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Token phải dùng Bearer')

        # Get token
        token = auth_header.split(' ')[1]
        try:
            # Decode token
            decoded_token = AccessToken(token)
            user_id = decoded_token.payload.get('user_id')

            if not user_id:
                raise AuthenticationFailed('Token không có user_id')

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise AuthenticationFailed('Người dùng không tồn tại')

            return (user, None)
        except Exception as e:
            raise AuthenticationFailed(f"Token hết hạn hoặc không hợp lệ: {str(e)}")
