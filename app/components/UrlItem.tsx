"use client";
import React, { useState } from "react";
import {
  PlusIcon,
  DeleteIcon,
  X,
  Trash2,
  Pencil,
  FolderPlus,
  Trash2Icon,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Item } from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/context/BookmarkContext";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
  foldersId?: number[];
}

interface Metadata {
  title: string;
  description: string;
  image: string;
  icon: string;
  canEmbed: boolean;
}

export default function UrlItem({
  link,
  links,
  onOpenSheet,
}: {
  link: LinkProps;
  links: LinkProps[];
  onOpenSheet: (url: string) => void;
}) {
  const [linkToEdit, setLinkToEdit] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const { updateBookmark, deleteBookmark, folders, addFolder } = useBookmarks();
  const [selectionFolders, setSelectionFolders] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({
    title: "",
    description: "",
    image: "",
    icon: "",
    canEmbed: true,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleEditClick = (id: number) => {
    const link = links.find((link) => link.id === id); // find the link from array based on edit TODO: add id as key
    if (link) {
      setLinkToEdit(link.url);
      const categories = link.categories ? link.categories : [];
      setSelectedCategories(categories);
    }
  };

  const editLink = (id: number) => {
    // Logic to edit the link
    const updatedLink: LinkProps = {
      url: linkToEdit,
      categories: selectedCategories,
      id: id,
    };
    updateBookmark(updatedLink, id); // update bookmark in context
  };

  const deleteCategoryButton = (category: string) => {
    selectedCategories.find((c) => c === category);
    const updatedCategories = selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updatedCategories);
  };

  const addNewCategory = () => {
    if (newCategory.trim() === "") return;
    if (selectedCategories.includes(newCategory.trim())) {
      alert("Category already exists");
      return;
    }
    const updatedCategories =
      selectedCategories.length > 0
        ? [...selectedCategories, newCategory.trim()]
        : [newCategory.trim()];
    setSelectedCategories(updatedCategories);
    setNewCategory("");
  };

  const handleOpenDialog = (id: number) => () => {
    handleEditClick(id);
    setOpen(true);
  };

  const saveUrlToFolder = (id: number) => {
    // Change folder names to folder ids based on selectionFolders state and folders from context
    const selectedFolderIds = folders
      .filter((folder) => selectionFolders.includes(folder.name))
      .map((folder) => folder.id);

    // if selectedFolderId empty, set foldersId to empty array to remove link from folders
    if (selectedFolderIds.length === 0) {
      const updatedLink: LinkProps = {
        ...link,
        foldersId: [],
      };
      updateBookmark(updatedLink, id); // update bookmark in context
      return;
    }
    // Logic to save url to folder
    const updatedLink: LinkProps = {
      ...link,
      foldersId: selectedFolderIds,
    };

    updateBookmark(updatedLink, id); // update bookmark in context
  };

  // Display metadata when loading the page, and update when url is edited
  async function fetchMetadata(url: string) {
    try {
      setLoading(true);
      setLoaded(false);
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      // Check if website can be embedded in iframe based on response headers, and if not, set metadata to display message that preview is not available
      const xFrameOptions = response.headers.get("X-Frame-Options");
      const csp = response.headers.get("Content-Security-Policy");
      const canEmbed =
        !xFrameOptions && (!csp || !csp.includes("frame-ancestors"));

      setMetadata({
        title: data.title,
        description: data.description,
        image: data.image,
        icon: data.icon,
        canEmbed: canEmbed,
      });
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
    setLoading(false);
    setLoaded(true);
    console.log("Metadata fetched:", metadata);
  }

  React.useEffect(() => {
    fetchMetadata(link.url);
  }, [link.url]);

  const anchor = useComboboxAnchor();

  // Loading skeleton while fetching metadata
  if (loading) {
    return (
      <div className="flex w-full items-center gap-5 my-5">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div key={link.id}>
      <div key={link.id} className="flex justify-between items-center">
        <div>
          {/* Open sheet preview when bookmark is clicked */}
          <div
            className="flex items-center gap-2 my-1.5 cursor-pointer"
            onClick={() => {
              if (metadata.canEmbed) {
                console.log(metadata.canEmbed);
                onOpenSheet(link.url); // callback function to open sheet page with url
              } else {
                window.open(link.url, "_blank"); // open in new tab if cannot embed
              }
            }}
          >
            {metadata.icon && (
              <img src={metadata.icon} alt="icon" width={20} height={20} />
            )}
            <h2 className="ml-1.5 text-lg font-semibold">{metadata.title}</h2>
          </div>

          <p className="text-muted-foreground text-sm">
            {metadata.description}
          </p>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 text-sm hover:underline"
          >
            {link.url}
          </a>
        </div>

        {/* Edit Link Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <form>
            {/* <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => handleEditClick(link.id)}
              >
                Edit
              </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Link</DialogTitle>
                <DialogDescription>
                  Make changes to your link here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="url-1">Url</Label>
                  <Input
                    id="url-1"
                    name="url"
                    value={linkToEdit}
                    onChange={(e) => setLinkToEdit(e.target.value)}
                  />
                </div>

                {/* Add new categories */}
                <div className="grid gap-3 ">
                  <Label htmlFor="new-category">New Category</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-category"
                      name="new-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addNewCategory}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </div>

                {/* Display categories as button */}
                {selectedCategories.length > 0 && (
                  <Item variant="outline" className="p-1">
                    {selectedCategories.map((category, i) => (
                      <Button
                        variant="secondary"
                        key={i}
                        className="p-0.5 text-xs "
                        onClick={() => deleteCategoryButton(category)}
                      >
                        {category}
                        <X />
                      </Button>
                    ))}
                  </Item>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" onClick={() => editLink(link.id)}>
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <div className="flex gap-2">
          {/* Save bookmark to Folder Dialog*/}
          <Dialog>
            <DialogTrigger>
              <FolderPlus size={14} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save to </DialogTitle>
                <DialogDescription>
                  Select a folder to save this bookmark in, or create a new
                  folder.
                  {/* input for folder */}
                </DialogDescription>

                <Combobox
                  multiple
                  autoHighlight
                  items={folders.map((folder) => folder.name)}
                  onValueChange={(value) => {
                    setSelectionFolders(value);
                    console.log("Selected folders:", value);
                  }}
                  defaultValue={folders
                    .filter((folder) => link.foldersId?.includes(folder.id))
                    .map((folder) => folder.name)}
                >
                  <ComboboxChips ref={anchor} className="w-full max-w-xs">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => saveUrlToFolder(link.id)}
                  >
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Pencil size={14} onClick={handleOpenDialog(link.id)}></Pencil>

          {/* Delete Bookmark Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* <Button variant="destructive">Delete Chat</Button> */}
              <Trash2 size={14}></Trash2>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this bookmark. Are you sure you
                  want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteBookmark(link.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {link.categories && link.categories.length > 0
        ? link.categories.map((category, i) => (
            <Badge key={i} variant="outline" className="mr-1">
              {category}
            </Badge>
          ))
        : null}
      <Separator orientation="horizontal" className="my-2" />
    </div>
  );
}
