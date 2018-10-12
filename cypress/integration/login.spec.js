describe('Login', function() {
  it('logs in via ui', function(){
    cy.visit('/user/login');
    cy.get('#edit-name').type(Cypress.env('cyAdminUser'));
    cy.get('#edit-pass').type(Cypress.env('cyAdminPassword'));
    cy.get('#edit-submit').click();
  });
  it('logs out via ui', function(){
    cy.login(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword'));
    cy.visit('/');
    cy.server();
    cy.route('POST', '/quickedit/*').as('quickEdit');
    cy.wait('@quickEdit');
    cy.get('#block-bartik-account-menu a')
      .contains('Log out')
      .click({force: true}); // This is a workaround due to the admin bar getting in the way. Not a great approach.
  });
});