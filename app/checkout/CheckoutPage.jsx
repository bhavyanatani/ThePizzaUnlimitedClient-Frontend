"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cartApi, ordersApi } from "@/lib/api";

const checkoutSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  customerPhone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  customerEmail: z.string().email("Invalid email"),
  paymentMethod: z.enum(["Cash", "Card", "UPI"]),
  orderNotes: z.string().optional(),
});

export default function Checkout() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "" },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = await getToken();
      const data = await cartApi.getMy(token);
      if (!data.success) throw new Error("Failed to load cart");
      setCart(data.cart);
    } catch (err) {
      toast.error("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (s, i) => s + i.item.price * i.quantity,
    0
  );

  const gst = subtotal * 0.05;
  const serviceFee = 20;
  const totalAmount = subtotal + gst + serviceFee;

  const onSubmit = async (body) => {
    setPlacing(true);

    try {
      const token = await getToken();

      const orderData = {
        items: cart.items.map((ci) => ({
          item: ci.item._id,
          quantity: ci.quantity,
        })),
        tableNumber: body.tableNumber,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        paymentMethod: body.paymentMethod,
        orderNotes: body.orderNotes || "",
        totalAmount: totalAmount,
      };

      const data = await ordersApi.create(orderData, token);

      if (!data.success) {
        toast.error(data.message || "Order failed");

        setPlacing(false);
        return;
      }
      setCart({ items: [] });
      toast.success("Order placed!");
      router.push(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error("Something went wrong");
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Your dine-in order items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((ci) => (
                  <div key={ci.item._id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{ci.item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {ci.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{ci.item.price * ci.quantity}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>₹{serviceFee}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Dine-in table information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <Label>Table Number *</Label>
                  <Input
                    {...register("tableNumber")}
                    className={errors.tableNumber && "border-destructive"}
                    placeholder="Enter table number"
                  />
                  {errors.tableNumber && (
                    <p className="text-destructive text-sm">
                      {errors.tableNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    {...register("customerPhone")}
                    maxLength={10}
                    className={errors.customerPhone && "border-destructive"}
                    placeholder="10-digit number"
                  />
                  {errors.customerPhone && (
                    <p className="text-destructive text-sm">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    {...register("customerEmail")}
                    className={errors.customerEmail && "border-destructive"}
                    placeholder="you@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-destructive text-sm">
                      {errors.customerEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Payment Method *</Label>
                  <Select onValueChange={(v) => setValue("paymentMethod", v)}>
                    <SelectTrigger
                      className={errors.paymentMethod && "border-destructive"}
                    >
                      <SelectValue placeholder="Choose payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-destructive text-sm">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Order Notes</Label>
                  <Textarea
                    {...register("orderNotes")}
                    placeholder="Special instructions (optional)"
                  />
                </div>

                <Button className="w-full" disabled={placing}>
                  {placing ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
