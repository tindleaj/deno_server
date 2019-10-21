
export async function serveFile(
  req,
  filePath
): Promise<Response> {
  const file = await open(filePath);
  const fileInfo = await stat(filePath);
  const headers = new Headers();
  headers.set("content-length", fileInfo.len.toString());
  headers.set("content-type", contentType(extname(filePath)) || "text/plain");

  const res = {
    status: 200,
    body: file,
    headers
  };
  return res;
}
