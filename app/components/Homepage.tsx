import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Link } from "lucide-react";
import DialogEditItem from "./DialogEditItem";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
}

export default function Homepage({
  links,
  onUpdateLink,
}: {
  links: LinkProps[];
  onUpdateLink: (updatedLink: LinkProps, index: number) => void;
}) {
  const [linkToEdit, setLinkToEdit] = useState<string>("");
  const [categoriesToEdit, setCategoriesToEdit] = useState<string>("");

  const handleEditClick = (id: number) => {
    const link = links.find((link) => link.id === id); // find the link from array based on edit TODO: add id as key
    if (link) {
      setLinkToEdit(link.url);
      setCategoriesToEdit(link.categories ? link.categories.join(", ") : "");
    }
  };

  const editLink = (id: number) => {
    // Logic to edit the link
    const updatedLink: LinkProps = {
      url: linkToEdit,
      categories: categoriesToEdit.split(", ").map((f) => f.trim()),
      id: id,
    };
    onUpdateLink(updatedLink, id);
  };

  return (
    <div className="homepage">
      {links.map((link, index) => (
        <div key={link.id}>
          {link.categories && link.categories.length > 0
            ? link.categories.map((category, i) => (
                <Badge key={i} variant="outline" className="mr-1">
                  {category}
                </Badge>
              ))
            : null}
          <div key={link.id} className="flex justify-between items-center">
            <a href={link.url}>{link.url}</a>
            {/* <p>{link.categories?.join(", ")}</p> */}

            {/* <Button className="" onClick={() => editLink(link)}>
            Edit
          </Button> */}
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(link.id)}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Link</DialogTitle>
                    <DialogDescription>
                      Make changes to your link here. Click save when
                      you&apos;re done.
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
                    <div className="grid gap-3">
                      <Label htmlFor="folder-1">Categories</Label>
                      <Input
                        id="folder-1"
                        name="folder"
                        value={categoriesToEdit}
                        onChange={(e) => setCategoriesToEdit(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit" onClick={() => editLink(link.id)}>
                        Save changes
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
          <Separator orientation="horizontal" className="my-2" />
        </div>
      ))}
    </div>
  );
}
