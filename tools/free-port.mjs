// Prints a free TCP port on 127.0.0.1 (listen on port 0, read it back, close).
// Used synchronously by playwright.config.ts so concurrent e2e tasks never share a port.
import { createServer } from 'node:net';

const server = createServer();
server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  server.close(() => process.stdout.write(String(port)));
});
