"use client";

import UrlItem from "../../components/UrlItem";
import { useBookmarks } from "@/context/BookmarkContext";
import SheetPage from "../../components/SheetPage";
import { useState } from "react";

export default function Content({ folder }: { folder: number }) {
  const { bookmarks, folders } = useBookmarks();
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [urlSheetPage, setUrlSheetPage] = useState<string>("");
  const onOpenSheet = (url: string) => {
    console.log("Opening sheet with URL:", url);
    setUrlSheetPage(url);
    setOpenSheet(true);
  };

  if (!folders.length) {
    return <div>Loading...</div>;
  }

  const folderId = folders.find((f) => f.id === folder)?.id;

  if (!folderId) {
    console.log(folder, "folder name");
    return <div>Folder not found</div>;
  }
  const folderName = folders.find((f) => f.id === folder)?.name;

  const bookmarksInFolder = bookmarks.filter((bookmark) => {
    if (!bookmark.foldersId) return false;
    const folderIds = bookmark.foldersId;
    return folderIds.includes(folderId);
  });

  return (
    <div>
      <h2>Folder: {folderName}</h2>

      <div className="">
        {/* <DialogEditUrl links={links} onUpdateLink={onUpdateLink}></DialogEditUrl> */}
        {bookmarksInFolder.map((bookmark, index) => (
          <div key={index}>
            <UrlItem
              link={bookmark}
              links={bookmarks}
              onOpenSheet={onOpenSheet}
              // onUpdateLink={onUpdateLink}
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
    </div>
  );
}
