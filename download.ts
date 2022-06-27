export async function exists(source: string): Promise<boolean> {
  try {
    Deno.lstatSync(source);
    return true;
  } catch (e) {
    return false;
  }
}

export async function download(
  source: string,
  destination: string
): Promise<void> {
  if (await exists(destination)) {
    Deno.removeSync(destination);
  }

  // We use browser fetch API
  const response = await fetch(source);
  const blob = await response.blob();

  // We convert the blob into a typed array
  // so we can use it to write the data into the file
  const buf = await blob.arrayBuffer();
  const data = new Uint8Array(buf);

  // We then create a new file and write into it
  const file = await Deno.create(destination);
  await Deno.writeAll(file, data);

  // We can finally close the file
  Deno.close(file.rid);
}
