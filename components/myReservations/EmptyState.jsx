import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-card rounded-2xl shadow-lg p-12 max-w-md text-center">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
          <Calendar className="w-12 h-12 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-3">
          No Reservations Yet
        </h2>

        <p className="text-muted-foreground mb-6">
          You haven't made any reservations yet. Start exploring and book your
          next dining experience!
        </p>

        <Link href="/reservations">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg">
            Find a Table
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
