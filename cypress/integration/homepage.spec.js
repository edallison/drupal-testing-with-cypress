describe('Homepage', function() {
  it('visits homepage', function() {
    cy.visit('/');
    cy.get('.site-branding__name').contains('Cypress Testing');
  });
});