/// <reference types="cypress" />

import { IEnvHelper } from "./IEnvHelper";
import * as _ from "lodash";
import { jsonComparer as jc, jsonRefactor as jr } from "json-test-utility";
import {
  reporter,
  checkAPIContract,
  checkForListOfJsons,
  checkDates,
} from "./../../support/TestUtil";

export class LocalEnv implements IEnvHelper {
  clientPort: string;
  serverPort: string;
  username: string;
  password: string;
  constructor() {
    this.clientPort = Cypress.env("client_port");
    this.serverPort = Cypress.env("server_port");
    this.username = Cypress.env("username");
    this.password = Cypress.env("password");
    throw new Error("Local Auth has not be implemented yet!");
  }

  login(): void {
    throw new Error("Method not implemented.");
    cy.server();
    cy.route({
      url: "https://apps.acadian.com/auth/connect/token",
      method: "POST",
    }).as("token");
    cy.visit(this.clientPort + "GitLabReports");
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
    cy.wait("@token").then((g) => {
      const responseBody = g.responseBody;
      const token =
        //@ts-ignore
        g.responseBody.token_type + " " + g.responseBody.access_token;
      const bUrl = Cypress.config().baseUrl;
      const serverExt = Cypress.env("serverExt");

      // Promise.all doesnt work because responses is not of type Promise
      const labelsEndpoint = this.serverPort + serverExt + "/labels";
      const labelsResponse = cy.request({
        url: bUrl + labelsEndpoint,
        method: "GET",
        headers: { Authorization: token },
      });
      checkForListOfJsons(labelsResponse, labelsEndpoint);
      checkAPIContract({
        actualResponse: labelsResponse,
        fixtureFilePath: "labelsContract.json",
        fixtureAlias: "labelsContract",
      });

      const issuesOpenEndpoint = this.serverPort + serverExt + "/issues/open";
      const issuesOpenResponse = cy.request({
        url: bUrl + issuesOpenEndpoint,
        method: "GET",
        headers: { Authorization: token },
      });
      checkForListOfJsons(issuesOpenResponse, issuesOpenEndpoint);
      issuesOpenResponse.then((r) => {
        const dates = r.body.map((b: any) =>
          jr.subJson(b, ["updateTime", "createdTime", "closedTime"])
        );
        const nullableFields = ["closedTime"];
        checkDates(dates, issuesOpenEndpoint, nullableFields);
      });
      checkAPIContract({
        actualResponse: issuesOpenResponse,
        fixtureFilePath: "issuesOpenContract.json",
        fixtureAlias: "issuesOpenContract",
      });

      const issuesOutstandingEndpoint =
        this.serverPort + serverExt + "/issues/outstanding";
      const issuesOutstandingResponse = cy.request({
        url: bUrl + issuesOutstandingEndpoint,
        method: "GET",
        headers: { Authorization: token },
      });
      checkForListOfJsons(issuesOutstandingResponse, issuesOutstandingEndpoint);
      issuesOutstandingResponse.then((r) => {
        const dates = _.flatMap(r.body, (b: any) => b.issues).map((b: any) =>
          jr.subJson(b, ["updateTime", "createdTime", "closedTime"])
        );
        const nullableFields = ["closedTime"];
        checkDates(dates, issuesOutstandingEndpoint, nullableFields);
      });
      checkAPIContract({
        actualResponse: issuesOutstandingResponse,
        fixtureFilePath: "issuesOutstandingContract.json",
        fixtureAlias: "issuesOutstandingContract",
      });
    });
  }
}
