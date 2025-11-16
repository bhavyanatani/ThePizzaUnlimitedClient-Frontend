import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const EmptyCart = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-muted p-8">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
      </div>

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Your cart is empty
      </h2>
      <p className="mb-6 text-muted-foreground">
        Looks like you haven't added anything to your cart yet.
      </p>

      <Link href="/menu">
        <Button size="lg">Start Shopping</Button>
      </Link>
    </div>
  );
};
