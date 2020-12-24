import * as _ from "lodash";
import {
  jsonComparer as jc,
  jsonRefactor as jr,
  jsonComparer,
} from "json-test-utility";

export function safeStringify(thing: any): string {
  try {
    return JSON.stringify(thing);
  } catch (e) {
    return (
      "failed to stringify object.\nObject: " + thing + "\nException: " + e
    );
  }
}

export function reporter(actual: any, expected: any): string {
  if (_.isEqual(actual, expected)) {
    return "Actual and Expected are both equal to: " + safeStringify(actual);
  }
  return (
    "Actual: " +
    safeStringify(actual) +
    "\nExpected: " +
    safeStringify(expected)
  );
}

export function checkAPIContract(input: APIContractInput) {
  input.actualResponse.then((r) => {
    cy.fixture(input.fixtureFilePath).as(input.fixtureAlias);
    cy.get("@" + input.fixtureAlias).then((f: any) => {
      const failed = r.body.filter(
        (actual: any) =>
          !jc.typecheck(f.expected, actual, f.typeCheckerOptions ?? {})
      );
      failed.forEach((actual: any) => {
        expect(
          true,
          f.desc +
            " The following element failed the type check contract check. " +
            reporter(actual, f.expected) +
            "\n With given type checker options: " +
            (safeStringify(f.typeCheckerOptions) ?? "None")
        ).to.be.false;
      });
      if (failed.length === 0) {
        expect(
          true,
          f.desc +
            " All elements from the response passed the contract check" +
            "\n With given type checker options: " +
            safeStringify(f.typeCheckerOptions ?? "None")
        ).to.be.true;
      }
    });
  });
}

export function checkForListOfJsons(
  response: Cypress.Chainable<Cypress.Response>,
  endpoint: string
) {
  response.then((r) => {
    const arrayCheck = Array.isArray(r.body);
    expect(
      arrayCheck,
      "check that the " +
        endpoint +
        " body is an array." +
        (arrayCheck ? "" : " Body: " + safeStringify(r.body))
    ).to.be.true;
    const jsonCheck = r.body.every((j: any) => jc.isJSON(j));
    expect(
      jsonCheck,
      "check that every element in the " +
        endpoint +
        " body is a json." +
        (jsonCheck ? "" : "Body: " + safeStringify(r.body))
    ).to.be.true;
  });
}

export function checkDates(
  jsons: any[],
  endpoint: string,
  nullableDates?: string[]
): void {
  const nDates = nullableDates ?? [];
  const invalidEntries = jsons
    .map((j) => {
      const kva = jr.toKeyValArray(j);
      const invalidEntries = kva.filter((kv) => {
        if (!nDates.some((date) => date === kv.key) ?? true) {
          return new Date(kv.value).toString() === "Invalid Date";
        } else {
          if (kv.value === null) {
            return false;
          }
          return new Date(kv.value).toString() === "Invalid Date";
        }
      });
      return invalidEntries;
    })
    .filter((iE) => iE.length > 0);
  invalidEntries.forEach((iE) => {
    expect(
      true,
      endpoint +
        " entry contains a date that not formatted correctly. InvalidEntry: " +
        safeStringify(iE) +
        ". Given nullable date fields: " +
        safeStringify(nDates)
    ).to.be.false;
  });
  if (invalidEntries.length === 0) {
    expect(
      true,
      endpoint +
        " Date check passed. Given nullable date fields: " +
        safeStringify(nDates)
    ).to.be.true;
  }
}
