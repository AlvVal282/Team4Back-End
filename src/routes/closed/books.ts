// express is the framework we're going to use to handle requests
import express, { Request, Response, Router } from 'express';
import { IJwtRequest } from '../../core/models';

// retrieve the router object from express
const booksRouter : Router = express.Router();

/**
 * @api {get} /title Request book by title
 * @apiName GetBookByTitle
 * @apiGroup Books
 * @apiDescription Retrieve all books that have a specified keyword in its Title.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that match the query
 * @apiSuccess {string} results.name The name of the book
 *
 * @apiError (404: No book with given title) {String} message "No book with given title"
 */
booksRouter.get('/title', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

export { booksRouter };
