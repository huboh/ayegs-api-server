import express from 'express';
import * as routes from './routes';
import { DataBase, startServer } from './utils';

const { PORT, DATABASE_HOST } = process.env;

const app = express();
const port = PORT ?? 4000;

const database = new DataBase();

app.use(routes.notFound);
app.use(routes.serverError);

database.connect({
  host: DATABASE_HOST!,
  onClose: () => { console.log('database connection closed'); },
  onError: () => { console.log('database error 😬, closing database...'), database.close(); },
  onOpen: () => startServer(app, port, () => console.log(`server started on port: ${port}`)),
});