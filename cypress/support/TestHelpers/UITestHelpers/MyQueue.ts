/// <reference types="cypress" />

import { IPageHelper } from "../../IPageHelper";

export class MyQueue implements IPageHelper {
  gitlabUsername: string;
  constructor() {
    this.gitlabUsername = Cypress.env("gitlabUsername");
  }

  getRoot() {
    return cy.get("#my-queue");
  }

  checkFlow(): void {
    this.checkForm();
  }

  checkForm(): void {
    this.getRoot().scrollIntoView();
    this.checkLabels();
    this.searchGitLabUser();
  }

  checkLabels(): void {
    // My Quere root labels
    this.getRoot().find("h1").contains("My Queue").should("exist");
    this.getRoot().find("h4").contains("GitLab Username:").should("exist");
    this.getRoot().find("button").contains("Edit").should("exist");
  }

  checkSubFormLabels(): void {
    this.getRoot().find("h1").contains("My Queue").should("exist");
    // Check new labels.
    this.getRoot().find("h5").contains("GitLab Username:").should("exist");
    this.getRoot().find("span").contains("@").should("exist");
    this.getRoot()
      .find('input[placeholder="Username"]')
      .as("input")
      .should("exist");
    this.getRoot().find("div").contains("Save").as("save").should("exist");
    this.getRoot()
      .find("button")
      .contains("Cancel")
      .as("cancel")
      .should("exist");
  }

  searchGitLabUser(): void {
    this.getRoot().find("button").contains("Edit").as("edit").click();
    this.checkSubFormLabels();
    cy.get("@input").type(this.gitlabUsername);
    cy.get("@save").click();
    this.getRoot().find("div.card-header").contains("Issues").should("exist");
    this.getRoot()
      .find("div.list-group")
      .find("div.list-group-item")
      .find("span.badge-dark")
      .each((e) => {
        expect(e.text().match(/^\d+$/), "Check that issue number is a number.")
          .to.not.be.null;
      });
    cy.get("@edit").click();
    this.checkSubFormLabels();
  }
}
