"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import OrderTimeline from "@/components/order/OrderTimeline";
import { useAuth } from "@clerk/nextjs";
import { ordersApi } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";
import { toast } from "sonner";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [prevStatus, setPrevStatus] = useState(null);
  const [stopPolling, setStopPolling] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GST_RATE = 0.18;
  const SERVICE_FEE = 20;

  const fetchOrder = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setError(null);
    }

    try {
      const token = await getToken();
      const data = await ordersApi.getById(id, token);

      if (!data.success) throw new Error("Failed to fetch order details");

      if (order && data.order.status !== order.status) {
        toast.success(`Order is now ${data.order.status}`);
      }
      setOrder(data.order);
      setPrevStatus(data.order.status);
      if (["completed", "cancelled"].includes(data.order.status)) {
        setStopPolling(true);
      }
    } catch (err) {
      if (showLoading) {
        setError(err.message || "Something went wrong");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder(true);
  }, [id]);

  usePolling(() => {
    if (!stopPolling && id) {
      fetchOrder(false);
    }
  }, 4000);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === "pending")
      return "bg-amber-500/20 text-amber-700 dark:text-amber-400";
    if (s === "preparing")
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    if (s === "ready")
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
    if (s === "completed") return "bg-muted text-muted-foreground";
    if (s === "cancelled") return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    );
  };

  const calculateGST = () => calculateSubtotal() * GST_RATE;
  const calculateTotal = () =>
    calculateSubtotal() + calculateGST() + SERVICE_FEE;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold">Error Loading Order</h2>
            <p className="text-muted-foreground">
              {error || "Order not found"}
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => router.push("/orders")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
              <Button onClick={fetchOrder}>Retry</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/myOrders")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">Order ID: {order._id}</p>
            </div>
            <Badge
              className={`${getStatusColor(
                order.status
              )} text-sm px-4 py-2 w-fit`}
            >
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <OrderTimeline status={order.status} />
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((orderItem, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      <img
                        src={orderItem.item.image}
                        alt={orderItem.item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{orderItem.item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₹{orderItem.item.price} × {orderItem.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{orderItem.item.price * orderItem.quantity}
                        </p>
                      </div>
                    </div>

                    {index < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Additional Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Additional Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Table Number
                    </p>
                    <p className="font-medium">{order.tableNumber}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.customerEmail}</p>
                  </div>
                </div>

                {order.orderNotes && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order Notes
                        </p>
                        <p className="font-medium">{order.orderNotes}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{calculateSubtotal()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span className="font-medium">
                    ₹{calculateGST().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">₹{SERVICE_FEE}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Order placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(ordersApi.invoiceUrl(order._id), "_blank")
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
