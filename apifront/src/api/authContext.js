import { createContext, useContext, useEffect, useState } from "react";
import React  from "react";
import { userApi } from '../api/users.api'; 


/**
 * Creamos un contexto de autenticación para compartir el estado de usuario en toda la aplicación.
 */
const AuthContext = createContext();



/**
 * AuthProvider: Proveedor de contexto de autenticación.
 * Envuelve a los componentes que necesiten acceder al estado de autenticación. 
*/
export const AuthProvider = ({ children }) => {
    // Estado para almacenar los datos del usuario autenticado.
    const [user, setUser] = useState(null);
    // Estado para gestionar el estado de carga mientras se verifica la autenticación.
    const [loading, setLoading] = useState(true);



    // Función para login manual (después del registro) guardar el token y actualizar el estado del usuario
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

     /**
     * Función para cerrar sesión.
     * Elimina el token y limpia el estado del usuario.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    
    /**
     * useEffect para verificar si hay un token guardado y autenticado.
     * Cuando el componente se monta, intenta validar el token realizando una petición a /check-auth/.
     * Si el token es válido, actualiza el estado del usuario.
     * Si falla, llama a logout().
     */
    useEffect(() => {
        const verifyToken = async () => {
            // Se realiza una petición GET a /check-auth/ para validar el token
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await userApi.get('/check-auth/', {
                        headers: { Authorization: `Token ${token}` }
                    });
                    // Se actualiza el estado del usuario con los datos recibidos
                    setUser(response.data);
                } catch (error) {
                    // Si ocurre un error (token inválido, expirado, etc.), se cierra la sesión
                    logout();
                }
            }
            // Una vez finalizada la verificación, se desactiva el estado de carga
            setLoading(false); // Importante: quitar estado de carga
        };
        verifyToken();
    }, []);
    // Mientras se verifica la autenticación, se puede mostrar un componente de carga
    if (loading) {
        return <div>Cargando...</div>; // falta poner componente de carga
    }

    return (
        // Proveemos el estado y las funciones de autenticación (user, login, logout)
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Permite a los componentes acceder a `user`, `login` y `logout` sin tener que importar AuthContext manualmente.
 */
export const useAuth = () => useContext(AuthContext);