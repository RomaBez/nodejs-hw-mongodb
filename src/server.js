import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from './utils/env.js';

import { getAllContacts, getContactById } from './services/students.js';

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

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const contacts = await getContactById(id);

    if (!contacts) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contacts,
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
