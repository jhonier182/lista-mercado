import { useState } from 'react';

export const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Enviando mensaje...' });

    // Por ahora solo simularemos una respuesta exitosa
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Soporte</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <details className="border rounded-lg p-4 dark:bg-gray-700">
              <summary className="font-medium cursor-pointer dark:text-white">
                ¿Cómo puedo agregar un nuevo producto?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-white">
                Para agregar un nuevo producto, ve a la sección "Productos" y haz clic en el botón
                "Agregar Producto". Llena el formulario con los detalles del producto y guarda los cambios.
              </p>
            </details>

            <details className="border rounded-lg p-4 dark:bg-gray-700">
              <summary className="font-medium cursor-pointer dark:text-white">
                ¿Cómo funciona la comparación de precios?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-white">
                La comparación de precios te permite ver el historial de precios de un producto en
                diferentes tiendas y fechas. Accede a esta función desde la sección "Comparar".
              </p>
            </details>

            <details className="border rounded-lg p-4 dark:bg-gray-700">
              <summary className="font-medium cursor-pointer dark:text-white">
                ¿Puedo exportar mis listas de compras?
              </summary>
              <p className="mt-2 text-gray-600 dark:text-white">
                Sí, puedes exportar tus listas de compras en formato PDF o Excel desde la sección
                "Dashboard" haciendo clic en el botón "Exportar".
              </p>
            </details>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Contáctanos</h2>
          
          {status.message && (
            <div className={`mb-4 p-4 rounded-lg ${
              status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-white">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-white   ">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
