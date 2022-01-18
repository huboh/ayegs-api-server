import { json, urlencoded } from 'express';

const jsonParserMiddleware = json({});
const urlBodyParserMiddleware = urlencoded({ extended: true });

export default [
  jsonParserMiddleware,
  urlBodyParserMiddleware,
];