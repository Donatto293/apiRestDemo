import React from 'react'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import { TasksPage } from './pages/tasksPage'
import {ProductsFormPage} from './pages/ProductsFormPage'
import {Navigation} from './components/Navigation';
import {AuthProvider} from './api/authContext'
import {Register} from './pages/register';
import {Login} from './pages/login';
import {ProtectedRoute} from './components/ProtectedRouted';

export default function App() {
  return (
    // El AuthProvider envuelve toda la aplicación para que el contexto de autenticación esté disponible
    <AuthProvider>
      <BrowserRouter>
        <Navigation/>{/* Menú de navegación que se muestra en todas las páginas */}

        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks-create" element={
            <ProtectedRoute>
              <ProductsFormPage />
            </ProtectedRoute>
            }/>
          <Route path="/tasks/:id" element={<ProductsFormPage />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/login" element={< Login/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

