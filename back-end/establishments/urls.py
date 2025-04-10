from django.urls import path
from .views import *

urlpatterns = [
    path('areas', AreaListCreateAPIView.as_view(), name='area-list-create'),
    path('areas/<int:pk>', AreaRetrieveUpdateAPIView.as_view(), name='area-detail-update'),

    path('departments', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('departments/<int:pk>', DepartmentRetrieveUpdateDestroyAPIView.as_view(), name='department-detail'),

    path('branches', BranchListCreateAPIView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>', BranchRetrieveUpdateAPIView.as_view(), name='branch-detail-update'),
]

