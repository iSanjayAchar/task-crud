const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('open', 'inprogress', 'completed'),
        defaultValue: 'open',
    }
});

module.exports = Task;