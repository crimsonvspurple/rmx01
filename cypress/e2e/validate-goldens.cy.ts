/*
 * Now we will repeat same steps as the save process but instead of saving, we will compare the notes with the golden files.
 */
import { compare, GroupingReporter } from "dom-compare";
import { JSDOM } from "jsdom";

import { goldensPath, loginAsAdmin } from "../support/commands";


describe("smoke tests", () => {
  afterEach(() => {
    // cy.cleanupUser();
  });

  it("should login as admin and compare all notes with goldens.", () => {
    interface failure {
      "title": string,
      "details": never
    }

    loginAsAdmin();
    // let's ensure we are in notes list page
    cy.findByRole("link", { name: /notes/i }).click();

    const failures: failure[] = [];

    // now we will compare each note with the golden file
    cy.get("#goldens").children().each((noteLink) => {
      cy.wrap(noteLink).click();
      cy.get(".note-title").invoke("text").then((noteTitle) => {
        // we can probably take the .note-body html directly instead of recreating using JSDOM; need to investigate later
        cy.get(".note-body").invoke("html").then((noteBody) => {
          cy.readFile(`${goldensPath}${noteTitle}.html`).then((goldenBody) => {
            const goldenDom = new JSDOM(goldenBody).window.document.body;
            const sutDom = new JSDOM(noteBody).window.document.body;  // SUT: System Under Test
            try {
              expect(sutDom.isEqualNode(goldenDom)).to.be.true;
            } catch (exception) {
              failures.push({ title: noteTitle, details: GroupingReporter.getDifferences(compare(goldenDom, sutDom)) });
            }
          });
        });
      });
    }).then(() => {
      if (failures.length > 0) {
        cy.log("Failures:");
        failures.forEach((failure) => {
          cy.log("**ITEM** " + failure.title);
          for (const path in failure.details) {
            cy.log("*POINTER* " + path);
            cy.log("ISSUE: " + failure.details[path]);
          }
        });
      }
    }).then(() => {
      expect(failures, "Failures").to.be.empty;
    });
  });
});
