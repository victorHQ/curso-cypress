/// <reference types="cypress" />

import loc from '../../support/locators';
import buildEnv from '../../support/buildEnv';
import '../../support/commandsAccount';

describe('Should test at a frontend level', () => {
  after(() => {
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    buildEnv();
    cy.login(Cypress.env('USER'), Cypress.env('PASSWORD'));
    cy.get(loc.MENU.HOME).click();
    // cy.resetApp();
  });

  it('Should test the responsiveness', () => {
    cy.get('[data-test=menu-home]').should('exist').and('be.visible');
    cy.viewport(500, 700);
    cy.get('[data-test=menu-home]').should('exist').and('not.be.visible');
    cy.viewport('iphone-5');
    cy.get('[data-test=menu-home]').should('exist').and('not.be.visible');
    cy.viewport('ipad-2');
    cy.get('[data-test=menu-home]').should('exist').and('be.visible');
  });

  it('Should create an account', () => {
    cy.intercept('POST', '/contas', {
      id: 3,
      nome: 'Conta de teste',
      visivel: true,
      usuario_id: 1,
    }).as('saveContas');

    cy.accessMenuAccount();

    cy.intercept('GET', '/contas', { fixture: 'accounts.json' }).as(
      'contasSave',
    );

    cy.insertAccount('Internet');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.intercept('PUT', '/contas/**', {
      id: 1,
      nome: 'Conta alterada',
      visivel: true,
      usuario_id: 1,
    });

    cy.accessMenuAccount();

    cy.xpath(loc.ACCOUNTS.FN_XP_BTN_UPDATE('Carteira')).click();
    cy.get(loc.ACCOUNTS.NAME).clear().type('Conta alterada');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an account with same name', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '/contas',
      },
      { error: 'Já existe uma conta com esse nome!', statusCode: 400 },
    ).as('contaMesmoNome');

    cy.accessMenuAccount();
    cy.get(loc.ACCOUNTS.NAME).type('Banco');
    cy.get(loc.ACCOUNTS.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Should create a transaction', () => {
    cy.intercept('POST', '/transacoes', { fixture: 'movement.json' }).as(
      'transacoes',
    );

    cy.intercept('GET', '/extrato/**', { fixture: 'movimentacaoSalva.json' });

    cy.get(loc.MENU.MOVEMENT).click();
    cy.get(loc.MOVEMENT.DESCRIPTION).type('Desc');
    cy.get(loc.MOVEMENT.VALUE).type('123');
    cy.get(loc.MOVEMENT.INTERESTED).type('Inter');
    cy.get(loc.MOVEMENT.STATUS).click();
    cy.get(loc.MOVEMENT.ACCOUNT).select('Banco');
    cy.get(loc.MOVEMENT.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.STATEMENT.LINES).should('have.length', 7);
    cy.xpath(loc.STATEMENT.FN_XP_SEARCH_ELEMENT('Desc', 123)).should('exist');
  });

  it('Should get balance', () => {
    cy.intercept('GET', '/transacoes/**', { fixture: 'movement.json' });

    cy.intercept('PUT', '/transacoes/**', { fixture: 'movement.json' });

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Carteira')).should(
      'contain',
      '100,00',
    );

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(
      loc.STATEMENT.FN_XP_UPDATE_ELEMENT('Movimentacao 1, calculo saldo'),
    ).click();
    cy.get(loc.MOVEMENT.DESCRIPTION).should(
      'have.value',
      'Movimentacao 1, calculo saldo',
    );
    cy.get(loc.MOVEMENT.ACCOUNT).select('Carteira');
    cy.get(loc.MOVEMENT.STATUS).click();
    cy.get(loc.MOVEMENT.BTN_SAVE).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.intercept('GET', '/saldo', [
      {
        conta_id: 999,
        conta: 'Carteira',
        saldo: '4034.00',
      },
      {
        conta_id: 9909,
        conta: 'Banco',
        saldo: '10000.00',
      },
    ]).as('saldoFinal');

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.BALANCE.FN_XP_BALANCE_ACCOUNT('Carteira')).should(
      'contain',
      '4.034,00',
    );
  });

  it('Should remove a transaction', () => {
    cy.intercept('DELETE', '/transacoes/**', { status: 204 }).as(
      'deleteTransacao',
    );

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(
      loc.STATEMENT.FN_XP_REMOVE_ELEMENT('Movimentacao para exclusao'),
    ).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');
  });

  it('Should validate data send to create an account', () => {
    // const reqStub = cy.stub();

    // (req) => {
    //   expect(req.body.nome).to.be.not.empty;
    //   expect(req.headers).to.have.property('Authorization');
    // }
    cy.intercept('POST', '/contas', {
      id: 3,
      nome: 'Conta de teste',
      visivel: true,
      usuario_id: 1,
    }).as('saveConta');

    cy.accessMenuAccount();

    cy.intercept('GET', '/contas', { fixture: 'accounts.json' }).as(
      'contasSave',
    );

    cy.insertAccount('Conta de teste');
    // cy.wait('@saveConta').then(() => {
    //   expect(reqStub.args[0][0].request.body.nome).to.be.empty;
    // });
    cy.wait('@saveConta').its('request.body.nome').should('not.be.empty');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should test colors', () => {
    cy.intercept('GET', '/extrato/**', { fixture: 'paidMovement.json' });

    cy.get(loc.MENU.STATEMENT).click();
    cy.xpath(loc.STATEMENT.FN_XP_LINE('Receita paga')).should(
      'have.class',
      'receitaPaga',
    );
    cy.xpath(loc.STATEMENT.FN_XP_LINE('Receita pendente')).should(
      'have.class',
      'receitaPendente',
    );
    cy.xpath(loc.STATEMENT.FN_XP_LINE('Despesa paga')).should(
      'have.class',
      'despesaPaga',
    );
    cy.xpath(loc.STATEMENT.FN_XP_LINE('Despesa pendente')).should(
      'have.class',
      'despesaPendente',
    );
  });
});
