from .serializers import *
from .models import *
from accounts.authentication import CustomTokenAuthentication
from .permissions import *

from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from django.utils import timezone
from django.conf import settings
from datetime import datetime, timedelta

import requests, json, jwt

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

class DepartmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsManagerOrAdmin]
    authentication_classes = [CustomTokenAuthentication]

    
    
    
