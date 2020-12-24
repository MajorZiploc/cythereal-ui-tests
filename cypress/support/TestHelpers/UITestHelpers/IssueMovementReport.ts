/// <reference types="cypress" />

import { IPageHelper } from "../../IPageHelper";

export class IssueMovementReportHelper implements IPageHelper {
  checkFlow(): void {
    this.checkForm();
  }

  checkForm(): void {
    cy.getIssueMovement().click().wait(1000);
    this.checkLabels();
    this.checkButtons();
    this.selectsIssuesMovingOutOfAwaitingPRThePastMonth();
    cy.getHomeIcon().click().wait(1000);
  }

  checkLabels(): void {
    const tagAndText_s = [
      { tag: "h1", text: /Issue Movement Report/i },
      { tag: "h5", text: /Movement/i },
      { tag: "h5", text: /Label/i },
      { tag: "h5", text: /Time Period/i },
      { tag: "button", text: /Run/i },
      { tag: "button", text: /Into/i },
      { tag: "button", text: /Out Of/i },
      { tag: "button", text: /Hour/i },
      { tag: "button", text: /Day/i },
      { tag: "button", text: /Week/i },
      { tag: "button", text: /Month/i },
      { tag: "label", text: /Blocked/i },
      { tag: "label", text: /Prioritized/i },
      { tag: "label", text: /In Progress/i },
      { tag: "label", text: /Awaiting PR Review/i },
      { tag: "label", text: /Not Fixed/i },
      { tag: "label", text: /Testing/i },
      { tag: "label", text: /Ready For Production/i },
    ];
    tagAndText_s.forEach((tagAndText) => {
      const tag = tagAndText.tag;
      const text = tagAndText.text;
      cy.get(tag).contains(text).should("exist");
    });
  }

  checkButtons() {
    cy.get('input[type="radio"]').click({ multiple: true });
    const tagAndText_s = [
      { tag: "button", text: /Into/i },
      { tag: "button", text: /Out Of/i },
      { tag: "button", text: /Hour/i },
      { tag: "button", text: /Day/i },
      { tag: "button", text: /Week/i },
      { tag: "button", text: /Month/i },
    ];
    tagAndText_s.forEach((tagAndText) => {
      const tag = tagAndText.tag;
      const text = tagAndText.text;
      cy.get(tag).contains(text).click();
    });
    cy.get("#imr-run-btn").click();
    cy.wait(1000);
  }

  selectsIssuesMovingOutOfAwaitingPRThePastMonth() {
    cy.wait(1000)
      .get("button")
      .contains("Out Of")
      .click()
      .get("label")
      .contains(/Awaiting PR Review/i)
      .click()
      .get("button")
      .contains("Month")
      .click()
      .get("#imr-run-btn")
      .click()
      .wait(1000);
    // This table will not show if there are no search results
    cy.get("#imr-results")
      .find('div[class="card-header"]')
      .contains(/Issues/i)
      .contains(/\d/)
      .should("exist");
  }
}
