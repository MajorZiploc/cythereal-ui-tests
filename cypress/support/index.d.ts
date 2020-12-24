// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

interface NavBarOptions {
  greetingMessageOptions?: GreetingMessageOptions;
}

declare function safeStringify(thing: any): string;

declare function reporter(actual: any, expected: any): string;

declare function checkAPIContract(input: APIContractInput): any;

declare function checkDates(
  jsons: any[],
  endpoint: string,
  nullableDates?: string[]
): void;

declare function checkForListOfJsons(
  response: Cypress.Chainable<Cypress.Response>,
  endpoint: string
): any;

interface GreetingMessageOptions {
  preferredFirstName: string;
  lastName: string;
}

interface APIContractInput {
  actualResponse: Cypress.Chainable<Cypress.Response>;
  fixtureFilePath: string;
  fixtureAlias: string;
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command
     * @example
     */
    getHomeIcon(): Chainable<Element>;

    checkHomeIcon(): Chainable<Element>;

    getIssueMovement(): Chainable<Element>;

    checkIssueMovement(): Chainable<Element>;

    getLogoutButton(): Chainable<Element>;

    checkLogoutButton(): Chainable<Element>;

    checkGreetingMessage(options?: GreetingMessageOptions): Chainable<Element>;

    checkNavBar(options?: NavBarOptions): Chainable<Element>;
  }
}
