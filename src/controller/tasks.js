const express = require("express");
const Tasks = require("../models/tasks");

const router = express.Router();

/** Create Task API */
router.post("/", async (request, response) => {
    try {
        const { body } = request;

        /** Simple Validation */
        if (!body || !body.title) {
            return response.status(400).json({
                statusCode: 400,
                message: "Malformed request. `task` attribute is mandatory"
            });
        }

        await Tasks.create({
            title: body.title,
            status: body.status || "open",
            createdAt: body.created_at || new Date(),
            updatedAt: body.updated_at || new Date(),
        });

        return response.status(201).end();
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        })
    }
});

/** Retrieve All Tasks API with Pagination and Total Count */
router.get("/", async (request, response) => {
    try {
        // Extract query parameters for pagination
        const page = parseInt(request.query.page || 1);
        const pageSize = parseInt(request.query.pageSize || 10); // Default page size is 10

        // Calculate the offset based on the page and page size
        const offset = (page - 1) * pageSize;

        const [tasks, totalCount] = await Promise.all([
            Tasks.findAll({ limit: pageSize, offset: offset }),
            await Tasks.count()
        ]);

        return response.status(200).json({
            tasks: tasks,
            totalCount: totalCount,
        });
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        });
    }
});

/** Retrieve a Single Task by ID API */
router.get("/:taskId", async (request, response) => {
    try {
        const taskId = request.params.taskId;
        const task = await Tasks.findByPk(taskId);

        if (!task) {
            return response.status(404).json({
                statusCode: 404,
                message: "Task not found"
            });
        }

        return response.status(200).json(task);
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        });
    }
});

/** Update Task by ID API */
router.put("/:taskId", async (request, response) => {
    try {
        const taskId = request.params.taskId;
        const { body } = request;

        /** Simple Validation */
        if (!body || !body.title || !body.status) {
            return response.status(400).json({
                statusCode: 400,
                message: "Malformed request. `title` and `status` attributes are mandatory"
            });
        }

        const task = await Tasks.findByPk(taskId);

        if (!task) {
            return response.status(404).json({
                statusCode: 404,
                message: "Task not found"
            });
        }

        await task.update({
            title: body.title,
            status: body.status,
            updated_at: Date.now(),
        });

        return response.status(200).json(task);
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        });
    }
});

/** Delete Task by ID API */
router.delete("/:taskId", async (request, response) => {
    try {
        const taskId = request.params.taskId;
        const task = await Tasks.findByPk(taskId);

        if (!task) {
            return response.status(404).json({
                statusCode: 404,
                message: "Task not found"
            });
        }

        await task.destroy();

        return response.status(200).json({
            statusCode: 200,
            message: "Task deleted successfully"
        });
    } catch (err) {
        return response.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            stackTrace: console.trace(err)
        });
    }
});

module.exports = router;
