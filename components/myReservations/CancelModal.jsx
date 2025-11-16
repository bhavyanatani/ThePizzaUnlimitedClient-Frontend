import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CancelModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-gray-900">
            Cancel Reservation?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-base">
            Are you sure you want to cancel this reservation? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-gray-300 hover:bg-gray-50 mx-4"
          >
            Keep Reservation
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-[#D87355] hover:bg-[#C46347] text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancel"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelModal;
