/// <reference types="cypress" />

import { jsonComparer as jc, jsonRefactor as jr } from "json-test-utility";
import * as _ from "lodash";
import {
  reporter,
  checkAPIContract,
  checkForListOfJsons,
  checkDates,
} from "./../../TestUtil";

export class APITestHelper {
  token: string;
  baseUrl: string;
  serverExt: string;
  constructor(response: any) {
    if (Cypress.config().baseUrl === null) {
      throw new Error("baseUrl must be defined in the config for api tests");
    }
    this.token =
      //@ts-ignore
      response.token_type + " " + response.access_token;
    this.baseUrl = Cypress.config().baseUrl ?? "";
    this.serverExt = Cypress.env("serverExt");
  }

  validateAPIOnHomePage() {
    this.noQueryParamEndpoints();
  }

  noQueryParamEndpoints() {
    const labelsEndpoint = this.serverExt + "/labels";
    const labelsResponse = cy.request({
      url: this.baseUrl + labelsEndpoint,
      method: "GET",
      headers: { Authorization: this.token },
    });
    checkForListOfJsons(labelsResponse, labelsEndpoint);
    checkAPIContract({
      actualResponse: labelsResponse,
      fixtureFilePath: "labelsContract.json",
      fixtureAlias: "labelsContract",
    });

    const issuesOpenEndpoint = this.serverExt + "/issues/open";
    const issuesOpenResponse = cy.request({
      url: this.baseUrl + issuesOpenEndpoint,
      method: "GET",
      headers: { Authorization: this.token },
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

    const issuesOutstandingEndpoint = this.serverExt + "/issues/outstanding";
    const issuesOutstandingResponse = cy.request({
      url: this.baseUrl + issuesOutstandingEndpoint,
      method: "GET",
      headers: { Authorization: this.token },
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
  }
}
