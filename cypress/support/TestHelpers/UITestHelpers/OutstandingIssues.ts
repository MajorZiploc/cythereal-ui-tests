/// <reference types="cypress" />

import { IPageHelper } from "../../IPageHelper";

export class OutstandingIssuesHelper implements IPageHelper {
  getRoot() {
    return cy.get("#outstanding-issues");
  }

  checkFlow(): void {
    // this.checkForm();
  }

  checkForm(): void {
    this.getRoot().scrollIntoView();
    this.checkLabels();
    this.checkIssueNumbers();
    this.filterOutstandingIssues();
    this.openAllOutstandingCards();
  }

  checkLabels(): void {
    this.getRoot().find("span").contains("Outstanding Issues").should("exist");
  }

  filterOutstandingIssues() {
    // Click the filter button
    this.getRoot().find("button").contains("Atlas Only").click().wait(1000);
    // Check that labels 'Non-Atlas' are not in the html
    this.getRoot()
      .find(".card-header")
      .contains("Outstanding Issues")
      .parent()
      .parent()
      .find("span[class='mx-1 badge']")
      // first option. clean and fairly clear.
      .should("not.contain", "Non-Atlas");

    // second option for the test. clean, but the log is less clear.
    // .contains("Non-Atlas")
    // .should("not.exist");

    // third option. very clear logs. but not the standard way to do this.
    // .each((e, i) => {
    //   expect(e.text()).to.not.contain("Non-Atlas");
    // });
  }

  checkIssueNumbers() {
    this.getRoot()
      .find("span.badge-dark")
      .each((e) => {
        expect(
          e.text().trim(),
          "Check that the issue number is a number. Text to check: " + e.text()
        ).to.match(/^\d+$/);
      });
  }

  openAllOutstandingCards() {
    this.getRoot()
      .find(".card-header")
      .contains("Outstanding Issues")
      .parent()
      .parent()
      .find('div[class="py-2 card-header"]')
      .click({ multiple: true });
  }
}
