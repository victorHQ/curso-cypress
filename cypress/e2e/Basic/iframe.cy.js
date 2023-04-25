/// <reference types="cypress" />

import { baseUrlBasic } from '../../support/commandsBasic';

describe('Work with iFrames', () => {
  it('Deve preencher campo de texto', () => {
    cy.visit(`${baseUrlBasic}`);
    cy.get('#frame1').then((iframe) => {
      const body = iframe.contents().find('body');
      cy.wrap(body)
        .find('#tfield')
        .type('Funciona?')
        .should('have.value', 'Funciona?');
      cy.on('window:alert', (msg) => {
        expect(msg).to.be.equal('Alert Simples');
      });
    });
  });

  it('Deve testar frame diretamente', () => {
    cy.visit('https://wcaquino.me/cypress/frame.html');
    cy.get('#otherButton').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.be.equal('Click OK!');
    });
  });
});
