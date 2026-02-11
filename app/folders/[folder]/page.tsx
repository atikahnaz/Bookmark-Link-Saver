import { Suspense } from "react";

export default async function FolderPage({
  params,
}: PageProps<"/folders/[folder]">) {
  return (
    <div>
      <h1>Folder name</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(({ folder }) => (
          <Content folder={folder} />
        ))}
      </Suspense>
    </div>
  );
}

async function Content({ folder }: { folder: string }) {
  return (
    <div>
      <h2>Folder: {folder}</h2>
    </div>
  );
}
