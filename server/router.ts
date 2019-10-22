export class Router {
  routes = [];

  add(method, url, handler): void {
    this.routes.push({ method, url, handler });
  }

  resolve(context, request) {
    let requestUrl = request.url

    for (let { method, url, handler } of this.routes) {
      // TODO this matching logic seems a bit inadequate
      let re = new RegExp(url)
      let match = re.exec(requestUrl)

      if (!match || request.method !== method) continue;
      return handler(context, requestUrl, request)
    }
    return null
  }
}
