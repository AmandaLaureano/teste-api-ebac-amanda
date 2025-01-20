/// <reference types="cypress" />

const { beforeEach } = require("mocha")
import contrato from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Usuários', () => {
  let token 
  beforeEach(() => {
    cy.token('marianotesteebac@gmail.com.br', 'teste5').then(tkn => { 
      token = tkn 
    })
  })

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  })

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })    
  })

  it('Deve cadastrar um usuário com sucesso', () => {
     cy.cadastrarUsuario(token, 'João da Silva', 'joaosilva@ebac.com.br', 'testejoao', 'true')
     .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  })

  it('Deve encontrar usuário na busca com o id referente', () => {
    cy.request({
      method: 'GET',
      url: `usuarios/${'KciJbaI9FfQQavwl'}`
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('nome', 'João da Silva')
    })    
  })

  it('Deve disparar mensagem de erro ao encontrar usuário procurado com o id referente', () => {
    cy.request({
      method: 'GET',
      url: `usuarios/${'testetesteteste'}`,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal('Usuário não encontrado')
    })    
  })

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request({
      method: 'PUT',
      url: `usuarios/${'KciJbaI9FfQQavwl'}`,
      headers: {authorization: token},
      body: {
        "nome": "João da Silva",
        "email": "beltranosilva@qa.com.br",
        "password": "teste4",
        "administrador": "false"
      }
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body.message).equal('Registro alterado com sucesso')
    }) 
  })

  it('Deve realizar cadastro de usuário caso não seja localizado o usuário com o id informado', () => {
    cy.request({
      method: 'PUT',
      url: `usuarios/${'KciJbaI9FfQQavwlllf'}`,
      headers: {authorization: token},
      body: {
        "nome": "João da Silva Marcondes",
        "email": "joaosilvamarcond22@qa.com.br",
        "password": "teste4",
        "administrador": "false"
      }
    }).should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    }) 
  })

  it('Deve disparar mensagem de erro a editar usuário com um e-mail já em uso', () => {
    cy.request({
      method: 'PUT',
      url: `usuarios/${'KciJbaI9FfQQavwlllf'}`,
      headers: {authorization: token},
      body: {
        "nome": "João da Silva Marcondes",
        "email": "joaosilvamarcond22@qa.com.br",
        "password": "teste4",
        "administrador": "false"
      }
    }).should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    }) 
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario(token, 'Joana da Silva', 'joanaasilvaebac@gmail.com', 'testejoana', 'false')
    .then(response => {
      let id = response.body._id
      cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: {authorization: token} 
      }).should(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
      })
    })
  })

  it('Deve emitir mensagem de erro ao excluir usuário com carrinho', () => {
    cy.request({
      method: 'DELETE',
      url: `usuarios/${'0uxuPY0cbmQhpEz1'}`,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal('Não é permitido excluir usuário com carrinho cadastrado')
    })    
  })

})
