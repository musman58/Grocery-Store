import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar({ onCartOpen, onSearchChange, searchTerm }) {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-bold text-yellow-400 hover:text-yellow-300">Grocery Store</h1>
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="relative text-yellow-400 hover:text-yellow-300"
              onClick={onCartOpen}
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-yellow-400">Welcome, {user.name || user.email}</span>
                <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login">
                  <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

