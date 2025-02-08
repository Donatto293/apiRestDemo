from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de usuario.
    Incluye campos como email, password, nombre, apellido, username y foto.
    Se usa para validar la información recibida y crear el usuario.
    """
    class Meta:
        model = User
        # Campos a exponer al registrar
        fields = ['id', 'email', 'password', 'name', 'last_name', 'username', 'foto']
        extra_kwargs = {
             # La contraseña solo se puede escribir, nunca se devuelve
            'password': {'write_only': True},
            # Se requiere el email para registrar
            'email': {'required': True}
        }


        #validacion personalizada para el email
        def validate_email(self, value):
            # Si ya existe un usuario con el email, se lanza un error de validación
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists")
            return value
        
        
        # Método create para encriptar la contraseña antes de guardar el usuario
        def create(self, validated_data):
            # Encriptación manual de la contraseña (como backup)
            validated_data['password'] = make_password(validated_data.get('password'))
            # Se crea el usuario utilizando el método create() del super serializer
            return super().create(validated_data)
        
        
        ## Método  para obtener la URL completa de la foto
        def get_foto(self, obj):
            request = self.context.get('request')  # Obtener request si está disponible
            if obj.foto:
                return request.build_absolute_uri(obj.foto.url) if request else obj.foto.url
            return None  # Si no hay foto, devolver None

class UserSerializerList(serializers.ModelSerializer):
    """
    Serializer para listar usuarios.
    Se utiliza en el ViewSet para mostrar los datos de usuario sin el campo password.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'password','name', 'last_name', 'username', 'foto']

class UserSerializerLogin(serializers.ModelSerializer):
    """
    Serializer para el login.
    Excluye campos sensibles como password y otros que no se requieren al mostrar la info del usuario en el login.
    """
    class Meta:
        model= User
        fields=['id', 'email', 'name', 'last_name', 'foto']  # Excluir password y username