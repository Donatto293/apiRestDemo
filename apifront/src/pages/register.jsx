import React, { useState } from 'react';
import {createUser} from '../api/users.api';

export function Register() {
    // Estado para almacenar los datos del formulario de registro
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        foto: null // Inicialmente no hay archivo seleccionado
    });

    // Estado para mostrar mensajes (éxito o error) en la UI
    const [message, setMessage] = useState('');



    /**
   * handleSubmit: Maneja el envío del formulario de registro.
   *  - Previene el envío por defecto del formulario.
   *  - Envía los datos (incluyendo la foto, si se adjunta) al backend mediante createUser.
   *  - Si el registro es exitoso, se muestra un mensaje de éxito.
   *  - En caso de error, se muestra un mensaje de error.
   *
   * @param {Event} e - Evento de envío del formulario.
   */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Datos enviados:", formData)
            const response = await createUser(formData);// Se llama a la API para registrar al usuario
            setMessage('Registration successful!');
            console.log('Respuesta:', response.data);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error al registrar');
            console.error('Error:', error.response);
        }
    };


    /**
   * handleChange: Actualiza el estado del formulario cuando el usuario escribe en un input.
   *
   * @param {Event} e - Evento de cambio en el input.
   */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

     /**
   * handleFileChange: Actualiza el estado del formulario cuando se selecciona un archivo para el campo "foto".
   *
   * @param {Event} e - Evento del input de tipo "file".
   */
    const handleFileChange =(e)=>{
        setFormData({
            ...formData,
            foto: e.target.files[0]// Guarda el primer archivo seleccionado
        })
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange} />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    onChange={handleChange} />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange} />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange} />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange} />
                <input
                type="file"
                name="foto"
                onChange={handleFileChange}/>
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Register;