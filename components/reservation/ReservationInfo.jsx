"use client";

import { Info, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ReservationInfo = () => {
  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2 border-border/50 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm hover:shadow-primary/10 transition-all duration-300">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-start gap-4 bg-primary/5 rounded-xl p-5 border border-primary/10">
          <div className="p-3 bg-primary/10 rounded-full ring-4 ring-primary/5">
            <Info className="w-6 h-6 text-primary flex-shrink-0" />
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-foreground text-xl">Reservation Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We can accommodate up to 20 guests per reservation. For larger events or private dining,
              please contact us directly. We recommend booking at least 24 hours in advance for the best availability.
            </p>
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            Need Assistance?
          </h4>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors group">
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                (555) 123-4567
              </span>
            </div>

            <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors group">
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                reservations@restaurant.com
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
