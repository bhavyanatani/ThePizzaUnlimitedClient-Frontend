"use client";

import { Utensils } from "lucide-react";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { ReservationInfo } from "@/components/reservation/ReservationInfo";
import { Separator } from "@/components/ui/separator";

const ReservationPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="absolute inset-0 opacity-[0.15]">
          <img
            src="/restaurant-interior.jpg"
            alt="Restaurant Interior"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary shadow-lg shadow-primary/30 mb-6 ring-4 ring-primary/30 backdrop-blur-sm">
              <Utensils className="w-10 h-10 text-primary-foreground drop-shadow-md" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight">
              Reserve Your Table
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              Plan your perfect dining experience with us. Book your table in just a few clicks.
            </p>
            <div className="flex gap-2 justify-center pt-4">
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <div className="h-1 w-12 bg-accent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 sm:py-20 space-y-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
          {/* Form */}
          <div className="space-y-6 animate-fade-in">
            <ReservationForm />
          </div>

          {/* Info + Image */}
          <div className="space-y-6 lg:sticky lg:top-8 animate-fade-in [animation-delay:200ms]">
            <ReservationInfo />

            {/* Restaurant Image Card */}
            <div className="group relative rounded-2xl overflow-hidden shadow-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-primary/30 bg-card">
              <div className="absolute inset-0 bg-gradient-to-t from-[#00000066] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src="/restaurant-interior.jpg"
                alt="Beautiful restaurant interior"
                className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-lg font-semibold drop-shadow-lg">Experience Fine Dining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="max-w-6xl mx-auto">
          <Separator className="bg-border" />
        </div>

        {/* Reservations List */}

      </div>

      {/* Footer */}
      <footer className="relative border-t border-border mt-20 bg-gradient-to-b from-transparent to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 mb-2">
              <Utensils className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Restaurant</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReservationPage;
