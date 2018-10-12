const testArticleFields = {
  title: {
    value: 'Cypress Test Article'
  },
  body: {
    value: 'Body here'
  }
};
const testCommentFields = {
  subject: 'Cypress test comment subject',
  body: '<p>Cypress test comment body</p>'
};

const seedCommentThroughUi = function(articleNid, fields) {
  cy.visit(`/node/${articleNid}`);
  cy.get('.comment-form input[name="subject[0][value]"]').type(fields.subject);
  cy.window().then(win => {
    win.CKEDITOR.instances['edit-comment-body-0-value'].insertHtml(fields.body);
  });
  cy.get('.comment-form #edit-submit').click();
}

describe('Comment', function() {
  before(function(){
    cy.getRestToken(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword')).then(token => {
      return cy.reseedArticle(token, testArticleFields)
        .as('commentTestArticle');
    }).then(function(){
      seedCommentThroughUi(this.commentTestArticle.data.attributes.nid, testCommentFields);
    });
    cy.dumpDb('comment-seeded');
  });
  it('displays published comments', function(){
    cy.restoreDb('comment-seeded');
    cy.visit(`/node/${this.commentTestArticle.data.attributes.nid}`);
  });
});