from django.urls import path
from .views import *

urlpatterns = [
    path('categories', CategoryListAPIView.as_view(), name='category-list'),
    path('categories/create', CategoryCreateAPIView.as_view(), name='category-create'),
    path('categories/<int:pk>', CategoryRetrieveAPIView.as_view(), name='category-detail'),
    path('categories/<int:pk>/update', CategoryUpdateAPIView.as_view(), name='category-update'),
    path('categories/<int:pk>/delete', CategoryDestroyAPIView.as_view(), name='category-delete'),
    
    path('dishes', DishListAPIView.as_view(), name='dish-list'),
    path('dishes/create', DishCreateAPIView.as_view(), name='dish-create'),
    path('dishes/<int:pk>', DishRetrieveAPIView.as_view(), name='dish-detail'),
    path('dishes/<int:pk>/update', DishUpdateAPIView.as_view(), name='dish-update'),
    path('dishes/<int:pk>/delete', DishDestroyAPIView.as_view(), name='dish-delete'),
    
    path('menus', MenuListAPIView.as_view(), name='menu-list'),
    path('menus/create', MenuCreateAPIView.as_view(), name='menu-create'),
    path('menus/<int:pk>', MenuRetrieveAPIView.as_view(), name='menu-detail'),
    path('menus/<int:pk>/update', MenuUpdateAPIView.as_view(), name='menu-update'),
]
