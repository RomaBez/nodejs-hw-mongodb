import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from './utils/env.js';

import { getAllStudents, getStudentById } from './services/students.js';

export const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.get('/students', async (req, res) => {
    const students = await getAllStudents();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: students,
    });
  });

  app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    const students = await getStudentById(id);

    if (!students) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: students,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: error.message,
    });
  });

  const PORT = Number(env('PORT', 3000));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
