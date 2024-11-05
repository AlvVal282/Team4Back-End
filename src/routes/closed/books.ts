// express is the framework we're going to use to handle requests
import express, { Request, Response, Router } from 'express';
import { IJwtRequest } from '../../core/models';

// retrieve the router object from express
const booksRouter : Router = express.Router();

/*
interface: IRatings {
    average: number;
    count: number;
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
}

interface: IUrlIcon {
    large: string;
    small: string;
}

interface: IBook {
    isbn13: number;
    authors: string;
    publication: number;
    original_title: string;
    title: string;
    ratings: IRatings;
    icons: IUrlIcon;
}
*/

/**
 * @api {get} /books Request to retrieve all books
 * @apiName GetBooks
 * @apiGroup Books
 * @apiDescription Retrieve all books from the database.
 *
 *
 * @apiSuccess {Object[]} results An aggregate of all books.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (400: No books) {String} message "No books found"
 */
booksRouter.get('/', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {post} /books Request to add a book
 * @apiName PostBooks
 * @apiGroup Books
 * @apiDescription Request to add a book to the database.
 *
 * @apiBody {number} ISBN The books isbn
 * @apiBody {string} Authors The author(s) of the book
 * @apiBody {number} Publication The books publication date
 * @apiBody {string} OriginalTitle The books original title
 * @apiBody {string} Title The books title
 * @apiBody {number} Rating The books rating
 * @apiBody {string} Image The books image url
 * @apiBody {string} SmallImage The books small image url
 *
 * @apiSuccess {Object[]} results An aggregate of all books.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (400: Book exists) {String} message "Book exists"
 * @apiError (400: Missing Parameters) {String} message "Missing required information - please refer to documentation"
 * @apiError (400: Missing Parameters) {String} message "Missing required information - please refer to documentation"
 * @apiError (400: Invalid ISBN) {String} message "Invalid or missing ISBN - please refer to documentation"
 * @apiError (400: Invalid Authors) {String} message "Invalid or missing Authors - please refer to documentation"
 * @apiError (400: Invalid Publication) {String} message "Invalid or missing Publication - please refer to documentation"
 * @apiError (400: Invalid Original Title) {String} message "Invalid or missing Original Title - please refer to documentation"
 * @apiError (400: Invalid Title) {String} message "Invalid or missing Title - please refer to documentation"
 * @apiError (400: Invalid Rating) {String} message "Invalid or missing Rating - please refer to documentation"
 * @apiError (400: Invalid Image Url) {String} message "Invalid or missing Image Url - please refer to documentation"
 * @apiError (400: Invalid Image Small Url) {String} message "Invalid or missing Image Small Url - please refer to documentation"
 */
booksRouter.post('/', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});


/**
 * @api {get} /books/:isbn Request book by ISBN
 * @apiName GetBookByISBN
 * @apiGroup Books
 * @apiDescription Retrieve a book from the database that matches an exact 13-digit
 * ISBN number.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code>10^12 <= isbn < 10^13</code>
 *
 * @apiSuccess {Object} result The book that matches the exact ISBN number provided 
 * as a query parameter.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given ISBN) {String} message "No book with given ISBN"
 * @apiError (400: Query parameter wrong type) {String} message "Query parameter not of required type - please refer to documentation"
 * @apiError (400: ISBN not in range) {String} message "ISBN not in range - please refer to documentation"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.get('/:isbn', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {delete} /books/:isbn Delete book by ISBN
 * @apiName DeleteBookByISBN
 * @apiGroup Books
 * @apiDescription Delete a book from the database that matches an exact 13-digit
 * ISBN number.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code>10^12 <= isbn < 10^13</code>
 *
 * @apiSuccess {Object} result The book that matches the exact ISBN number provided 
 * as a query parameter.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given ISBN) {String} message "No book with given ISBN"
 * @apiError (400: Query parameter wrong type) {String} message "Query parameter not of required type - please refer to documentation"
 * @apiError (400: ISBN not in range) {String} message "ISBN not in range - please refer to documentation"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.delete('/:isbn', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});


/**
 * @api {get} /books/:rating Request book by rating
 * @apiName GetBookByRating
 * @apiGroup Books
 * @apiDescription Retrieve a book from the database that reach a minimum rating
 * threshold. If multiple books are returned by this query, it returns them in 
 * alphabetical order.
 *
 * @apiParam {float} rating A rating float. Must be within the range of
 * <code> 1 <= 5 </code>
 *
 * @apiSuccess {Object[]} results An aggregate of all books that reach the minimum
 * rating.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given ISBN) {String} message "No book with given ISBN"
 * @apiError (400: Query parameter wrong type) {String} message "Query parameter not of required type - please refer to documentation"
 * @apiError (400: Rating not in range) {String} message "Rating not in range - please refer to documentation"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.get('/:rating', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {delete} /books/:isbn/:rating Delete a book rating
 * @apiName DeleteABookRating
 * @apiGroup Books
 * @apiDescription Delete a book rating from the database.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code>10^12 <= isbn < 10^13</code>
 * @apiParam {float} rating A rating float. Must be within the range of
 * <code> 1 <= 5 </code>
 *
 * @apiSuccess {Object[]} results An aggregate of all books that reach the minimum
 * rating.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given ISBN) {String} message "No book with given ISBN"
 * @apiError (400: Query parameter wrong type) {String} message "Query parameter not of required type - please refer to documentation"
 * @apiError (400: Rating not in range) {String} message "Rating not in range - please refer to documentation"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.delete('/:isbn/rating', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {post} /books/:isbn/:rating Request to post a book rating
 * @apiName PostABookRating
 * @apiGroup Books
 * @apiDescription Request to post a book rating to the database.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code>10^12 <= isbn < 10^13</code>
 * @apiParam {float} rating A rating float. Must be within the range of
 * <code> 1 <= 5 </code>
 *
 * @apiSuccess {Object[]} results An aggregate of all books that reach the minimum
 * rating.
 * @apiSuccess {number} result.isbn13 The ISBN number for the book.
 * @apiSuccess {string} result.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} result.publication The initial publication date of this book.
 * @apiSuccess {string} result.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} result.title The title of the book.
 * @apiSuccess {Object} result.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} result.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} result.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} result.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} result.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} result.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} result.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} result.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given ISBN) {String} message "No book with given ISBN"
 * @apiError (400: Query parameter wrong type) {String} message "Query parameter not of required type - please refer to documentation"
 * @apiError (400: Rating not in range) {String} message "Rating not in range - please refer to documentation"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 * @apiError (400: Invalid Rating) {number} message "Invalid or missing Rating - please refer to documentation"
 */
booksRouter.post('/:isbn/rating', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});


/**
 * @api {get} /books/title/:name Request books by title
 * @apiName GetBooksByTitle
 * @apiGroup Books
 * @apiDescription Retrieve all books that contain a specified string in its title. If
 * multiple books are returned by this query, it returns them in alphabetical order.
 *
 * @apiParam {string} name A keyword to query all book titles.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that match the query.
 * @apiSuccess {number} results.isbn13 The ISBN number for the book.
 * @apiSuccess {string} results.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} results.publication The initial publication date of this book.
 * @apiSuccess {string} results.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} results.title The title of the book.
 * @apiSuccess {Object} results.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} results.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} results.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} results.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} results.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} results.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} results.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given title) {String} message "No book with given title"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.get('/title/:name', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {delete} /books/title/:name Delete books by title
 * @apiName DeleteBooksByTitle
 * @apiGroup Books
 * @apiDescription Delete all books that contain a specified string in its title.
 *
 * @apiParam {string} name A keyword to query all book titles.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that match the query
 * and were deleted.
 * @apiSuccess {number} results.isbn13 The ISBN number for the book.
 * @apiSuccess {string} results.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} results.publication The initial publication date of this book.
 * @apiSuccess {string} results.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} results.title The title of the book.
 * @apiSuccess {Object} results.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} results.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} results.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} results.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} results.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} results.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} results.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given title) {String} message "No book with given title"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.delete('/title/:name', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});


/**
 * @api {get} /books/:author Request books by author
 * @apiName GetBooksByAuthor
 * @apiGroup Books
 * @apiDescription Retrieve all books that were written by a specified author. If
 * multiple books are returned by this query, it returns them in alphabetical order.
 *
 * @apiParam {string} author A author to query all books.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that match the query.
 * @apiSuccess {number} results.isbn13 The ISBN number for the book.
 * @apiSuccess {string} results.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} results.publication The initial publication date of this book.
 * @apiSuccess {string} results.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} results.title The title of the book.
 * @apiSuccess {Object} results.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} results.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} results.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} results.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} results.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} results.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} results.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given title) {String} message "No book with given author"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.get('/:author', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});

/**
 * @api {delete} /books/:author Delete books by author
 * @apiName DeleteBooksByAuthor
 * @apiGroup Books
 * @apiDescription Delete all books that were written by a specified author.
 *
 * @apiParam {string} author A author to query all books.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that match the query.
 * @apiSuccess {number} results.isbn13 The ISBN number for the book.
 * @apiSuccess {string} results.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiSuccess {number} results.publication The initial publication date of this book.
 * @apiSuccess {string} results.original_title The title of the series this book was
 * printed in. If not in a series, it is a copy of the title attribute. Note that you
 * cannot consisently rely upon <code>original_title</code> to be applied applicably to
 * serial publications.
 * @apiSuccess {string} results.title The title of the book.
 * @apiSuccess {Object} results.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiSuccess {number} results.ratings.average The mean value of all 5-star ratings for
 * this book.
 * @apiSuccess {number} results.ratings.count The total number of ratings for this book.
 * @apiSuccess {number} results.ratings.rating1 The total number of 1-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating2 The total number of 2-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating3 The total number of 3-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating4 The total number of 4-star ratings for this book.
 * @apiSuccess {number} results.ratings.rating5 The total number of 5-star ratings for this book.
 * @apiSuccess {Object} results.icons An object holding the urls for the images of this book.
 * @apiSuccess {string} results.icons.large The url whose destination matches an
 * image for this book. On average, image sizes fall within about <code>98x147</code>
 * in pixels.
 * @apiSuccess {string} results.icons.small The url whose destination matches the
 * image for this book. On average, image sizes fall within about <code>50x75</code>
 *
 * @apiError (404: No book with given title) {String} message "No book with given author"
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 */
booksRouter.delete('/:author', (request: IJwtRequest, response: Response) => {
    response.status(500).send({
        message:
            'Route not currently implemented. Please complain to developers.',
    });
});




export { booksRouter };
