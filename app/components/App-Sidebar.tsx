"use client";
import {
  Calendar,
  Home,
  Inbox,
  Plus,
  Search,
  Settings,
  User2,
  Folder,
  ArchiveIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  Pencil,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/context/BookmarkContext";
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
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Recent Bookmarks",
    url: "/",
    icon: Inbox,
  },
];

export function ErrorDialogFolderName({
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
          <AlertDialogTitle>Failed to save Folder</AlertDialogTitle>
          <AlertDialogDescription>
            Folder already existed. Please write a new name
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AppSidebar() {
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openEditFolder, setOpenEditFolder] = useState<boolean>(false);
  const [openDeleteFolder, setOpenDeleteFolder] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number>();
  const [folderEditName, setFolderEditName] = useState<string>("");
  const [openDialogErrorFolderName, setOpenDialogErrorFolderName] =
    useState<boolean>(false);
  const { folders, addFolder, updateFolder, deleteFolder } = useBookmarks();

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const result = addFolder({ name: newFolderName, id: Date.now() });
      if (!result.success) {
        if (result.error === "FOLDER_EXISTS") {
          // Handle folder with the same name
          setOpenDialogErrorFolderName(true); // TODO pass the state

          return;
        }
      }
      setNewFolderName("");
      setOpen(false); // Close popover after saving
    }
  };

  const handleUpdateFolder = (id: number, name: string) => {
    const result = updateFolder({ id, name });

    if (!result.success) {
      if (result.error === "FOLDER_EXISTS") {
        setOpenDialogErrorFolderName(true);
        return;
      }
    }
  };

  const handleDeleteFolder = (id: number) => {
    deleteFolder(id);
  };

  const DeleteFolderDialog = ({ id }: { id: number }) => {
    return (
      <Dialog open={openDeleteFolder} onOpenChange={setOpenDeleteFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Folder {folders.find((f) => f.id === id)?.name}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => {
                if (selectedFolderId !== undefined) {
                  handleDeleteFolder(id);
                }
                setOpenDeleteFolder(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <ErrorDialogFolderName
        open={openDialogErrorFolderName}
        onOpenChange={() => setOpenDialogErrorFolderName(false)}
      />
      <Sidebar>
        <SidebarHeader>
          <h1>Bookmark Manager</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* Side bar group */}
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {/* Add new folder*/}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <SidebarGroupAction title="Add Folder">
                  <Plus /> <span className="sr-only"></span>
                </SidebarGroupAction>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <PopoverHeader>
                  <PopoverTitle>Add New Folder</PopoverTitle>
                  <PopoverDescription>
                    Enter the name of the new folder
                  </PopoverDescription>
                </PopoverHeader>
                <Input
                  id="width"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="mt-2"
                />
                <Button className="my-4" onClick={handleAddFolder}>
                  Save
                </Button>
              </PopoverContent>
            </Popover>

            {/* Folder list */}
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {folders.map((folder) => (
                  <ContextMenu key={folder.id}>
                    <ContextMenuTrigger>
                      <SidebarMenuItem
                        onClick={() => {
                          setSelectedFolderId(folder.id);
                          // setFolderEditName(folder.name);
                          // setOpenEditFolder(true);
                        }}
                        onContextMenu={() => setSelectedFolderId(folder.id)}
                      >
                        <SidebarMenuButton asChild>
                          <a href={`/folders/${folder.id}`}>
                            <Folder />
                            {folder.name}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <ContextMenuGroup>
                        <ContextMenuItem
                          onSelect={() => {
                            setSelectedFolderId(folder.id);
                            setFolderEditName(folder.name);
                            setOpenEditFolder(true);
                          }}
                        >
                          <PencilIcon />
                          Edit
                        </ContextMenuItem>

                        <ContextMenuItem>
                          <ShareIcon />
                          Share
                        </ContextMenuItem>
                      </ContextMenuGroup>
                      <ContextMenuSeparator />
                      <ContextMenuGroup>
                        <ContextMenuItem
                          variant="destructive"
                          onClick={() => setOpenDeleteFolder(true)}
                        >
                          <TrashIcon />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuGroup>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

            {/* Edit folder dialog */}
            <Dialog open={openEditFolder} onOpenChange={setOpenEditFolder}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Folder</DialogTitle>
                  <DialogDescription>Update the folder name</DialogDescription>
                </DialogHeader>
                <Input
                  id="edit-folder-name"
                  value={folderEditName}
                  onChange={(e) => setFolderEditName(e.target.value)}
                  className="mt-2"
                />
                <DialogFooter>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      if (
                        selectedFolderId !== undefined &&
                        folderEditName.trim()
                      ) {
                        handleUpdateFolder(selectedFolderId, folderEditName);
                        // updateFolder(
                        //   { id: selectedFolderId, name: folderEditName },
                        //   selectedFolderId,
                        // );
                      }
                      setOpenEditFolder(false);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete folder dialog */}
            <DeleteFolderDialog id={selectedFolderId!} />
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User2 /> Username
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
