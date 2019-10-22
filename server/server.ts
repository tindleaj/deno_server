import { serve, Response } from "https://deno.land/std/http/server.ts";
import { Router } from "./router.ts";
import { testHandler } from "./handlers.ts";
import { serveFile } from "./file_server.ts"

const defaultHeaders = new Headers({ "Content-Type": "text/plain" });

export class AppServer {
  private server;
  private hostname: String;
  private port: Number;
  private router: Router;

  constructor(hostname: String, port: Number) {
    this.router = new Router();
    this.hostname = hostname;
    this.port = port;
    this.server = serve(`${hostname}:${port}`);

    // bind route handlers
    this.router.add("GET", "/api/test", testHandler);
  }

  async start() {
    console.log(`Starting server at '${this.hostname}:${this.port}'`);

    for await (const request of this.server) {
      let resolved = this.router.resolve(this, request);

      if (resolved) {
        resolved
          .catch(error => {
            if (error.status !== null) return error;
            return { body: String(error), status: 500 };
          })
          .then(data => {
            const response: Response = {
              status: data.status || 200,
              headers: data.headers || defaultHeaders,
              body: new TextEncoder().encode(data.body)
            };

            request.respond(response);
          });
      } else {
        let filePath = `.${request.url}`;
        let fileInfo

        try {
          // MUY HACKY
          fileInfo = await Deno.stat(filePath);
        } catch(err) {
          console.error(err)
        }

        if (fileInfo && fileInfo.isFile()) {
          serveFile(request, filePath)
            .catch(error => {
              if (error.status !== null) return error;
              return { body: String(error), status: 500 };
            })
            .then(file => {
              request.respond(file);
            })
        } else {
          serveFile(request, './index.html')
            .catch(error => {
              if (error.status !== null) return error;
              return { body: String(error), status: 500 };
            })
            .then(file => {
              request.respond(file);
            })
        }
      }
    }
  }

  stop() {
    this.server.close();
  }
}
