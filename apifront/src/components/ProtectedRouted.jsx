import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/authContext';



/**
 * Componente ProtectedRoute.
 * Comprueba si el usuario está autenticado a través del contexto de autenticación.
 * Si el usuario está autenticado, renderiza los componentes hijos.
 * Si no, redirige al usuario a la página de login.
 *
 * @param {Object} props - Propiedades del componente, incluyendo `children` que se renderizan si el usuario está autenticado.
 * @returns {JSX.Element} - El componente children o una redirección a /login.
 */
export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;