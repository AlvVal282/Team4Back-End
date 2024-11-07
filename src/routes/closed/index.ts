import express, { Router } from 'express';

import { checkToken } from '../../core/middleware';
import { tokenTestRouter } from './tokenTest';
import { booksRouter } from './books';

const closedRoutes: Router = express.Router();

closedRoutes.use('/jwt_test', checkToken, tokenTestRouter);
// closedRoutes.use('/books', checkToken, booksRouter);
// Delete below line after authentication is implemented
closedRoutes.use('/books', booksRouter);

export { closedRoutes };
