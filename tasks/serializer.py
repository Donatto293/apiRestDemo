from rest_framework import serializers
from .models import Product, Category, SubCategory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model= Product
        fields = '__all__'
        # fiels  =('id','name','description','price','category','subcategory')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model= Category
        fields = '__all__'
        
#falta documentar
class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    class Meta:
        model= SubCategory
        fields = '__all__'
       
