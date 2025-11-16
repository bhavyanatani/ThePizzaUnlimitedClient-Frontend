"use client";
import {
  Check,
  Clock,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";

const OrderTimeline = ({ status }) => {
  const currentStatus = status?.toLowerCase();

  const steps = [
    { key: "pending", label: "Pending", icon: <Clock className="w-5 h-5" /> },
    { key: "preparing", label: "Preparing", icon: <ChefHat className="w-5 h-5" /> },
    { key: "ready", label: "Ready", icon: <PackageCheck className="w-5 h-5" /> },
    { key: "completed", label: "Completed", icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  if (currentStatus === "cancelled") {
    return (
      <div className="w-full py-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
            <XCircle className="w-6 h-6" />
          </div>
          <p className="mt-3 text-red-600 font-semibold text-lg">Order Cancelled</p>
        </div>
      </div>
    );
  }

  const activeIndex = steps.findIndex((s) => s.key === currentStatus);

  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const progressWidth = ((safeActiveIndex) / (steps.length - 1)) * 100 + "%";

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">

        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>

        {steps.map((step, index) => {
          const active = index <= safeActiveIndex;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                  transition-all duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  }`}
              >
                {active ? <Check className="w-5 h-5" /> : step.icon}
              </div>

              <span
                className={`text-xs sm:text-sm font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
