import React, { useState } from 'react';
import {loginUser} from '../api/users.api';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../api/authContext';


export function Login() {

    const navigate =useNavigate()
    //Estado para almacenar los datos del formulario de login (email y contraseña)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Estado para almacenar mensajes (por ejemplo, errores de login)
    const [message, setMessage] = useState('');

    // Obtenemos la función "login" del contexto para actualizar el estado global al autenticar
    const { login } = useAuth();


    /**
   * handleSubmit: Maneja el evento de envío del formulario.
   *  - Previene el comportamiento por defecto del formulario.
   *  - Realiza la petición de login enviando los datos del formulario.
   *  - Si el login es exitoso, guarda el token en localStorage, actualiza el contexto de autenticación y redirige a la ruta "/tasks".
   *  - Si ocurre un error, se muestra el mensaje correspondiente.
   *
   * @param {Event} e - Evento del formulario.
   */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Se envían las credenciales al backend mediante loginUser (definida en api/users.api.js)
            const response = await loginUser(formData);
            
            // Guardar token en localStorage
            localStorage.setItem('token', response.token);
            
           //depuracion 
            console.log("Respuesta del servidor:", response.data); 
            //Se actualiza el contexto de autenticación con los datos del usuario y el token
            login(response.user, response.token); // Actualiza el context
            // Redirige al usuario
            navigate("/tasks")
            
        } catch (error) {
            // En caso de error, se actualiza el estado message para mostrar un error en la UI
            setMessage(error.response?.data?.error || 'Error en login');
        }
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange} />
                  
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;