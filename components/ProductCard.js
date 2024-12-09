import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // console.log(product);
  const { addToCart, removeFromCart, cartItems } = useCart();
  
  // Find the item in the cart
  const cartItem = cartItems.find(item => item._id === product._id);
  // console.log(cartItem);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    console.log('Adding to cart', product._id);
    addToCart(product);
  };

  // Handle removing the product from the cart or decreasing its quantity
  const handleRemoveFromCart = () => {
    console.log('Removing from cart', product._id);
    removeFromCart(product._id);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Link href={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h2 className="text-xl font-bold mb-2 text-yellow-400">{product.name}</h2>
        </Link>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-yellow-400">${product.price.toFixed(2)}</span>
          <div className="flex items-center space-x-2">
            {quantity > 0 ? (
              <>
                <Button
                  onClick={handleRemoveFromCart}
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-yellow-400">{quantity}</span>
                <Button
                  onClick={handleAddToCart}
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
