"use client";
import Image from "next/image";
import { useState } from "react";
import SaveLink from "./components/SaveLink";
import Homepage from "./components/Homepage";

interface LinkProps {
  url: string;
  categories?: string[];
}

export default function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);

  const updateLinkList = (link: LinkProps) => {
    if (link.url) {
      // Do not update if link already exist
      if (links.some((l) => l.url === link.url)) {
        console.log("exists");
        alert("Link already exists");
        return;
      }
      setLinks((prev) => [...prev, link]);
      console.log("Links updated:", links);
    } else {
      alert("Please Enter url");
    }
  };

  const handleUpdateLink = (updatedLink: LinkProps, index: number) => {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? updatedLink : link)),
    );
    console.log("Link updated:", updatedLink);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col p-10">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h1>Bookmark Link Saver</h1>
          <SaveLink updateLinkList={updateLinkList} />
        </div>
        <div>
          <h2>Saved Links:</h2>
          <Homepage links={links} onUpdateLink={handleUpdateLink} />
          {/* <div>
            {links.map((link, index) => (
              <div className="border">
                <a key={index} href={link.url}>
                  {link.url}
                </a>
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </>
  );
}
