from django.urls import path
from .views import *

urlpatterns = [
    path('areas', AreaListAPIView.as_view(), name='area-list'),
    path('areas/create', AreaCreateAPIView.as_view(), name='area-create'),
    path('areas/<int:pk>', AreaRetrieveAPIView.as_view(), name='area-detail'),
    path('areas/<int:pk>/update', AreaUpdateAPIView.as_view(), name='area-update'),

    path('departments', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('departments/<int:pk>', DepartmentRetrieveUpdateDestroyAPIView.as_view(), name='department-detail'),

    path('branches', BranchListAPIView.as_view(), name='branch-list-create'),
    path('branches/create', BranchCreateAPIView.as_view(), name='branch-create'),
    path('branches/<int:pk>', BranchRetrieveAPIView.as_view(), name='branch-detail'),
    path('branches/<int:pk>/update', BranchUpdateAPIView.as_view(), name='branch-update'),
]

