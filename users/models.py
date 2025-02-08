from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    name= models.CharField(max_length=255)
    last_name= models.CharField(max_length=255)
    email= models.EmailField(unique=True)
    foto= models.ImageField(upload_to='profile_pics/',blank=True, null=True)

    USERNAME_FIELD = "email"  # Campo usado como "username"
    REQUIRED_FIELDS = [ "name", "last_name"]  # Campos requeridos
    
    def __str__(self):
        return self.email
    