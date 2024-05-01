import { server } from "./server.js";

if (process.env.NODE_ENV !== "test") {
  server.listen(process.env.Port, () => {
    const serverInfo = server.address();
    console.log(
      `server is running at ${serverInfo.address}:${serverInfo.port}`
    );
  });
}

export default server;
