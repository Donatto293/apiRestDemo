from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    """
    Backend de autenticación personalizado que permite autenticar usuarios utilizando su correo electrónico.
    
    Este backend extiende de `ModelBackend`, el cual es el backend por defecto de Django, y modifica el método
    `authenticate` para que, en lugar de buscar por username, busque el usuario por su email.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        """
        Intenta autenticar un usuario utilizando el email y la contraseña proporcionados.

        Parámetros:
            request: El objeto HttpRequest de Django.
            email (str): El correo electrónico del usuario (se espera que sea único).
            password (str): La contraseña ingresada por el usuario.
            **kwargs: Otros argumentos opcionales.

        Retorna:
            El objeto `User` si las credenciales son correctas; de lo contrario, retorna None.

        Flujo:
          1. Se obtiene el modelo de usuario configurado usando `get_user_model()`.
          2. Se intenta obtener un usuario cuyo email coincida con el valor recibido.
          3. Si el usuario existe, se verifica que la contraseña proporcionada coincida con la contraseña encriptada.
          4. Si la verificación es exitosa, se retorna el usuario; si falla o el usuario no existe, se retorna None.
        """
        User = get_user_model()# obtiene el modelo personalizado
        try:
            # Intenta obtener un usuario cuyo campo 'email' sea igual al valor recibido
            user = User.objects.get(email=email)
            # Verifica que la contraseña ingresada sea correcta comparándola con la contraseña encriptada
            if user.check_password(password):     # Verifica contraseña
                return user
            return None  # Contraseña incorrecta o usuario inactivo
        except User.DoesNotExist:
            return None