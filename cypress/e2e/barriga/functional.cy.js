/// <reference types="cypress" />

import loc from '../../support/locators';
import '../../support/commandsAccount';

describe('Should test at a functional level', () => {
  beforeEach(() => {
    cy.login(Cypress.env('USER'), Cypress.env('PASSWORD'));
    cy.get(loc.MENU.HOME).click();
    cy.resetApp();
  });

  it('Should create an account', () => {
    cy.accessMenuAccount();
    cy.insertAccount('Internet');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.accessMenuAccount();

    cy.xpath(loc.ACCOUNTS.FN_XP_BTN_UPDATE('Conta para alterar')).click();
    cy.get(loc.ACCOUNTS.NAME).clear().type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.accessMenuAccount();
    cy.get(loc.ACCOUNTS.NAME).type('Conta mesmo nome');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it.only('Should create a transaction', () => {
    cy.get(loc.MENU.MOVEMENT).click();
    cy.get(loc.MOVEMENT.DESCRIPTION).type('Desc');
    cy.get(loc.MOVEMENT.VALUE).type('123');
    cy.get(loc.MOVEMENT.INTERESTED).type('Inter');
    cy.get(loc.MOVEMENT.STATUS).click();
    cy.get(loc.MOVEMENT.ACCOUNT).select('Conta para movimentacoes');
    cy.get(loc.MOVEMENT.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.STATEMENT.LINES).should('have.length', 7);
    cy.xpath(loc.STATEMENT.FN_XP_SEARCH_ELEMENT('Desc', 123)).should('exist');
  });

  it('Should get balance', () => {
    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Conta para saldo')).should(
      'contain',
      '534,00',
    );

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(
      loc.STATEMENT.FN_XP_UPDATE_ELEMENT('Movimentacao 1, calculo saldo'),
    ).click();
    cy.get(loc.MOVEMENT.DESCRIPTION).should(
      'have.value',
      'Movimentacao 1, calculo saldo',
    );
    cy.get(loc.MOVEMENT.ACCOUNT).select('Conta para saldo');
    cy.get(loc.MOVEMENT.STATUS).click();
    cy.get(loc.MOVEMENT.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.wait(1000);
    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Conta para saldo')).should(
      'contain',
      '4.034,00',
    );
  });

  it('Should remove a transaction', () => {
    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(
      loc.STATEMENT.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao'),
    ).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');
  });
});
