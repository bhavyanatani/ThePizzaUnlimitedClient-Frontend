"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/lib/api";
import { CategorySidebar } from "@/components/menu/CategorySidebar";
import { MenuItemsGrid } from "@/components/menu/MenuItemsGrid";
import { MenuItemDialog } from "@/components/menu/MenuItemDialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";



const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: menuApi.getCategories,
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["menuItems", selectedCategory],
    queryFn: () => menuApi.getItemsByCategory(selectedCategory, 100),
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    if (
      categoriesData?.categories &&
      categoriesData.categories.length > 0 &&
      !selectedCategory
    ) {
      setSelectedCategory(categoriesData.categories[0]._id);
    }
  }, [categoriesData, selectedCategory]);

  const handleViewDetails = (itemId) => {
    setSelectedItemId(itemId);
    setDialogOpen(true);
  };

  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart!`, {
      description: `₹${item.price}`,
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "/restaurantBg.jpg",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <CategorySidebar
          categories={categoriesData?.categories || []}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isLoading={categoriesLoading}
        />

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-screen">
            <div className="p-4 sm:p-6 lg:p-8 pb-20">
              <div className="mb-8 lg:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 drop-shadow-sm">
                  Our Menu
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg drop-shadow-sm">
                  Explore our delicious offerings
                </p>
              </div>

              <MenuItemsGrid
                items={itemsData?.items || []}
                isLoading={itemsLoading}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      <MenuItemDialog
        itemId={selectedItemId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Menu;
