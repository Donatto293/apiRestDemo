from django.db import models

# Create your models here.

class Category(models.Model):
    name= models.CharField(max_length=100, unique=True)
    description=models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    

class SubCategory(models.Model):
    name= models.CharField(max_length=100)
    description= models.TextField(blank=True, null=True)
    category= models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")

    def __str__(self):
        return f"{self.name}({self.category.name})"

class Product(models.Model):
    name=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category= models.ForeignKey(Category, on_delete=models.DO_NOTHING, related_name="products")
    Subcategory= models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True,blank=True, related_name="products")

    def __str__(self):
        return self.name

