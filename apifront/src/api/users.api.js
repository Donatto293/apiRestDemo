import axios from 'axios'// Importamos Axios para realizar peticiones HTTP


/**
 * Creamos una instancia de Axios para interactuar con nuestro backend.
 * La baseURL es la dirección del servidor donde se encuentran nuestras rutas de usuario.
 */
export const userApi =axios.create({
  baseURL: "http://localhost:8000/users",
});



/**
 * Función para crear un usuario.
 * Esta función recibe un objeto `formData` que contiene los datos del formulario (incluyendo archivos)
 * y lo convierte en un objeto FormData para enviarlo como multipart/form-data.
 */
export const createUser = (formData) => {
   // Creamos un nuevo objeto FormData para poder enviar archivos junto con los campos de texto
  const data = new FormData(); // Usar FormData para enviar archivos
  
  // Adjunta todos los campos al FormData
  // Iteramos sobre cada par [clave, valor] del objeto formData y lo añadimos a FormData
  Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
  });

  // Realizamos una solicitud POST a la ruta /register/ usando la instancia userApi
  return userApi.post("/register/", data, {
      // Indicamos que el contenido es multipart/form-data
      headers: {
          'Content-Type':'multipart/form-data' // Cabecera necesaria
      }
  });
};




/**
 * Función para realizar el login del usuario.
 * Esta función envía las credenciales (email y contraseña) al endpoint /login/.
*/
export const loginUser =async (credentials)=>{
  try {
    // Realizamos una solicitud POST al endpoint /login/ con las credenciales.
    // NOTA: Aunque se usa multipart/form-data en el header aquí, si tus credenciales son simples
    const response = await userApi.post('/login/', credentials, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
    // Devolvemos los datos de respuesta de la API
    return response.data;
  } catch (error) {
    throw error;
    }
};



//sesion activa con token 
//verificar autentificacion

/**
 * Función para verificar que la sesión del usuario esté activa.
 * Esta función obtiene el token almacenado en el localStorage y lo envía al endpoint /check-auth/
 * para validar que el token es correcto y recuperar los datos del usuario.
 * 
 * @returns {Promise<Object|null>} - Promesa que resuelve con los datos del usuario o null si no hay token o es inválido.
 */
export const checkAuth = async()=>{
  const token =localStorage.getItem('token')// Obtiene el token del almacenamiento local

  if (!token)return null; //si no hay token retorna null

  try{
    // Realiza una solicitud GET a /check-auth/ enviando el token en la cabecera Authorization
    const response= await userApi.get('check-auth/',{
      headers: {
        'Authorization':`Token ${token}`//envia el token al backend en el header
      }
    });
    return response.data; //devuelve los datos del usuario obtenidos del backend
  }catch(error){
    // Si ocurre un error (por ejemplo, token inválido), se elimina el token del localStorage y se retorna null
    localStorage.removeItem('token');//elimina el token si es invalido
    return null;
  }
};



/**
 * Configuración de un interceptor de peticiones para añadir automáticamente el token a cada solicitud.
 * Si existe un token en localStorage, se añade a los headers de la solicitud.
 */
userApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Token ${token}`;
  }
  return config;
});



/**
 * Función para refrescar el token.
 * Realiza una solicitud POST a /refresh-token/ (asegúrate de que ese endpoint exista en el backend)
 * y devuelve el nuevo token. Si falla, elimina el token existente.
 * 
 * @returns {Promise<string>} - Promesa que resuelve con el nuevo token.
 */
const refreshToken = async () => {
  try {
      const response = await userApi.post('/refresh-token/', {}, {
          headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      return response.data.token; // Retorna el nuevo token
  } catch (error) {
      localStorage.removeItem('token'); // Elimina el token si falla
      throw error;
  }
};


/**
 * Interceptor de respuestas para gestionar la expiración del token.
 * Si se recibe una respuesta con estado 401 (no autorizado) y la solicitud original aún no se ha reintentado,
 * se intenta refrescar el token y se reenvía la solicitud original con el nuevo token.
 */
userApi.interceptors.response.use(
  response => response,// Si la respuesta es correcta, se retorna tal cua
  async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;// Marcamos la solicitud para evitar bucles infinitos
          const newToken = await refreshToken(); // Refrescamos el token
          localStorage.setItem('token', newToken);// Guardamos el nuevo token
          // Actualizamos el header Authorization de la solicitud original
          originalRequest.headers.Authorization = `Token ${newToken}`;
          // Reintentamos la solicitud original con el nuevo token
          return userApi(originalRequest);
      }
      return Promise.reject(error);// En caso de otro error, se rechaza la promesa
  }
);