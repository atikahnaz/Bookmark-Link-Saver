"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import UrlItem from "../components/UrlItem";
import SheetPage from "../components/SheetPage";
import { useBookmarks } from "@/context/BookmarkContext";

export default function SearchPage() {
  interface LinkProps {
    url: string;
    categories?: string[];
    id: number;
    foldersId?: number[];
    metadata?: Metadata;
  }

  interface FolderProps {
    id: number;
    name: string;
  }

  interface Metadata {
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    canEmbed?: boolean;
  }

  // TODO:
  // seach based on bookmark and category
  const [searchBookmarksWords, setSearchBookmarksWords] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string>("");
  const [listBookmarks, setListBookmarks] = useState<LinkProps[]>([]);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [urlSheetPage, setUrlSheetPage] = useState<string>("");
  const { bookmarks } = useBookmarks();

  const onOpenSheet = (url: string) => {
    console.log("Opening sheet with URL:", url);
    setUrlSheetPage(url);
    setOpenSheet(true);
  };

  // TODO: run function to search bookmarks
  const searchBookmarks = () => {
    const queryWords = searchBookmarksWords.toLowerCase().trim();
    console.log(queryWords, "query");
    const bookmarksExists = bookmarks.filter((bookmark) => {
      return (
        bookmark.metadata?.title?.toLowerCase().includes(queryWords) ||
        bookmark.metadata?.description?.toLowerCase().includes(queryWords) ||
        bookmark.url.toLowerCase().includes(queryWords)
      );
    });
    setListBookmarks(bookmarksExists);
    console.log(bookmarksExists, "Bookmark Exists");
    if (listBookmarks.length === 0) {
      console.log(listBookmarks.length);
      return <div>not found</div>;
    }
  };

  return (
    <>
      <FieldGroup className="flex flex-col md:grid max-w-full grid-cols-3">
        <Field>
          <FieldLabel htmlFor="first-name">Search Bookmarks</FieldLabel>
          <Input
            id="first-name"
            placeholder="Search"
            value={searchBookmarksWords}
            onChange={(e) => setSearchBookmarksWords(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchBookmarks();
              }
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="last-name">Categories</FieldLabel>
          <Input id="last-name" placeholder="categories" />
        </Field>
        <Field className="justify-end">
          <Button onClick={searchBookmarks}>Search</Button>
        </Field>
      </FieldGroup>
      <div>
        {listBookmarks.length === 0 ? (
          <div className="mt-4">Not found</div>
        ) : (
          listBookmarks.map((bookmark) => (
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
          ))
        )}
      </div>
    </>
  );
}
