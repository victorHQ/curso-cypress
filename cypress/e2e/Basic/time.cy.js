/// <reference types="cypress" />

import { baseUrlBasic } from '../../support/commandsBasic';

describe('Esperas...', () => {
  beforeEach(() => {
    cy.visit(`${baseUrlBasic}`);
  });

  it('Going back to the past', () => {
    // cy.get('#buttonNow').click()
    // cy.get('#resultado > span').should('contain', '15/02/2020')
    // cy.clock()
    // cy.get('#buttonNow').click()
    // cy.get('#resultado > span').should('contain', '31/12/1969')
    const dt = new Date(2012, 3, 10, 10, 30, 0);
    cy.clock(dt.getTime());
    cy.get('#buttonNow').click();
    cy.get('#resultado > span').should('contain', '10/04/2012');
  });

  it.only('Goes to the future', () => {
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').should('contain', '1682');
    cy.get('#resultado > span')
      .invoke('text')
      .then(($value) => {
        expect(parseInt($value)).to.be.gt(1682);
      });

    cy.clock();
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span')
      .invoke('text')
      .then(($value) => {
        expect(parseInt($value)).to.be.lte(0);
      });
    // cy.wait(1000)
    // cy.get('#buttonTimePassed').click()
    // cy.get('#resultado > span').invoke('text').should('lte', 1000)

    cy.tick(5000);
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span')
      .invoke('text')
      .then(($value) => {
        expect(parseInt($value)).to.be.gte(5000);
      });

    cy.tick(10000);
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span')
      .invoke('text')
      .then(($value) => {
        expect(parseInt($value)).to.be.gte(15000);
      });
  });
});
