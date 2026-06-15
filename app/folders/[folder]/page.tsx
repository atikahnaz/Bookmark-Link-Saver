import { Suspense } from "react";
import Content from "./ContentPage";

export default async function FolderPage({
  params,
}: PageProps<"/folders/[folder]">) {
  //const {folder} = await params;
  return (
    <div>
      {/* <h1>Folder name</h1> */}
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(
          ({ folder }) => (
            console.log(folder, "folder name from params"),
            (<Content folder={Number(folder)} />)
          ),
        )}
      </Suspense>
    </div>
  );
}
