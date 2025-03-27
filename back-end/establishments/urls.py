from django.urls import path
from .views import *

urlpatterns = [
    path('departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('departments/<int:pk>', DepartmentRetrieveUpdateDestroyAPIView.as_view(), name='department-detail'),

    path('branches/', BranchListCreateAPIView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>', BranchRetrieveUpdateDestroyAPIView.as_view(), name='branch-detail'),
]

