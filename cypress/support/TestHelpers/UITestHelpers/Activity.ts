/// <reference types="cypress" />

import { IPageHelper } from "../../IPageHelper";

export class ActivityHelper implements IPageHelper {
  getRoot() {
    return cy.get("#activity");
  }

  checkFlow(): void {
    this.checkForm();
  }

  checkForm(): void {
    this.getRoot().scrollIntoView();
    this.checkLabels();
    this.checkAllHeaderTabs();
  }

  checkLabels(): void {
    // Header elements
    this.getRoot().find("span").contains("This Week").should("exist");
    this.getRoot().find("button").contains("<").should("exist");
    this.getRoot().find("button").contains(">").should("exist");
    this.getRoot().find("button").contains("Day").should("exist");
    this.getRoot().find("button").contains("Wk").should("exist");
    this.getRoot().find("button").contains("Tu").should("exist");
    this.getRoot().find("button").contains("Fr").should("exist");
    this.getRoot().find("i.fa-globe-americas").should("exist");
    this.getRoot().find("i.fa-list-ul").should("exist");
    // Body elements
    this.getRoot().find("div").contains("Opened").should("exist");
    this.getRoot().find("div").contains("Moved to Testing").should("exist");
    this.getRoot()
      .find("div")
      .contains("Moved to Ready For Production")
      .should("exist");
    this.getRoot().find("div").contains("Closed").should("exist");
  }

  clickAllTabs() {
    this.getRoot().find("div").contains("Opened").click();
    this.getRoot().find("div").contains("Moved to Testing").click();
    this.getRoot()
      .find("div")
      .contains("Moved to Ready For Production")
      .click();
    this.getRoot().find("div").contains("Closed").click();
  }

  checkAllHeaderTabs(): void {
    // Header elements aliases
    this.getRoot().find("button").contains("<").as("lt");
    this.getRoot().find("button").contains(">").as("gt");
    this.getRoot().find("button").contains("Day").as("day");
    this.getRoot().find("button").contains("Wk").as("wk");
    this.getRoot().find("button").contains("Tu").as("tu");
    this.getRoot().find("button").contains("Fr").as("fr");
    this.getRoot().find("i.fa-globe-americas").as("globe");

    this.clickAllTabs();
    ["@lt", "@gt", "@day", "@wk", "@tu", "@fr", "@globe"].forEach((a) => {
      this.getRoot().scrollIntoView();
      cy.get(a).click();
      cy.wait(3000);
      this.clickAllTabs();
    });
  }
}
