import server from './server';

const port = process.env.APPSERVER_PORT || 8080;

server.listen(port, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Fastify AppServer Example listening at ${address}`);
});
