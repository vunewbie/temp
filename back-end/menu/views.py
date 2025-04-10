from .serializers import *
from .models import *
from .permissions import *
from accounts.models import Manager
from accounts.authentication import CustomTokenAuthentication
from establishments.models import Branch

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

import django_filters

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdmin()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]

class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdmin()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class DishListCreateAPIView(generics.ListCreateAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdmin()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]
    
    def get(self, request):
        dishes = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(dishes, many=True)
        data = serializer.data

        for dish in data:
            if dish.get('category'):
                category_id = dish['category']
                try:
                    category = Category.objects.get(id=category_id)
                    dish['category_name'] = category.name
                except Category.DoesNotExist:
                    dish['category_name'] = 'Không tìm thấy danh mục'

        return Response(data, status=status.HTTP_200_OK)

class DishRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdmin()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def delete(self, request, *args, **kwargs):        
        dish = self.get_object()
        dish.status = False
        dish.save()

        # delete all menus associated with the dish
        Menu.objects.filter(dish=dish).delete()

        return Response({'message': 'Món ăn đã được xóa thành công'}, status=status.HTTP_200_OK)
    
class MenuListCreateAPIView(generics.ListCreateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['branch']
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsSameBranchManager()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        
        if category_id:
            queryset = queryset.filter(dish__category_id=category_id)
        return queryset
    
    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        
        for menu in data:
            if menu.get('dish'):
                dish_id = menu['dish']
                try:
                    dish = Dish.objects.get(id=dish_id)
                    menu['dish_name'] = dish.name
                    menu['dish_price'] = dish.price
                    menu['dish_description'] = dish.description
                    menu['dish_image'] = str(dish.image) if dish.image else None
                    
                    if dish.category:
                        category = Category.objects.get(id=dish.category.id)
                        menu['category_id'] = category.id
                        menu['category_name'] = category.name
                except Dish.DoesNotExist:
                    menu['dish_name'] = 'Không tìm thấy món ăn'
            
            if menu.get('branch'):
                branch_id = menu['branch']
                try:
                    branch = Branch.objects.get(id=branch_id)
                    menu['branch_name'] = branch.name
                except Branch.DoesNotExist:
                    menu['branch_name'] = 'Không tìm thấy chi nhánh'

        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        try:
            manager = Manager.objects.get(user=request.user)
            manager_branch_id = manager.branch.id
            
            request_branch_id = request.data.get('branch')
            if request_branch_id is not None:
                try:
                    request_branch_id = int(request_branch_id)
                except (ValueError, TypeError):
                    return Response({'detail': 'ID chi nhánh không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)
                
            if request_branch_id != manager_branch_id:
                return Response({'detail': 'Quản lý chỉ có thể thêm món vào menu của chi nhánh mình quản lý'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Manager.DoesNotExist:
            return Response({'detail': 'Không tìm thấy thông tin quản lý'}, status=status.HTTP_403_FORBIDDEN)
    
class MenuRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsSameBranchManager()]
    
    def get_authenticators(self):
        if self.request.method == 'GET':
            return []
        return [CustomTokenAuthentication()]

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if request.user.type != 'M':
            return Response({'detail': 'Chỉ có quản lý chi nhánh mới được cập nhật thông tin menu'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            manager = Manager.objects.get(user=request.user)
            manager_branch_id = manager.branch.id
            
            menu = self.get_object()
            
            if menu.branch.id != manager_branch_id:
                return Response({'detail': 'Quản lý chỉ có thể cập nhật thông tin món thuộc chi nhánh mình quản lý'}, status=status.HTTP_403_FORBIDDEN)
            
            request_branch_id = request.data.get('branch')
            if request_branch_id is not None:
                try:
                    request_branch_id = int(request_branch_id)
                    if request_branch_id != manager_branch_id:
                        return Response({'detail': 'Không thể chuyển món sang chi nhánh khác'}, status=status.HTTP_403_FORBIDDEN)
                except (ValueError, TypeError):
                    return Response({'detail': 'ID chi nhánh không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(menu, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            response = {
                "message": "Thông tin đã được cập nhật thành công",
                "data": serializer.data
            }
            
            return Response(response, status=status.HTTP_200_OK)
            
        except Manager.DoesNotExist:
            return Response({'detail': 'Không tìm thấy thông tin quản lý'}, status=status.HTTP_403_FORBIDDEN)

