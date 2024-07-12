/*
 * The idea of Golden test here is a bit different from the usual smoke test.
 * We don't want to log in as random user, create a note, and delete it.
 * What we want is to log in as a specific user who has notes already and save those HTML notes as golden files.
 */
import { goldensPath, loginAsAdmin } from "../support/commands";

describe("smoke tests", () => {
  afterEach(() => {
    // cy.cleanupUser();
  });

  it("should login as admin and save all notes as goldens", () => {
    loginAsAdmin();
    // let's ensure we are in notes list page
    cy.findByRole("link", { name: /notes/i }).click();

    // now we want to ensure we have notes and save all notes as golden files

    cy.get("#goldens").children().each((noteLink) => {
      cy.wrap(noteLink).click();
      cy.get(".note-title").invoke("text").then((noteTitle) => {
        cy.get(".note-body").invoke("html").then((noteBody) => {
          cy.writeFile(`${goldensPath}${noteTitle}.html`, noteBody);
        });
      });
    });
  });
});
