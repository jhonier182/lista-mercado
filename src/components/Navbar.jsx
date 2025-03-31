import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { logoutUser } from '../services/authService';
import { HiLogout, HiUser, HiViewGrid } from 'react-icons/hi';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        {/* Logo y nombre */}
        <Link to="/" className="flex items-center">
          <img src="/shopping-cart.svg" className="mr-3 h-6 sm:h-9 dark:filter dark:invert" alt="Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Lista Mercado
          </span>
        </Link>

        {/* Botones de la derecha */}
        <div className="flex items-center lg:order-2 gap-2">
          <ThemeToggle />
          
          {user ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="Foto de perfil"
                  img={user.photoURL}
                  rounded
                  bordered
                  status="online"
                  statusPosition="bottom-right"
                  size="md"
                />
              }
            >
              <Dropdown.Header>
                <span className={`block text-sm ${user.displayName ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white'}`}>{user.displayName || 'Usuario'}</span>
                <span className={`block truncate text-sm font-medium ${user.email ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white'}`}>{user.email}</span>
              </Dropdown.Header>
              <Dropdown.Item icon={HiViewGrid} as={Link} to="/dashboard" className="dark:text-white">
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item icon={HiUser} as={Link} to="/profile" className="dark:text-white">
                Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={HiLogout} onClick={handleLogout} className="dark:text-white">
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              Iniciar Sesión
            </Link>
          )}

          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span className="sr-only">Abrir menú principal</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Enlaces de navegación */}
        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            {user ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className={`block py-2 pr-4 pl-3 ${
                      location.pathname === '/dashboard'
                        ? 'text-white bg-primary-700 lg:bg-transparent lg:text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white'
                    } lg:p-0`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className={`block py-2 pr-4 pl-3 ${
                      location.pathname === '/products'
                        ? 'text-white bg-primary-700 lg:bg-transparent lg:text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white'
                    } lg:p-0`}
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/price-comparison"
                    className={`text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/price-comparison' ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    Comparar Precios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/expenses"
                    className={`text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/expenses' ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    Resumen de Gastos
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={`block py-2 pr-4 pl-3 ${
                      location.pathname === '/'
                        ? 'text-white bg-primary-700 lg:bg-transparent lg:text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white'
                    } lg:p-0`}
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`block py-2 pr-4 pl-3 ${
                      location.pathname === '/register'
                        ? 'text-white bg-primary-700 lg:bg-transparent lg:text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white'
                    } lg:p-0`}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/support"
                className={`block py-2 pr-4 pl-3 ${
                  location.pathname === '/support'
                    ? 'text-white bg-primary-700 lg:bg-transparent lg:text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 dark:text-white'
                } lg:p-0`}
              >
                Soporte
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
