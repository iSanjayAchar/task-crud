const { Sequelize } = require('sequelize');
// const Tasks = require("./models/tasks");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // SQLite database file location
});

// Synchronize the database
async function initializeDatabase() {
    try {
        await sequelize.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

initializeDatabase();

module.exports = sequelize;