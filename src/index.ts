import express from 'express';
import DataBase from './Database';
import * as routes from './routes';
import middlewares from './middlewares';
import { startServer, injectMiddlewares } from './utils';

const { PORT, DATABASE_HOST } = process.env;

const app = express();
const port = PORT ?? 4000;

const database = new DataBase();

injectMiddlewares(app, middlewares);

app.use('/api', routes.mainRouter);
app.use('/api/products', routes.productRouter);

app.use(routes.notFound);
app.use(routes.serverError);

database.connect({
  host: DATABASE_HOST!,
  onClose: () => { console.log('database connection closed'); },
  onError: () => { console.log('database error 😬, closing database...'), database.close(); },
  onOpen: () => startServer(app, port, () => console.log(`server started on port: ${port}`)),
});