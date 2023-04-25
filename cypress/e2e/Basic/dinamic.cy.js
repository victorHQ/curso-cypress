/// <reference types="cypress" />

import { baseUrlBasic } from '../../support/commandsBasic';

describe('Dinamic tests', () => {
  beforeEach(() => {
    cy.visit(`${baseUrlBasic}`);
    cy.viewport(1280, 720);
  });

  const foods = ['Carne', 'Frango', 'Pizza', 'Vegetariano'];
  foods.forEach((food) => {
    it(`Cadastro com comida ${food}`, () => {
      cy.get('#formNome').type('Usuario');
      cy.get('#formSobrenome').type('Qaulquer');
      cy.get(`[name=formSexo][value=F]`).click();
      cy.xpath(
        `//label[contains(., '${food}')]/preceding-sibling::input`,
      ).click();
      cy.get('#formEscolaridade').select('Superior');
      cy.get('#formEsportes').select('Corrida');
      cy.get('#formCadastrar').click();
      cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!');
    });
  });

  it.only('Deve selecionar todos usando o each', () => {
    cy.get('#formNome').type('Usuario');
    cy.get('#formSobrenome').type('Qaulquer');
    cy.get(`[name=formSexo][value=F]`).click();

    cy.get('[name=formComidaFavorita]').each(($el) => {
      if ($el.val() !== 'vegetariano') cy.wrap($el).click();
    });

    cy.get('#formEscolaridade').select('Superior');
    cy.get('#formEsportes').select('Corrida');
    cy.get('#formCadastrar').click();
    cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!');
    // cy.clickAlert('#formCadastrar', 'Tem certeza que voce eh vegetariano?')
  });
});
