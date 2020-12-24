/// <reference types="cypress" />

import { IEnvHelper } from "./IEnvHelper";

export class LocalEnv implements IEnvHelper {
  clientPort: string;
  serverPort: string;
  constructor() {
    this.clientPort = Cypress.env("client_port");
    this.serverPort = Cypress.env("server_port");
    throw new Error("Local Auth has not be implemented yet!");
  }

  login(): void {
    throw new Error("Method not implemented.");
  }

  checkNavBar(): void {
    throw new Error("Method not implemented.");
  }
}
