import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChefHat } from "lucide-react";

export const CategorySidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full lg:w-80 xl:w-96 bg-muted/30 backdrop-blur-xl border-r border-border/50 h-screen lg:h-full shadow-xl">
        <div className="p-4 sm:p-6 border-b border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Categories</h2>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)] lg:h-[calc(100vh-100px)]">
          <div className="p-3 sm:p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-muted/50 animate-pulse h-20 sm:h-24"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-muted/30 backdrop-blur-xl border-r border-border/50 h-auto lg:h-full shadow-xl">
      <div className="p-4 sm:p-6 border-b border-border/50 backdrop-blur-sm sticky top-0 bg-muted/30 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Categories</h2>
        </div>
      </div>

      <ScrollArea className="h-auto lg:h-[calc(100vh-100px)]">
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={cn(
                "w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                "border backdrop-blur-sm",
                selectedCategory === category._id
                  ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-primary/50"
                  : "bg-card text-foreground hover:bg-accent hover:text-accent-foreground border-border/30"
              )}
            >
              <h3 className="font-semibold text-base sm:text-lg mb-1">{category.name}</h3>

              <p
                className={cn(
                  "text-xs sm:text-sm line-clamp-2",
                  selectedCategory === category._id
                    ? "text-primary-foreground/90"
                    : "text-muted-foreground"
                )}
              >
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
