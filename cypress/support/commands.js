// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Cypress.on("fail", () => {});

Cypress.Commands.add("getHomeIcon", () =>
  cy.get("a").contains("GitLab Reports")
);

Cypress.Commands.add("checkHomeIcon", () => cy.getHomeIcon().should("exist"));

Cypress.Commands.add("getIssueMovement", () =>
  cy.get("a").contains("Issue Movement")
);

Cypress.Commands.add("checkIssueMovement", () =>
  cy.getIssueMovement().should("exist")
);
Cypress.Commands.add("getLogoutButton", () =>
  cy.get("#user-info-dropdown")
    .click()
    .get('a[href*="/users/logout/"]')
);

Cypress.Commands.add("checkLogoutButton", () =>
  cy.getLogoutButton().should("exist")
);

Cypress.Commands.add("checkGreetingMessage", (options) => {
  let ogNames = [options?.preferredFirstName, options?.lastName];
  let ogNamesFiltered = ogNames.filter((n) => n != null || n != undefined);
  let name = ogNamesFiltered.join(" ");
  let regex = new RegExp("Hello, " + name + "!", "i");
  if (ogNamesFiltered.length != ogNames.length) {
    regex = new RegExp("Hello, .*" + name + ".*!", "i");
  }
  cy.get('span[class="mr-2 navbar-text"').contains(regex).should("exist");
});

Cypress.Commands.add("checkNavBar", (options) => {
  cy.checkGreetingMessage(options?.greetingMessageOptions);
  cy.checkHomeIcon();
  cy.checkLogoutButton();
  cy.checkIssueMovement();
});
