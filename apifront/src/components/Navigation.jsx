import {Link} from 'react-router-dom'
import {React} from 'react'
import {useAuth} from '../api/authContext';

export  function Navigation() {

  const {user, logout}= useAuth();


  return (
    <nav>
      <div className="navbar-brand">
        <Link to="/tasks" className="btn">
          <h1>Task app</h1>
        </Link>
        <Link to="/tasks-create" className="btn">create product</Link>

      </div>

      <div className="navbar-links">
        {user? (
          //si el usuario esta autentificado
          <div className="user-info">
            <img
              src={user.foto ? `http://localhost:8000${user.foto}` : '/default-profile.png'}
              alt="profile pic"
              className="profile-pic"
            />
            <span>{user.name}{user.last_name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ):(
          //si no esta autenficado
          <div>
             <Link to="/users/login" className="btn">Login</Link>
             <Link to="/users/register" className="btn">Register</Link>
          </div>
        )}
      </div>

    


      
    </nav>
  )
}

export default Navigation;