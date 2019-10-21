import { serve, Response } from "https://deno.land/std/http/server.ts";
import { Router } from "./router.ts";
import { testHandler } from "./route_handlers.ts";

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
        request.respond({
          body: new TextEncoder().encode(`No resolver found for ${request.url}`)
        });
      }
    }
  }

  stop() {
    this.server.close();
  }
}
