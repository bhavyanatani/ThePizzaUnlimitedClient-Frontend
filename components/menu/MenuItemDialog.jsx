"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { menuApi } from "@/lib/api";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { cartApi } from "@/lib/api";

export const MenuItemDialog = ({ itemId, open, onOpenChange }) => {
  const { getToken } = useAuth();

  const handleAddToCart = async (itemId, quantity = 1) => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Please sign in to add items to your cart");
        return;
      }

      const data = await cartApi.addItem(itemId, quantity, token);

      if (data.success) {
        toast.success("Item added to cart 🛒");
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Something went wrong.");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["menuItem", itemId],
    queryFn: () => menuApi.getItemById(itemId),
    enabled: !!itemId && open,
  });

  const item = data?.menuItem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogTitle className="sr-only">
          {item?.name || "Menu Item"}
        </DialogTitle>

        {isLoading ? (

          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : item ? (
          <>
            <DialogHeader>

              <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
          }}
        />

                {item.available === false && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-6 py-2">
                      Currently Unavailable
                    </Badge>
                  </div>
                )}
              </div>

              <DialogTitle className="text-3xl font-semibold">
                {item.name}
              </DialogTitle>

              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-bold text-orange-500">
                  ₹{item.price}
                </span>

                {item.available ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-500"
                  >
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
              </div>
            </DialogHeader>

            <DialogDescription className="text-base mt-4">
              {item.description || "No description available."}
            </DialogDescription>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>

              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!item.available}
                onClick={() => handleAddToCart(item._id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </DialogFooter>
          </>
        ) : (

          <div className="text-center py-8 text-muted-foreground">
            Item not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
