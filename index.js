require("./src/db");

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

/** Route file */
const TaskRouter = require("./src/controller/tasks");
const TaskStatsRouter = require("./src/controller/statistics");

app.use("/task", TaskRouter);
app.use("/task-stats", TaskStatsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});