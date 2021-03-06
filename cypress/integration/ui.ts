/// <reference types="cypress" />

import * as u from "../support/UIEnvHelpers";
import {
  OutstandingIssuesHelper,
} from "../support/TestHelpers/UITestHelpers";
import { variable, string } from "json-test-utility";

function toLabel(str: string) {
  return string.titleCase("Check " + str) ?? "No Label";
}

describe("Cythereal", () => {
  const envHelper = u.envUtil.chooseEnvHelper(Cypress.env("env"));
  // const outstandingIssues = new OutstandingIssuesHelper();

  before("Logs into Cythereal", function () {
    envHelper.login();
  });

  it("Test flow", () => {
    // pageHelper.checkFlow();
    // envHelper.checkNavBar();
  });

  after("Logout from the site", () => {
    cy.getLogoutButton().click();
  });
});
