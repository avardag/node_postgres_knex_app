const Sequelize = require('sequelize');
const db = require("../config/databaseConfigs");

//Define a model
const Gig = db.define('gig', {
  // attributes
  title: {
    type: Sequelize.STRING
    // allowNull: false
  },
  technologies: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  budget: {
    type: Sequelize.STRING
  },
  contact_email: {
    type: Sequelize.STRING
  },
  // createdAt: {
  //   field: 'createdat',
  //    type: Sequelize.DATE,
  //    defaultValue: Sequelize.NOW 
  // },
  // updatedAt: {
  //   field: 'updatedat',
  //    type: Sequelize.DATE,
  //    defaultValue: Sequelize.NOW 
  // },
}, {
  // options
  // tableName: 'gigs'
  // timestamps: false // not to use timestamps, if not exist in table
  createdAt: 'createdat', // timestamps in my table defined with lowercase
  updatedAt: 'updatedat'
});

module.exports = Gig;