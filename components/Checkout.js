import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/router';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const router=useRouter();

  console.log(user);

  
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [address,setAddress]=useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty. Add items before placing an order.",
        variant: "destructive",
      });
      return;
    }
  
    if (!name || !email || !address) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
  
    setIsProcessing(true);
    // console.log(formData);
  
    try {
      const requestBody = {
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getCartTotal(),
        userId:user._id,
        name:name,
        email:email,
        address:address
        // ...formData,
      };
  
      console.log("Request Body:", requestBody);
  
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error Details:", errorDetails);
        throw new Error(errorDetails.message || 'Failed to create order.');
      }
  
      const data = await response.json();
      console.log(data);

      clearCart();
      router.push('/thank-you');
      // toast({
      //   title: "Order placed successfully",
      //   description: `Your order ID is: ${data.order._id}`,
      // });
    } catch (error) {
      console.error("Checkout Error:", error);
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to place order. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            className="bg-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="bg-gray-700 text-white"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
            required
            className="bg-gray-700 text-white"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-300">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="text-xl font-bold mt-2 text-yellow-400">
            Total: ${getCartTotal().toFixed(2)}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
}
