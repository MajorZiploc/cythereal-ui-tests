/// <reference types="cypress" />

import { IPageHelper } from "./../../IPageHelper";

export class IssueChartHelper implements IPageHelper {
  getRoot() {
    return cy.get("#issue-chart");
  }

  checkFlow(): void {
    this.checkForm();
  }

  checkForm(): void {
    this.getRoot().scrollIntoView();
    this.checkLabels();
    this.hoverOverBars();
    this.toggleBarGraphFilters();
  }

  checkLabels(): void {
    [
      "Blocked",
      "Prioritized",
      "In Progress",
      "Awaiting PR Review",
      "Not Fixed",
      "Testing",
      "Ready For Production",
    ].forEach((label) =>
      this.getRoot().find("tspan").contains(label).should("exist")
    );
    this.getRoot().find("g.apexcharts-grid").should("exist");
    this.getRoot()
      .find('g[class="apexcharts-xaxis apexcharts-yaxis-inversed"]')
      .should("exist");
    this.getRoot()
      .find('g[class="apexcharts-bar-series apexcharts-plot-series"]')
      .should("exist");
    this.getRoot().find("g.apexcharts-series").should("exist");
    this.getRoot().find("g.apexcharts-datalabels").should("exist");
  }

  hoverOverBars() {
    [
      // red bars
      'path[fill="rgba(217,83,79,0.85)"]',
      // blue bars
      'path[fill="rgba(66,139,202,0.85)"]',
      // purple bars
      'path[fill="rgba(162,149,214,0.85)"]',
      // green bars
      'path[fill="rgba(168,214,149,0.85)"]',
      // gray bars
      'path[fill="rgba(112,128,144,0.85)"]',
    ].forEach((bar) =>
      this.getRoot().find(bar).click({ multiple: true, force: true })
    );
  }

  toggleBarGraphFilters() {
    const labels = [
      "Bug",
      "Enhancement",
      "Task",
      "Form",
      "Visual Tweak",
      "Other",
    ];
    labels.forEach((l) => {
      this.getRoot()
        .find('span[class="apexcharts-legend-text"]')
        .contains(l)
        .parent()
        .as("graphToggle")
        .click();
      cy.get("@graphToggle")
        .invoke("attr", "data:collapsed")
        .should("contain", "true");
      cy.get("@graphToggle").click();
      cy.get("@graphToggle")
        .invoke("attr", "data:collapsed")
        .should("contain", "false");
    });
  }
}
