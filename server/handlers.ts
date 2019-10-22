export async function testHandler(context, path, request) {
  let body = { data: "success" };

  return { 
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  }
}