import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CartSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 flex-shrink-0 rounded-lg" />

            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
