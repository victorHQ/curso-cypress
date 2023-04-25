import loc from './locators';

Cypress.Commands.add('accessMenuAccount', () => {
  cy.get(loc.MENU.SETTINGS).click();
  cy.get(loc.MENU.ACCOUNTS).click();
});

Cypress.Commands.add('insertAccount', (account) => {
  cy.get(loc.ACCOUNTS.NAME).type(account);
  cy.get(loc.ACCOUNTS.BTN_SAVE).click();
});
