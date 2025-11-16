import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const CartSummary = ({ subtotal, onCheckout }) => {
  return (
    <Card className="sticky bottom-4 mt-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-lg font-semibold text-foreground">Subtotal</span>
          <span className="text-2xl font-bold text-primary">₹{subtotal}</span>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold gap-2 group"
          onClick={onCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Taxes and shipping calculated at checkout
        </p>
      </div>
    </Card>
  );
};
