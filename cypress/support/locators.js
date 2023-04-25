const locators = {
  LOGIN: {
    USER: '[data-test=email]',
    PASSWORD: '[data-test=passwd]',
    BTN_LOGIN: '.btn',
  },
  MENU: {
    HOME: '[data-test=menu-home]',
    SETTINGS: '[data-test=menu-settings]',
    ACCOUNTS: '[href="/contas"]',
    RESET: '[href="/reset"]',
    MOVEMENT: '[data-test=menu-movimentacao]',
    STATEMENT: '[data-test=menu-extrato]',
  },
  ACCOUNTS: {
    NAME: '[data-test=nome]',
    BTN_SAVE: '.btn',
    FN_XP_BTN_UPDATE: (name) =>
      `//table//td[contains(., '${name}')]/..//i[@class='far fa-edit']`,
  },
  MOVEMENT: {
    DESCRIPTION: '[data-test=descricao]',
    VALUE: '[data-test=valor]',
    INTERESTED: '[data-test=envolvido]',
    STATUS: '[data-test=status]',
    ACCOUNT: '[data-test=conta]',
    BTN_SAVE: '.btn-primary',
  },
  STATEMENT: {
    LINES: '.list-group > li',
    FN_XP_SEARCH_ELEMENT: (desc, value) =>
      `//span[contains(.,'${desc}')]/following-sibling::small[contains(.,${value})]`,
    FN_XP_REMOVE_ELEMENT: (desc) =>
      `//span[contains(.,'${desc}')]/../../..//i[@class='far fa-trash-alt']`,
    FN_XP_UPDATE_ELEMENT: (account) =>
      `//span[contains(.,'${account}')]/../../..//i[@class='fas fa-edit']`,
    FN_XP_LINE: (desc) => `//span[contains(.,'${desc}')]/../../../..`,
  },
  BALANCE: {
    FN_XP_BALANCE_ACCOUNT: (name) => `//td[contains(., '${name}')]/../td[2]`,
  },
  MESSAGE: '.toast-message',
};

export default locators;
