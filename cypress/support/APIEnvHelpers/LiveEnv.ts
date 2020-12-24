/// <reference types="cypress" />

import { IEnvHelper } from "./IEnvHelper";
import * as _ from "lodash";

export class LiveEnv implements IEnvHelper {
  username: string;
  password: string;
  constructor() {
    this.username = Cypress.env("username");
    this.password = Cypress.env("password");
  }

  login() {
    cy.server();
    cy.route({
      url: "https://apps.acadian.com/auth/connect/token",
      method: "POST",
    }).as("token");
    cy.visit("GitLabReports");
    cy.wait(6000)
      .url()
      .then((url) => {
        if (url.match(/auth\/Account\/Login/i) != null) {
          cy.get("#inputUserName")
            .type(this.username)
            .get("#inputPassword")
            .type(this.password, { log: false })
            .get('button[value="login"]')
            .click()
            .get('a[href*="/GitLabReports/"]');
        } else {
          const msg = "Already logged in.";
          cy.log(msg);
          expect(
            true,
            "Test needs to be rerun in a state where the user is logged out of the site in order to generate the auth token"
          ).to.be.false;
        }
      });
    cy.wait("@token").as("resolvedToken");
  }
}
