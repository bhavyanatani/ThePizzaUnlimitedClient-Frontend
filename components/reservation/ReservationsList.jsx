"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Calendar, Clock, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { reservationsApi } from "@/lib/api";
const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export const ReservationsList = () => {
  const { getToken } = useAuth()
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchReservations = async () => {
  const token = await getToken()
  console.log(token);
    setLoading(true);
    try {
      const data = await reservationsApi.getMy(token);
      if (data.success) {
        setReservations(data.reservations || []);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();

    const handleNewReservation = () => {
      fetchReservations();
    };

    window.addEventListener("reservationCreated", handleNewReservation);
    return () => window.removeEventListener("reservationCreated", handleNewReservation);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <Card className="border-border/40">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No reservations yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your upcoming reservations will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          Your Reservations
          <div className="h-8 w-1 bg-gradient-to-b from-accent to-primary rounded-full"></div>
        </h2>
        <p className="text-muted-foreground">Keep track of your upcoming dining experiences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reservations.map((reservation) => (
          <Card
            key={reservation._id}
            className="group shadow-lg border-2 border-border/40 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card via-card to-primary/5"
          >
            <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-transparent rounded-t-lg border-b border-border/20">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {reservation.name}
                </CardTitle>
                <Badge
                  variant={getStatusVariant(reservation.status)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold shadow-sm capitalize"
                >
                  {getStatusIcon(reservation.status)}
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">
                  {new Date(reservation.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{reservation.time}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 rounded-lg p-3 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">
                  {reservation.peopleCount} {reservation.peopleCount === 1 ? "guest" : "guests"}
                </span>
              </div>

              {reservation.specialRequest && (
                <div className="pt-3 border-t border-border/30 mt-2">
                  <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Special Request:</span>{" "}
                      {reservation.specialRequest}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
