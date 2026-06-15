"use client";

import { error } from "console";
import { createContext, useContext, useState, useEffect } from "react";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
  foldersId?: number[];
}

interface FolderProps {
  id: number;
  name: string;
}

interface BookmarkContextType {
  bookmarks: LinkProps[];
  addBookmark: (bookmark: LinkProps) => void;
  updateBookmark: (updatedBookmark: LinkProps, id: number) => void;
  deleteBookmark: (index: number) => void;
  folders: FolderProps[];
  addFolder: (folder: FolderProps) => AddFolderResult;
  updateFolder: (updatedFolder: FolderProps) => UpdateFolderResult;
  deleteFolder: (id: number) => void;
}

// Define return type
export type AddFolderResult =
  | { success: true }
  | { success: false; error: "FOLDER_EXISTS" };

type UpdateFolderResult =
  | { success: true }
  | { success: false; error: "FOLDER_EXISTS" };

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "bookmarks";
const FOLDER_STORAGE_KEY = "folders";

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<LinkProps[]>([]);
  const [folders, setFolders] = useState<FolderProps[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(STORAGE_KEY);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
        console.log("Loaded bookmarks from localStorage:", savedBookmarks);
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // load folders from localStorage on mount
  useEffect(() => {
    try {
      const savedFolders = localStorage.getItem(FOLDER_STORAGE_KEY);
      console.log("Loaded folders from localStorage:", savedFolders);
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders));
      }
    } catch (error) {
      console.error("Failed to load folders from localStorage:", error);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        console.log("is loaded ");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
        console.log(bookmarks);
      } catch (error) {
        console.error("Failed to save bookmarks to localStorage:", error);
      }
    }
  }, [bookmarks, isLoaded]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
      console.log("Saved folders to localStorage:", folders);
    } catch (error) {
      console.error("Failed to save folders to localStorage:", error);
    }
  }, [folders]);

  const addBookmark = (bookmark: LinkProps) => {
    setBookmarks((prev) => [bookmark, ...prev]);
  };

  const updateBookmark = (updatedBookmark: LinkProps, id: number) => {
    setBookmarks((prev) =>
      prev.map((bookmark) => (bookmark.id === id ? updatedBookmark : bookmark)),
    );
  };

  const deleteBookmark = (id: number) => {
    console.log("delete bookmark", id);
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const addFolder = (folder: FolderProps): AddFolderResult => {
    // Handle same name folder
    const folderExist = folders.some(
      (f) => f.name.trim().toLowerCase() === folder.name.toLowerCase(),
    );

    if (folderExist) {
      return { success: false, error: "FOLDER_EXISTS" };
    }
    setFolders((prev) => [...prev, folder]);
    return { success: true };
  };

  const updateFolder = (updatedFolder: FolderProps) => {
    // Handle same name folder
    const folderExist = folders.some(
      (f) =>
        f.name.trim().toLowerCase() === updatedFolder.name.trim().toLowerCase(),
    );

    if (folderExist) {
      return { success: false, error: "FOLDER_EXISTS" };
    }
    setFolders((prev) =>
      prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f)),
    );
    return { success: true };
  };

  const deleteFolder = (id: number) => {
    console.log("delete folder", id);
    console.log(folders.find((folder) => folder.id === id));
    setFolders((prev) => prev.filter((folder) => folder.id !== id));

    // Also remove folderId from bookmarks that belong to the deleted folder
    setBookmarks((prev) =>
      prev.map((bookmark) => {
        if (bookmark.foldersId && bookmark.foldersId.includes(id)) {
          return {
            ...bookmark,
            foldersId: bookmark.foldersId.filter((folderId) => folderId !== id),
          };
        }
        return bookmark;
      }),
    );
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
