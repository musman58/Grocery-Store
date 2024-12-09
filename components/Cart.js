import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    removeFromCartWholeItem,
  } = useCart();
  console.log(cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <p className="text-gray-400">Your cart is empty.</p>;
  }

  return (
    <div>
      {cartItems.map((item) => (
        <div key={item._id} className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">
              {item.name}
            </h3>
            <p className="text-gray-400">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                console.log(item._id);
                removeFromCart(item._id);
              }}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-yellow-400">{item.quantity}</span>
            <Button
              onClick={() => addToCart(item)}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => removeFromCartWholeItem(item._id)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-4 text-xl font-bold text-yellow-400">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
