import { AfterAll, Given } from "@cucumber/cucumber";
import sinon from "sinon";
import { server } from "../src/api.js";

let _testServer;

function waitForServerStatus(server) {
  return new Promise((res, rej) => {
    server.once("error", (err) => rej(err));
    server.once("listening", () => res());
  });
}

AfterAll((done) => {
  sinon.restore();
  server.closeAllConnections();
  _testServer.close(done);
});

// Não crie arrow function por questão de contexto
Given("I have a running server", async function () {
  if (!_testServer) {
    _testServer = server.listen();
    await waitForServerStatus(_testServer);
  }

  const serverInfo = _testServer.address();
  //   Assim eu consigo passars essa propriedade para os demais arquivos
  this.testServerAddress = `http://localhost:${serverInfo.port}`;
});

Given("The current date is {string}", async function (date) {
  sinon.restore();
  const clock = sinon.useFakeTimers(new Date(date).getTime());
  this.clock = clock;
});
