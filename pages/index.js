import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

export default function Home({ products: initialProducts, error }) {
  const [products] = useState(initialProducts?.data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { getCartTotal } = useCart();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Grocery Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
      />

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-gray-800 p-6 w-full max-w-md h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Your Cart
            </h2>
            <Cart />
            <div className="mt-6">
              <Button
                onClick={handleCheckout}
                className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              >
                Checkout (${getCartTotal().toFixed(2)})
              </Button>
            </div>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 w-full"
            >
              Close Cart
            </Button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 w-full max-w-md h-full overflow-y-auto">
            <Checkout />
            <Button
              onClick={() => setIsCheckoutOpen(false)}
              className="mt-4 w-full"
            >
              Close Checkout
            </Button>
          </div>
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const protocol = "http";
    const host = "localhost:3000";
    const res = await fetch(`${protocol}://${host}/api/products`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const products = await res.json();
    return { props: { products } };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { props: { products: { data: [] }, error: error.message } };
  }
}
