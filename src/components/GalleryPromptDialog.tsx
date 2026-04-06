import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

interface GalleryPromptDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (shareToGallery: boolean) => void;
}

const GalleryPromptDialog = ({ open, onClose, onConfirm }: GalleryPromptDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading">Share to Gallery?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Would you like to feature this design in our{" "}
            <Link to="/gallery" className="underline text-foreground hover:text-primary transition-colors" onClick={onClose}>
              community Gallery
            </Link>
            ? No personal details will be shown — just the design image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onConfirm(false)}>
            No, just download
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(true)}>
            Yes, share & download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GalleryPromptDialog;
