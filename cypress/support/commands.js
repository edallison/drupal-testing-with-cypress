Cypress.Commands.add('createNode', (token, nodeType, fields) => {
  return cy.request({
    method: 'POST',
    url: `/jsonapi/node/${nodeType}`,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': token
    },
    body: {
      data: {
        type: `node--${nodeType}`,
        attributes: fields
      }
    },
  }).its('body');
});

Cypress.Commands.add('deleteNode', (token, nodeType, uuid) => {
  return cy.request({
    method: 'DELETE',
    url: `/jsonapi/node/${nodeType}/${uuid}`,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': token
    },
  }).its('body');
});

Cypress.Commands.add('dumpDb', (fileName) => {
  cy.exec(`drush sql-dump --result-file=./cypress/backups/${fileName}.sql`);
});

Cypress.Commands.add('getNodesWithTitle', (token, nodeType, title) => {
  return cy.request({
    method: 'GET',
    url: `/jsonapi/node/${nodeType}?filter[article-title][path]=title&filter[article-title][value]=${title}&filter[article-title][operator]==`,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': token
    },
  }).then(res => {
    return JSON.parse(res.body).data;
  });
});

Cypress.Commands.add('getRestToken', (user, password) => {
  cy.login(user, password);
  return cy.request({
    method: 'GET',
    url: '/session/token',
  }).its('body');
});

Cypress.Commands.add('login', (user, password) => {
  return cy.request({
    method: 'POST',
    url: '/user/login', 
    form: true,
    body: { 
      name: user,
      pass: password,
      form_id: 'user_login_form' 
    }
  });
});

Cypress.Commands.add('logout', () => {
  return cy.request('/user/logout');
});

Cypress.Commands.add('reseedArticle', (token, fields) => {
  cy.getNodesWithTitle(token, 'article', fields.title.value)
    .then(nodes => {
      nodes.map(function(node){
        cy.deleteNode(token, 'article', node.id);
      });
    });
  return cy.createNode(token, 'article', fields);
});

Cypress.Commands.add('restoreDb', (fileName) => {
  cy.exec(`drush sql-cli < ./cypress/backups/${fileName}.sql`)
});
