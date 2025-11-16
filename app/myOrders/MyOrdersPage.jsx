"use client";

import { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import CancelOrderModal from "@/components/order/CancelOrderModal";
import { toast } from "sonner";
import { ordersApi, menuApi, cartApi } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";

const MyOrders = () => {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    loadInitialOrders();
  }, []);

  const loadInitialOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const data = await ordersApi.getMy(token);

      if (data.status === 401) {
        setUnauthorized(true);
        return;
      }

      if (!data.success) throw new Error("Failed to fetch orders");

      const fullOrders = await Promise.all(
        data.orders.map(async (order) => {
          const itemDetails = await Promise.all(
            order.items.map(async (item) => {
              try {
                const itemData = await menuApi.getItemById(item.item);
                return {
                  ...item,
                  name: itemData.menuItem?.name || "Unknown Item",
                  price: itemData.menuItem?.price || 0,
                };
              } catch {
                return { ...item, name: "Unknown Item", price: 0 };
              }
            })
          );

          return { ...order, items: itemDetails };
        })
      );

      setOrders(fullOrders);

      const s = {};
      fullOrders.forEach((o) => (s[o._id] = o.status));
      setStatuses(s);
    } catch (err) {
      setError(err.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => {
    pollOrderStatuses();
  }, 6000);

  const pollOrderStatuses = async () => {
    try {
      const token = await getToken();
      const data = await ordersApi.getMy(token);

      if (!data.success) return;

      let changed = false;
      const updatedOrders = [...orders];
      const newStatuses = { ...statuses };

      data.orders.forEach((serverOrder) => {
        const localOrder = updatedOrders.find((o) => o._id === serverOrder._id);

        if (localOrder && localOrder.status !== serverOrder.status) {
          toast.success(`Order Updated: ${serverOrder.status}`);

          localOrder.status = serverOrder.status;
          newStatuses[localOrder._id] = serverOrder.status;

          changed = true;
        }
      });

      if (changed) {
        setOrders(updatedOrders);
        setStatuses(newStatuses);
      }
    } catch {}
  };

  const handleCancel = async () => {
    if (!cancelOrderId) return;

    try {
      setIsDeleting(true);
      const token = await getToken();

      const data = await ordersApi.cancel(cancelOrderId, token);

      if (!data.success) {
        toast.error(data.message || "Failed to cancel order");
        return;
      }

      toast.success("Order cancelled");
      setIsCancelOpen(false);

      loadInitialOrders();
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      const token = await getToken();

      for (const item of order.items) {
        await cartApi.addItem(item.item, item.quantity, token);
      }

      toast.success("Items added to cart");

      setTimeout(() => {
        window.location.href = "/cart";
      }, 800);
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/20 text-amber-700 dark:text-amber-400";
      case "Processing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
      case "Delivered":
        return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
      case "Cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <p className="text-lg text-destructive mb-4">{error}</p>
        <Button onClick={() => loadInitialOrders()}>Retry</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto" />
          <h2 className="text-3xl font-semibold mt-4">No Orders Yet</h2>
          <Link href="/menu">
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              View Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">My Orders</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order._id} className="rounded-2xl shadow-lg">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>

                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="mb-4 space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm">
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/orders/${order._id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>

                  {order.status === "Pending" && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setCancelOrderId(order._id);
                        setIsCancelOpen(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}

                  {order.status === "Delivered" && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleReorder(order)}
                    >
                      Reorder
                    </Button>
                  )}
                </div>

                <CancelOrderModal
                  isOpen={isCancelOpen}
                  onClose={() => setIsCancelOpen(false)}
                  onConfirm={handleCancel}
                  isDeleting={isDeleting}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
