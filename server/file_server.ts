import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

const { open, stat } = Deno;

export async function serveFile(
  req: ServerRequest,
  filePath: string
): Promise<any> {
  let file, fileInfo

  try {
    file = await open(filePath);
    fileInfo = await stat(filePath);

    const headers = new Headers();
    headers.set("content-length", fileInfo.len.toString());
    headers.set("content-type", contentType(extname(filePath)) || "text/plain");

    const res = {
      status: 200,
      body: file,
      headers
    };

    return res;
  } catch(err) {
    console.error(err)
  }
}
