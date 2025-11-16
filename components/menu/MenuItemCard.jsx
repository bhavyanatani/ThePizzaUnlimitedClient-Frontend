"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { cartApi } from "@/lib/api";

export const MenuItemCard = ({ item, onViewDetails }) => {
  const { getToken } = useAuth();

  const handleAddToCart = async () => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Please sign in to add items to your cart");
        return;
      }

      const data = await cartApi.addItem(item._id, 1, token);

      if (data.success) {
        toast.success("Item added to cart 🛒");
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.03] group bg-card backdrop-blur-md border-border/50">
      
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge
          className={cn(
            "absolute top-3 right-3 shadow-lg backdrop-blur-sm border-0 text-xs sm:text-sm px-2 sm:px-3 py-1",
            item.available
              ? "bg-success/90 text-success-foreground"
              : "bg-destructive/90 text-destructive-foreground"
          )}
        >
          {item.available ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <CardContent className="p-3 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-2 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">₹</span>
          <p className="text-xl sm:text-2xl font-bold text-primary">{item.price}</p>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0 gap-2 flex-col xs:flex-row">

        <Button
          variant="outline"
          size="sm"
          className="w-full xs:flex-1 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
          onClick={() => onViewDetails(item._id)}
        >
          <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Details</span>
        </Button>

        <Button
          size="sm"
          className="w-full xs:flex-1 shadow-md hover:shadow-lg transition-shadow"
          disabled={!item.available}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
