"use client";
import React, { useState } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import SheetPage from "./SheetPage";
import UrlItem from "./UrlItem";

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
        <div key={bookmark.id}>
          <UrlItem link={bookmark} onOpenSheet={onOpenSheet}></UrlItem>

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
