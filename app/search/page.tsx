"use client";
import { useEffect, useState } from "react";
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

  interface Metadata {
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    canEmbed?: boolean;
  }

  const [searchBookmarksWords, setSearchBookmarksWords] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string>("");
  const [listBookmarks, setListBookmarks] = useState<LinkProps[]>([]);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [urlSheetPage, setUrlSheetPage] = useState<string>("");
  const { bookmarks } = useBookmarks();

  const onOpenSheet = (url: string) => {
    setUrlSheetPage(url);
    setOpenSheet(true);
  };

  useEffect(() => {
    setListBookmarks(bookmarks);
  }, [bookmarks]);

  // TODO: run function to search bookmarks
  const searchBookmarks = () => {
    const queryWords = searchBookmarksWords.toLowerCase().trim();
    const queryCategory = searchCategories.toLowerCase().trim();

    const searchWords = () => {
      return bookmarks.filter((bookmark) => {
        return (
          bookmark.metadata?.title?.toLowerCase().includes(queryWords) ||
          bookmark.metadata?.description?.toLowerCase().includes(queryWords) ||
          bookmark.url.toLowerCase().includes(queryWords)
        );
      });
    };

    const searchCategory = () => {
      return bookmarks.filter((bookmark) => {
        return bookmark.categories?.some((cat) =>
          cat.toLowerCase().includes(queryCategory),
        );
      });
    };

    const searchWordsAndCat = () => {
      const wordsResults = searchWords();
      const categoryResults = searchCategory();
      return wordsResults.filter((r) => categoryResults.includes(r));
    };

    let results: LinkProps[] = [];
    if (queryWords && queryCategory) {
      results = searchWordsAndCat();
    } else if (queryWords) {
      results = searchWords();
    } else if (queryCategory) {
      results = searchCategory();
    } else {
      results = bookmarks;
    }

    setListBookmarks(results);
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
          <Input
            id="last-name"
            placeholder="categories"
            value={searchCategories}
            onChange={(e) => setSearchCategories(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchBookmarks();
              }
            }}
          />
        </Field>
        <Field className="justify-end">
          <Button onClick={searchBookmarks}>Search</Button>
        </Field>
      </FieldGroup>
      <div className="mt-4">
        {listBookmarks.length === 0 ? (
          <div>Not found</div>
        ) : (
          listBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="">
              <UrlItem link={bookmark} onOpenSheet={onOpenSheet}></UrlItem>

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
