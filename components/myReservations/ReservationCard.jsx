import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, CalendarDays } from "lucide-react";
import { format } from "date-fns";

const statusStyles = {
  Pending: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  Confirmed: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Completed: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  Cancelled: "bg-muted text-muted-foreground border-border",
};

const ReservationCard = ({ reservation, onCancel }) => {
  const createdAtDate = reservation.createdAt
    ? new Date(reservation.createdAt)
    : null;
  const formattedCreatedAt =
    createdAtDate && !isNaN(createdAtDate)
      ? format(createdAtDate, "MMM dd, yyyy 'at' hh:mm a")
      : "Unknown";

  return (
    <div className="bg-card rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-foreground">
          {reservation.name}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            statusStyles[reservation.status]
          }`}
        >
          {reservation.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-foreground">
          <Users className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">
            {reservation.peopleCount}{" "}
            {reservation.peopleCount === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="flex items-center text-foreground">
          <Calendar className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">
            {reservation.date
              ? format(new Date(reservation.date), "MMM dd, yyyy")
              : "Unknown"}
          </span>
        </div>

        <div className="flex items-center text-foreground">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">{reservation.time}</span>
        </div>

        <div className="flex items-center text-muted-foreground pt-2 border-t border-border">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span className="text-xs">Booked: {formattedCreatedAt}</span>
        </div>
      </div>

      {reservation.status === "Pending" && (
        <Button
          onClick={() => onCancel(reservation._id, reservation.status)}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-colors duration-200"
        >
          Cancel Reservation
        </Button>
      )}
    </div>
  );
};

export default ReservationCard;
