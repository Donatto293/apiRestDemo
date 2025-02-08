from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer, UserSerializerList, UserSerializerLogin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
# Create your views here.


#obtenemos el modelo de usuario personalizado
User= get_user_model()


@api_view(['POST']) # Esta vista solo acepta solicitudes POST
def user_register(request):
    """
    Vista para registrar un nuevo usuario.
    Recibe datos vía POST (incluyendo archivo de foto, si lo hay) y los procesa.
    Si los datos son válidos, crea el usuario y retorna un mensaje de éxito junto con los datos serializados.
    """

    #si el metodo HTTP no es POST, se retorna error 405 metodo no permitido
    if request.method != 'POST':
        return Response({'error': 'Método no permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    #depuracion para ver que datos entran al back 
    print("Método:", request.method)
    print("Headers:", request.headers)
    print("Datos:", request.data)



    if request.method =='POST':
        # Combinar datos de request.data y request.FILES para la imagen
       
       #en data se crea una copia de los datos recibidos para poder modificarlos sin alterar el request original
        data = request.data.copy()
        # Si se envía una imagen de perfil (campo 'foto') en los archivos, se añade a los datos
        if 'foto' in request.FILES:
            data['foto'] = request.FILES['foto']
        
        # Se instancia el serializer con los datos recibidos
        serializer= UserSerializer(data=data)


        # Si los datos son válidos según el serializer
        if serializer.is_valid():
            #se crea el usuario usando el metodo create_user 
            # Usamos create_user para encriptar la contraseña automáticamente
            user = User.objects.create_user(# se pasan los campos requeridos
                email=data.get('email'),
                password=data.get('password'),
                name=data.get('name'),
                last_name=data.get('last_name'),
                username=data.get('username'),  # Campo obligatorio
                foto=data.get('foto')
            )
            # Se retorna la respuesta con el mensaje de éxito y los datos serializados del usuario
            return Response({
                'message':'User registered successfully',
                'user':UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        # Si el serializer no es válido, se retornan los errores (status 400)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
                


@api_view(['POST'])
def user_login(request):
    """
    Vista para autenticar a un usuario.
    Recibe email y contraseña vía POST.
    Si las credenciales son correctas, genera o obtiene un token de autenticación
    y retorna un mensaje de éxito junto con los datos serializados del usuario.
    """

    #debug
    print("Datos recibidos:", request.data)
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        # Verifica que los campos no estén vacíos, retorna error 400
        if not email or not password:
            print("Usuario autenticado:", user.email)
            return Response(
                {'error': 'Email y contraseña son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Autenticar al usuario usando el backen personalizado con gmail
        user = authenticate(request, email=email, password=password)

        if user is not None:
            print(user) #depuracion 
            #se obtiene el token o lo crea y lo asocia al usuario
            token, _ = Token.objects.get_or_create(user=user)#genera el token 
            # se retona la respuesta exitosa, el token y los datos serializados
            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user': UserSerializerLogin(user).data
            }, status=status.HTTP_200_OK)
        else:
            # Si las credenciales son inválidas, retorna error 400
            return Response(
                {'error': 'Credenciales inválidas'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    # Si el método HTTP no es POST, retorna error 405
    return Response(
        {'error': 'Método no permitido'}, 
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


#pensando en eliminar
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para listar, crear, actualizar y eliminar usuarios.
    Se usa el serializer UserSerializerList para mostrar los datos de usuario.
    """
    queryset= User.objects.all()
    serializer_class= UserSerializerList

    #prueba 
    # Acción personalizada 'register' en el viewset, para registrar usuarios vía POST
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Acción personalizada para registrar un usuario utilizando el viewset.
        Se utiliza el serializer UserSerializer para validar y crear el usuario.
        sin embargo no se encripta la contraseña 
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()# Crea el usuario a través del serializer (usa create() interno)
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated]) #solo usuarios autentificados pueden acceder
def check_auth(request):
     """
    Vista para verificar que el usuario está autenticado.
    Retorna los datos serializados del usuario actual (excluye password).
    """
    # Se serializa el usuario autenticado usando UserSerializerLogin
     return Response(UserSerializerLogin(request.user).data)