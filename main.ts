import { AppServer } from './server/server.ts'

function main() {
  let app = new AppServer('0.0.0.0', 8000);

  app.start();
}

main();