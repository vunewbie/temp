from .serializers import *
from .models import *
from accounts.authentication import CustomTokenAuthentication
from .permissions import *

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

import django_filters

class AreaListCreateAPIView(generics.ListCreateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [AllowAny]
    authentication_classes = [CustomTokenAuthentication]
    
    def post(self, request):
        if request.user.type != 'A':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền thêm khu vực'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AreaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [AllowAny]
    authentication_classes = [CustomTokenAuthentication]

    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Phương thức PUT không được phép'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if request.user.type != 'A':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền cập nhật khu vực'}, status=status.HTTP_403_FORBIDDEN)
        
        area = self.get_object()
        serializer = self.get_serializer(area, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        response = {
            "message": "Thông tin đã được cập nhật thành công",
            "data": serializer.data
        }
        
        return Response(response, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        return Response({'detail': 'Phương thức DELETE không được phép'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class DepartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManagerOrAdmin]
    authentication_classes = [CustomTokenAuthentication]

    def get(self, request):
        departments = self.get_queryset()
        serializer = self.get_serializer(departments, many=True)
        data = serializer.data

        if request.user.type == 'M':
            for department in data:
                department.pop('salary', None)

        return Response(data, status=status.HTTP_200_OK)
    
    def post(self, request):
        if request.user.type == 'M':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền thêm bộ phận'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DepartmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdmin]
    authentication_classes = [CustomTokenAuthentication]

class BranchListCreateAPIView(generics.ListCreateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]
    authentication_classes = [CustomTokenAuthentication]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['area']

    def get(self, request):
        branches = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(branches, many=True)
        data = serializer.data

        for branch in data:
            if branch.get('area'):
                area_id = branch['area']
                try:
                    area = Area.objects.get(id=area_id)
                    branch['area_name'] = f"{area.district}, {area.city}"
                except Area.DoesNotExist:
                    branch['area_name'] = 'Không tìm thấy khu vực'

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.type != 'A':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền thêm chi nhánh'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BranchRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]
    authentication_classes = [CustomTokenAuthentication]

    # put request is not allowed
    def put(self, request, *args, **kwargs):
        return Response({'detail': 'Phương thức PUT không được phép'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get(self, request, *args, **kwargs):
        branch = self.get_object()
        serializer = self.get_serializer(branch)
        data = serializer.data

        if data.get('area'):
            area_id = data['area']
            try:
                area = Area.objects.get(id=area_id)
                data['area_name'] = f"{area.district}, {area.city}"
            except Area.DoesNotExist:
                data['area_name'] = 'Không tìm thấy khu vực'

        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        if request.user.type != 'A':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền cập nhật chi nhánh'}, status=status.HTTP_403_FORBIDDEN)
        
        branch = self.get_object()
        serializer = self.get_serializer(branch, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = {
            "message": "Thông tin đã được cập nhật thành công",
            "data": serializer.data
        }
        
        return Response(response, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        if request.user.type != 'A':
            return Response({'detail': 'Chỉ chuỗi nhà hàng mới có quyền xóa chi nhánh'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
    
    
    
    
