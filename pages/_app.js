import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-600 border-b-2 text-white">
          
          <Component {...pageProps} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;

