import { MenuItemCard } from "./MenuItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";

export const MenuItemsGrid = ({
  items,
  isLoading,
  onViewDetails,
  onAddToCart,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="space-y-3 bg-card/80 backdrop-blur-md rounded-xl p-3 border border-border/50"
          >
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 px-4">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <UtensilsCrossed className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          No items available
        </h3>
        <p className="text-muted-foreground max-w-md text-sm sm:text-base">
          There are no items in this category at the moment. Please check back later or
          explore other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item._id}
          item={item}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
