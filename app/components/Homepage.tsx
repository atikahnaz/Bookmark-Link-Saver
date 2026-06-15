"use client";
import React, { useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import SheetPage from "./SheetPage";
import UrlItem from "./UrlItem";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
}

export default function Homepage() {
  const [urlSheetPage, setUrlSheetPage] = useState<string>("");
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { bookmarks } = useBookmarks();

  const onOpenSheet = (url: string) => {
    console.log("Opening sheet with URL:", url);
    setUrlSheetPage(url);
    setOpenSheet(true);
  };

  return (
    <div className="">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="">
          <UrlItem
            link={bookmark}
            links={bookmarks}
            onOpenSheet={onOpenSheet}
          ></UrlItem>

          {/* Open sheetpage at right */}
          <SheetPage
            url={urlSheetPage}
            open={openSheet}
            onOpenChange={setOpenSheet}
          />
        </div>
      ))}
    </div>
  );
}
