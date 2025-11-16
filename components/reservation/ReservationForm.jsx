"use client";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Calendar, Clock, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reservationsApi } from "@/lib/api";


const timeSlots = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

export const ReservationForm = () => {
  const { getToken } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    peopleCount: "",
    date: "",
    time: "",
    specialRequest: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    const token = await getToken()
    e.preventDefault();

    if (
      !formData.name ||
      !formData.peopleCount ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const peopleCount = parseInt(formData.peopleCount);
    if (peopleCount < 1 || peopleCount > 20) {
      toast.error("People count must be between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      const data = await reservationsApi.create({
        name: formData.name,
        peopleCount,
        date: formData.date,
        time: formData.time,
        specialRequest: formData.specialRequest,
      }, token);

      if (data.success) {
        toast.success("Reservation Created!", {
          description: "We've reserved your table — see you soon!",
        });

        setFormData({
          name: "",
          peopleCount: "",
          date: "",
          time: "",
          specialRequest: "",
        });

        window.dispatchEvent(new Event("reservationCreated"));
      } else {
        toast.error(data.message || "Failed to create reservation");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Reservation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2 border-border/50 backdrop-blur-sm bg-card/95 hover:shadow-primary/10 transition-all duration-300">
      <CardHeader className="space-y-3 pb-8 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-t-lg border-b border-border/30">
        <CardTitle className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="h-10 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          Reserve Your Table
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground pl-4">
          Plan your perfect dining experience with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 bg-background border-border/60 focus:border-primary transition-colors shadow-sm hover:shadow-md"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="peopleCount"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Users className="w-4 h-4 text-primary" />
                Number of Guests
              </Label>
              <Input
                id="peopleCount"
                type="number"
                min="1"
                max="20"
                placeholder="1-20"
                value={formData.peopleCount}
                onChange={(e) =>
                  setFormData({ ...formData, peopleCount: e.target.value })
                }
                className="h-12 bg-background border-border/60 focus:border-primary transition-colors shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="w-4 h-4 text-primary" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="h-12 bg-background border-border/60 focus:border-primary transition-colors shadow-sm hover:shadow-md"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="time"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Clock className="w-4 h-4 text-primary" />
              Time
            </Label>
            <Select
              value={formData.time}
              onValueChange={(value) =>
                setFormData({ ...formData, time: value })
              }
            >
              <SelectTrigger className="h-12 bg-background border-border/60 focus:border-primary transition-colors shadow-sm hover:shadow-md">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="specialRequest"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              Special Request (Optional)
            </Label>
            <Textarea
              id="specialRequest"
              placeholder="Any special requests? (e.g., window seat, dietary restrictions)"
              value={formData.specialRequest}
              onChange={(e) =>
                setFormData({ ...formData, specialRequest: e.target.value })
              }
              maxLength={200}
              className="min-h-[100px] resize-none bg-background border-border/60 focus:border-primary transition-colors shadow-sm hover:shadow-md"
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.specialRequest.length}/200 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Reserve Your Table"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
