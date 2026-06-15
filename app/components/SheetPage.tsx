import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { url } from "inspector/promises";
import { useState } from "react";

export default function SheetPage({
  url,
  open,
  onOpenChange,
}: {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  if (error) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Error</SheetTitle>
            <SheetDescription>
              Unable to load the page. Please check the URL and try again.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          {/* <SheetDescription>
          </SheetDescription> */}
        </SheetHeader>

        <iframe
          src={url}
          className="w-full h-full"
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
        />

        {/* <SheetFooter>
          <p>test</p>
          <SheetClose asChild>
            <p>test</p>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
