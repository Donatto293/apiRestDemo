from django.urls import path , include
from rest_framework import routers
from . import views



router = routers.DefaultRouter()
router.register(r'product', views.ProductView, 'product')
router.register(r'categories', views.CategoryApiView, 'category')
router.register(r'subcategories', views.SubCategoryApiView, 'subcategory')

urlpatterns=[
    path('api/v1/',views.getData),
    path ('api/v2/', include(router.urls)),
    # path('api/v2/categories/',views.CategoryApiView.as_view(), name="category-list"),
    # path('api/v2/subcategories/', views.SubCategoryApiView.as_view(), name="subcategory-list"),
]