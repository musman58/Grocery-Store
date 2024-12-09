import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/api/products/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch product");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setProduct(data.data);
          } else {
            throw new Error(data.error || "Failed to fetch product");
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const cartItem = cartItems.find((item) => item._id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar
          onCartOpen={() => setIsCartOpen(true)}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />
        <div className="text-center text-yellow-400 text-2xl mt-10">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar
          onCartOpen={() => setIsCartOpen(true)}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />
        <div className="text-center text-red-500 text-2xl mt-10">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar
          onCartOpen={() => setIsCartOpen(true)}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
        />
        <div className="text-center text-yellow-400 text-2xl mt-10">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{product.name} - Grocery Store</title>
      </Head>
      <Navbar
        onCartOpen={() => setIsCartOpen(true)}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
      />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Products
        </Link>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg object-cover w-full h-[500px]"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">
              {product.name}
            </h1>
            <p className="text-xl mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-400 mb-6">{product.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={handleRemoveFromCart}
                disabled={quantity === 0}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              >
                <Minus size={20} />
              </Button>
              <span className="text-xl">{quantity}</span>
              <Button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              >
                <Plus size={20} />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
