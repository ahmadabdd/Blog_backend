'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        name: "Nader"
      },
      {
        name: "Abdullah"
      },
      {
        name: "Ranim"
      },
      {
        name: "Aya"
      },
      {
        name: "Tala"
      },
      {
        name: "Houssam"
      },
      {
        name: "Dana"
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', {}, null);
  }
};
