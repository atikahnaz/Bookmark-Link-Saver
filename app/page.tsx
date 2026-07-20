"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import SaveLink from "./components/SaveLink";
import Homepage from "./components/Homepage";

interface LinkProps {
  url: string;
  categories?: string[];
  id: number;
}

export default function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);

  const saveLinkList = (link: LinkProps) => {
    if (link.url) {
      // Do not update if link already exist
      if (links.some((l) => l.url === link.url)) {
        console.log("exists");
        alert("Link already exists");
        return;
      }
      setLinks(
        (prev) => [...prev, link],
        //const next = [...prev, link];
        //console.log("Links updated:", next);
        //return next;
      );
    } else {
      alert("Please Enter url");
    }
  };

  useEffect(() => {
    console.log("Links updated:", links);
  }, [links]);

  const handleUpdateLink = (updatedLink: LinkProps, id: number) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? updatedLink : link)),
    );
    console.log("Link updated:", updatedLink);
  };

  return (
    <>
      <main>
        <div className="z-10 w-full items-center justify-between font-mono text-sm lg:max-w-3/4">
          <SaveLink />
        </div>
        <div>
          <Homepage />
        </div>
      </main>
    </>
  );
}
