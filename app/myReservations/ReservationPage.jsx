"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReservationCard from "@/components/myReservations/ReservationCard";
import CancelModal from "@/components/myReservations/CancelModal";
import EmptyState from "@/components/myReservations/EmptyState";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { reservationsApi } from "@/lib/api";
import { usePolling } from "@/lib/usePolling";

const MyReservations = () => {
  const { getToken } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [prevStatuses, setPrevStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadInitialReservations();
  }, []);

  const loadInitialReservations = async () => {
    try {
      setLoading(true);
      setError(false);
      setUnauthorized(false);

      const token = await getToken();
      const data = await reservationsApi.getMy(token);

      if (data.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      if (!data.success) throw new Error("Failed to fetch reservations");

      setReservations(data.reservations || []);

      const s = {};
      (data.reservations || []).forEach((r) => (s[r._id] = r.status));
      setPrevStatuses(s);

    } catch (err) {
      console.error("Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => {
    pollReservations();
  }, 6000); 

  const pollReservations = async () => {
    try {
      const token = await getToken();
      const data = await reservationsApi.getMy(token);

      if (!data.success) return;

      if (!Array.isArray(data.reservations)) return;

      const updated = [...reservations];
      const newStatuses = { ...prevStatuses };

      let changed = false;

      data.reservations.forEach((serverRes) => {
        const local = updated.find((r) => r._id === serverRes._id);

        if (!local) return;

        if (local.status !== serverRes.status) {

          toast.success(`Reservation Updated: ${serverRes.status}`);

          local.status = serverRes.status;
          newStatuses[local._id] = serverRes.status;

          changed = true;
        }
      });

      if (changed) {
        setReservations(updated);
        setPrevStatuses(newStatuses);
      }
    } catch (err) {

    }
  };

  const handleCancelClick = (id, status) => {
    if (status !== "Pending") {
      toast.error("Only pending reservations can be deleted");
      return;
    }
    setCancellingId(id);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      setDeleting(true);
      const token = await getToken();
      const data = await reservationsApi.cancel(cancellingId, token);

      if (!data.success) throw new Error("Failed to cancel reservation");

      toast.success("Reservation cancelled");
      setReservations((prev) => prev.filter((r) => r._id !== cancellingId));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-2xl shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to see your reservations.
          </p>
          <Button className="bg-primary">Sign In</Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive text-lg">Error loading reservations</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          My Reservations
        </h1>
        <p className="text-muted-foreground mb-8">
          View and manage your restaurant bookings
        </p>

        {reservations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        )}

        <CancelModal
          isOpen={cancellingId !== null}
          onClose={() => setCancellingId(null)}
          onConfirm={handleConfirmCancel}
          isDeleting={deleting}
        />
      </div>
    </div>
  );
};

export default MyReservations;
