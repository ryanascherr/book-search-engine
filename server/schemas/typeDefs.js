const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks [Book]
  }

  type Book {
    _id: ID!
    bookId: Int!
    authors: [String!]
    description: String!
    title: String
    image: String
    link: String
  }

  input BookInput {
    _id: ID!
    bookId: Int!
    authors: [String!]
    description: String!
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: User
    books: Book
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String!], description: String!, title: String!, bookId: Int!, image: String!, link: String!): User
    removeBook(bookId: Int!): User
  }
`;

module.exports = typeDefs;
