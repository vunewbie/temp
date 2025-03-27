from .models import *
from accounts.models import Manager
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
    
class IsManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        try:
            if not request.user.is_authenticated:
                raise PermissionDenied('Quyền truy cập bị từ chối')
            
            if request.user.type in ['E', 'C']:
                raise PermissionDenied('Bạn không phải quản lý chi nhánh cũng như là chủ chuỗi nhà hàng')
            
            if request.user.type == 'A':
                return True
            
            if request.user.type == 'M':
                manager = Manager.objects.get(user_id=request.user.id)

                if manager.resignation_date:
                    raise PermissionDenied('Bạn đã từ chức')
                
                if manager.branch is None:
                    raise PermissionDenied('Bạn chưa được phân công chi nhánh')

                return True

        except Manager.DoesNotExist:
            raise PermissionDenied('Quản lý không tồn tại')
        except Exception as e:
            raise PermissionDenied(f'Quyền truy cập bị từ chối: {str(e)}')
        
        return False
    
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Area):
            return request.user.type == 'A'
        return True
