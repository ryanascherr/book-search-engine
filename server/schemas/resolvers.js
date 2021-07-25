const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('books');
    },
    books: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Book.find(params);
    },
    book: async (parent, { bookId }) => {
      return Book.findOne({ _id: bookId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  },

  Mutations: {
    addUser: async (parent, { username, email }) => {
      const user = await User.create({ username, email });
      const token = signToken(user);
      return { token, user};
    },
    login: async ({ email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);

        return { token, user };
      }
    },
    // saveBook: {
      
    // },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Thought.findOneAndDelete({
          _id: bookId,
          // thoughtAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { books: book._id } }
        );

        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  }
}

module.exports = resolvers;
