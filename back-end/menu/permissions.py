from .models import *
from accounts.models import Manager
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.type == 'A'
    
class IsSameBranchManager(BasePermission):
    def has_permission(self, request, view):
        try:
            if not request.user.is_authenticated:
                raise PermissionDenied('Quyền truy cập bị từ chối')
            
            if request.user.type != 'M':
                raise PermissionDenied('Bạn không phải quản lý chi nhánh')
            
            manager = Manager.objects.get(user_id=request.user.id)

            if manager.resignation_date:
                raise PermissionDenied('Bạn đã từ chức')
            
            if manager.branch is None:
                raise PermissionDenied('Bạn chưa được phân công chi nhánh')
            
            request.branch = manager.branch
            
            return True
        
        except Exception as e:
            raise PermissionDenied(f'Quyền truy cập bị từ chối: {str(e)}')
        
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Menu):
            if obj.branch != request.branch:
                raise PermissionDenied('Bạn không có quyền truy cập vào menu của chi nhánh này')
            
            return True
        return False