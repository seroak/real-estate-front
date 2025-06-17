export const getFolderList = async ({ queryKey }: { queryKey: ["folders", string] }) => {
  const [, userId] = queryKey;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/list?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch folders");
  const data = await res.json();
  return data.folders;
};
export const addEstatesToFolder = async ({ folderName, estateIds }: { folderName: string; estateIds: string[] }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/add-estate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: "admin", folder_name: folderName, estate_ids: estateIds }),
  });
  if (!res.ok) throw new Error(`Failed to add estates to folder '${folderName}'`);
  return folderName;
};
