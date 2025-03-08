import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 fixed bottom-0 left-0 right-0 m-0">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Lista Mercado</span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/about" className="mr-4 hover:underline md:mr-6">Acerca de</Link>
            </li>
            <li>
              <Link to="/privacy" className="mr-4 hover:underline md:mr-6">Privacidad</Link>
            </li>
            <li>
              <Link to="/support" className="hover:underline">Soporte</Link>
            </li>
          </ul>
        </div>

      
      </div>
    </footer>
  );
};
