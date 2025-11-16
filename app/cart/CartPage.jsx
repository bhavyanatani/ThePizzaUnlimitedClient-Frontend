"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { cartApi } from "@/lib/api";

const Cart = () => {
const {getToken} = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    const token = await getToken();

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    try {
      const data = await cartApi.getMy(token);
      if (data.success) {
        setCart(data.cart);
      } else {
        throw new Error(data.message || "Failed to fetch cart");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cart");
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const token = await getToken();

    try {
      const data = await cartApi.updateItem(itemId, newQuantity, token);
      if (data.success) {
        setCart(data.cart);
        toast.success("Cart updated");
      } else {
        throw new Error(data.message || "Failed to update quantity");
      }
    } catch (err) {
      toast.error(err.message || "Error updating cart");
    }
  };

  const removeItem = async (itemId) => {
    const token = await getToken();

    try {
      const data = await cartApi.removeItem(itemId, token);
      if (data.success) {
        setCart(data.cart);
        toast.success("Item removed");
      } else {
        throw new Error(data.message || "Failed to remove item");
      }
    } catch (err) {
      toast.error(err.message || "Error removing item");
    }
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };
  
  

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    ) || 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="p-8 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Please sign in to view your cart
              </h2>
              <p className="mb-6 text-muted-foreground">
                You need to be authenticated to access your shopping cart.
              </p>
              <Button size="lg" onClick={() => (window.location.href = "/")}>
                Go to Home
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
          </div>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-destructive">
                Error loading cart
              </h2>
              <p className="mb-6 text-muted-foreground">{error}</p>
              <Button onClick={fetchCart}>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Try Again
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
          </div>
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
          <span className="ml-auto rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-4">
          {cart.items.map((cartItem) => (
            <CartItem
              key={cartItem.item._id}
              item={cartItem.item}
              quantity={cartItem.quantity}
              onUpdateQuantity={(newQty) => updateQuantity(cartItem.item._id, newQty)}
              onRemove={() => removeItem(cartItem.item._id)}
            />
          ))}
        </div>

        <CartSummary subtotal={subtotal} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default Cart;
