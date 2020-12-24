/// <reference types="cypress" />

import * as _ from "lodash";
import * as a from "../support/APIEnvHelpers";
import { APITestHelper } from "../support/TestHelpers/APITestHelpers";

describe("GitLab Reports", () => {
  context("api", () => {
    const envHelper = a.envUtil.chooseEnvHelper(Cypress.env("env"));
    before("Checks api responses on home page", function () {
      // login checks the home page api end points
      envHelper.login();
    });

    it("Check api calls loaded on home page load", function () {
      cy.get(this.resolvedToken).then((g) => {
        console.log(g[0].response);
        const apiTestHelper = new APITestHelper(g[0].response.body);
        apiTestHelper.validateAPIOnHomePage();
      });
    });

    after("Logout from the site", () => {
      cy.getLogoutButton().click();
      cy.get('img[alt="Acadian Company Logo"]');
    });
  });
});
