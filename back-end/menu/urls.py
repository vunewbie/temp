from django.urls import path
from .views import *

urlpatterns = [
    path('categories', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<int:pk>', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),
    
    path('dishes', DishListCreateAPIView.as_view(), name='dish-list-create'),
    path('dishes/<int:pk>', DishRetrieveUpdateDestroyAPIView.as_view(), name='dish-detail'),
    
    path('menus', MenuListCreateAPIView.as_view(), name='menu-list-create'),
    path('menus/<int:pk>', MenuRetrieveUpdateDestroyAPIView.as_view(), name='menu-detail'),
]
