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
import { useEffect, useState } from "react";

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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!loaded) setError(true);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [loaded]);

  // if (error) {
  //   return (
  //     <Sheet open={open} onOpenChange={onOpenChange}>
  //       <SheetContent>
  //         <SheetHeader>
  //           <SheetTitle>Error</SheetTitle>
  //           <SheetDescription>
  //             Unable to load the page. Please check the URL and try again.
  //           </SheetDescription>
  //         </SheetHeader>
  //       </SheetContent>
  //     </Sheet>
  //   );
  // }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        {!error ? (
          <iframe
            src={url}
            className="w-full h-full"
            onError={() => {
              console.log("error open sheet");
              setError(true);
            }}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="mt-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Open in new tab
            </a>
          </div>
        )}

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
