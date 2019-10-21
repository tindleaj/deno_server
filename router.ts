export class Router {
  routes = [];

  add(method, url, handler): void {
    this.routes.push({ method, url, handler });
  }

  resolve(context, request) {
    let path = request.url

    for (let { method, url, handler } of this.routes) {
      // TODO this matching logic seems a bit loose
      let match = url.match(path)

      if (!match || request.method !== method) continue;
      return handler(context, path, request)
    }
    return null
  }
}
