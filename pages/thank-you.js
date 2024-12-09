import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ThankYou() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-300 mb-8">Your order has been received and is being processed.</p>
        <Link href="/">
          <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

