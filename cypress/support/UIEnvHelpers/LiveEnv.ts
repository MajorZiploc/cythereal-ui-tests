/// <reference types="cypress" />

import { IEnvHelper } from "./IEnvHelper";
Cypress.on('uncaught:exception', (err, runnable)=> {
                  return false;
          })
export class LiveEnv implements IEnvHelper {
  username: string;
  password: string;
  constructor() {
    this.username = Cypress.env("username");
    this.password = Cypress.env("password");
  }

  login() {
    cy.server();
    cy.visit("users/login/");
    cy.route("**/account").as("userinfo");


    cy.wait(3500)
      .url()
      .then((url) => {
        if (url.match(/users\/login/i) != null) {
          cy.get('input[name="username"]')
            .type(this.username)
            .get('input[name="password"]')
            .type(this.password, { log: false })
            .get('input[type="submit"]')
            .click()
            .get('a[href*="/home"]');
        } else {
          const msg = "Already logged in.";
          cy.log(msg);
          expect(
            true,
            "Test needs to be rerun in a state where the user is logged out of the site in order to generate the auth token"
          ).to.be.false;
        }
      });
    // wait for site to initialize

    cy.wait("@userinfo");
    cy.wait(200);
  }

  checkNavBar() {
  }
}
