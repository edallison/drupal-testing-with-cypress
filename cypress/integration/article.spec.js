const testArticleFields = {
  title: {
    value: 'Cypress Test Article'
  },
  body: {
    value: 'Body here'
  }
};



describe('Article', function() {
  before(function(){
    cy.getRestToken(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword')).then(token => {
      return cy.reseedArticle(token, testArticleFields)
        .as('testArticle');
    });
    cy.logout();
  });
  it('displays published articles', function(){
    cy.visit(`/node/${this.testArticle.data.attributes.nid}`);
    cy.get('h1').contains(testArticleFields.title.value);
    cy.get('.field--name-body').contains(testArticleFields.body.value);
  });
});