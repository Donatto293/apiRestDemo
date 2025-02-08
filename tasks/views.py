from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets

from .serializer import ProductSerializer, CategorySerializer, SubCategorySerializer
from .models import Product, Category, SubCategory

# Create your views here.

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message":"!hello wold"})
    


@api_view(['GET'])
def getData(request):
    person ={'name':'dennis','age':28}
    return Response(person)

#vista para enviar los productos
class ProductView (viewsets.ModelViewSet):
    serializer_class= ProductSerializer
    queryset = Product.objects.all()

#vista para la categoria que se usa para crear un procducto
class CategoryApiView(viewsets.ModelViewSet):
        serializer_class= CategorySerializer
        queryset=Category.objects.all().values("id","name")
        

#vista para la subcategoria
class SubCategoryApiView(viewsets.ModelViewSet):
    serializer_class= SubCategorySerializer
    queryset= SubCategory.objects.all()



