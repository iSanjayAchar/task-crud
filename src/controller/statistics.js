const express = require("express");
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const Tasks = require("../models/tasks");

const router = express.Router();

/** Retrieve Statistics */
router.get("/", async (request, response) => {
    try {
        // Calculate the current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
        const currentYear = currentDate.getFullYear();

        // Calculate the start date of the current month
        const currentMonthStartDate = new Date(currentYear, currentMonth - 1, 1);

        // Calculate the end date of the current month
        const currentMonthEndDate = new Date(currentYear, currentMonth, 0);

        // Use Sequelize aggregation to group tasks by month and calculate metrics
        const list = await Tasks.findAll({
            attributes: [
                [Sequelize.fn('strftime', '%Y-%m', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                [Sequelize.literal(`SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END)`), 'open_tasks'],
                [Sequelize.literal(`SUM(CASE WHEN status = 'inprogress' THEN 1 ELSE 0 END)`), 'inprogress_tasks'],
                [Sequelize.literal(`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`), 'completed_tasks'],
            ],
            where: {
                createdAt: {
                    [Op.gte]: currentMonthStartDate,
                    [Op.lte]: currentMonthEndDate,
                },
            },
            group: [Sequelize.fn('strftime', '%Y-%m', Sequelize.col('createdAt'))],
            order: [[Sequelize.col('createdAt'), 'ASC']],
        });

        const formattedList = list.map(row => ({
            date: row.dataValues.month, // Month in "YYYY-MM" format
            metrics: {
                open_tasks: row.dataValues.open_tasks,
                inprogress_tasks: row.dataValues.inprogress_tasks,
                completed_tasks: row.dataValues.completed_tasks,
            },
        }));

        return response.status(200).json(formattedList);
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        })
    }
});

module.exports = router;