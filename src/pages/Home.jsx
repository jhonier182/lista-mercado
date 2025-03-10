import { Link } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';
import { HiShoppingCart, HiChartPie, HiCurrencyDollar, HiUserGroup } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { user } = useAuth();
  
  // Si el usuario está autenticado, redirigir al dashboard
  if (user) {
    return <Link to="/dashboard" replace />;
  }
  
  const features = [
    {
      icon: HiShoppingCart,
      title: "Gestión de Productos",
      description: "Organiza tus productos por categorías y tiendas. Mantén un registro detallado de precios y cantidades."
    },
    {
      icon: HiChartPie,
      title: "Análisis de Precios",
      description: "Compara precios entre diferentes tiendas y visualiza el historial de precios de tus productos."
    },
    {
      icon: HiCurrencyDollar,
      title: "Control de Gastos",
      description: "Monitorea tus gastos mensuales y establece presupuestos para tus compras."
    },
    {
      icon: HiUserGroup,
      title: "Experiencia Personalizada",
      description: "Crea tu lista personalizada de productos y recibe recomendaciones basadas en tus hábitos de compra."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
          Gestiona tu lista de mercado de forma inteligente
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Organiza tus compras, compara precios y ahorra dinero con nuestra aplicación 
          diseñada para hacer tus compras más eficientes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 ">

          <Button
            as={Link}
            to="/register"
            color='gray'
            outline
            >
            Comenzar Ahora
          </Button>

          <Button
            as={Link}
            to="/login"
            color="gray"
            outline
            clas
          >
            Iniciar Sesión
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <div className="text-center space-y-4">
                  <feature.icon className="h-12 w-12 text-primary-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¿Listo para empezar?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Únete a nuestra comunidad y comienza a gestionar tus compras de manera más inteligente.
        </p>
        <Button
          as={Link}
          to="/register"
          size="xl"
          gradientDuoTone="purpleToBlue"
          className="mt-6"
        >
          Crear Cuenta Gratis
        </Button>
      </section>
    </div>
  );
};
