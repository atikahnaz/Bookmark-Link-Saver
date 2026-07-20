"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/context/BookmarkContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
  foldersId?: number[];
}

export function AlertDialogFail({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Failed to save URL</AlertDialogTitle>
          <AlertDialogDescription>
            There was an error saving the URL. Please enter a valid URL and try
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SaveLink() {
  const [url, setUrl] = useState<string>("");
  const { addBookmark } = useBookmarks();
  const [openErrorAlert, setOpenErrorAlert] = useState<boolean>(false);

  const handleSaveLink = () => {
    // Check the url is valid
    try {
      new URL(url);
    } catch (error) {
      console.error("Invalid URL:", error);
      setOpenErrorAlert(true); // Show the error alert
      setTimeout(() => {
        setOpenErrorAlert(false);
      }, 3000);
      return;
    }
    // Logic to save the link
    const newLink: LinkProps = { url, id: Date.now() };
    console.log("Link saved:", newLink);
    addBookmark(newLink);
    setUrl("");
  };

  return (
    <>
      <AlertDialogFail
        open={openErrorAlert}
        onOpenChange={() => setOpenErrorAlert(false)}
      />
      {/* {openErrorAlert && <AlertFail />} */}
      <div className="save-link flex gap-2 my-5 ">
        <Input
          placeholder="Enter link"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleSaveLink}>Save Link</Button>
      </div>
    </>
  );
}
