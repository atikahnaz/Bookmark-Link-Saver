"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import UrlItem from "../components/UrlItem";
import { useBookmarks } from "@/context/BookmarkContext";

export default function SearchPage() {
  // TODO:
  // seach based on bookmark and category
  const [searchBookmarksWords, setSearchBookmarksWords] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string>("");
  const { bookmarks } = useBookmarks();

  // TODO: run function to search bookmarks
  const searchBookmarks = () => {
    const queryWords = searchBookmarksWords.toLowerCase().trim();
    console.log(queryWords);
    const bookmarksExists = bookmarks.filter((bookmark) => {
      return (
        bookmark.metadata?.title?.toLowerCase().includes(queryWords) ||
        bookmark.metadata?.description?.toLowerCase().includes(queryWords) ||
        bookmark.url.toLowerCase().includes(queryWords)
      );
    });
    console.log(bookmarksExists, "Bookmark Exists");
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
    </>
  );
}
