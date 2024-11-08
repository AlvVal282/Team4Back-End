// express is the framework we're going to use to handle requests
import express, { NextFunction, Request, Response, Router } from 'express';
import { IJwtRequest } from '../../core/models';
import { pool, validationFunctions } from '../../core/utilities';

// retrieve the router object from express
const booksRouter: Router = express.Router();

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
 * @api {post} /books Request to add a book
 * @apiName AddBook
 * @apiGroup Books
 * @apiDescription Request to add a book to the database.
 *
 * @apiBody {Object} entry the book to be added
 * as a query parameter.
 * @apiBody {number} entry.isbn13 The ISBN number for the book. The ISBN number must
 * be an integer of exactly 13 digits; however, leading zeroes are acceptable, in which
 * case it may be less than 13 digits and interpreted as having leading zeroes.
 * @apiBody {string} entry.author A comma-separated string of authors who have
 * contributed to the book.
 * @apiBody {number} entry.publication The initial publication year of this book. Negative
 * years are not allowed.
 * @apiBody {string} entry.original_title The title of the series this book was
 * printed in. It is acceptable to have <code> original_title </code> omitted, in which
 * case it is a copy of the <code> title </code> field.
 * @apiBody {string} entry.title The title of the book.
 * @apiBody {Object} entry.ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiBody {number} entry.ratings.average The mean value of all 5-star ratings for
 * this book. Must be within the range of 0 to 5 inclusive.
 * @apiBody {number} entry.ratings.count The total number of ratings for this book. Must be
 * positive.
 * @apiBody {number} entry.ratings.rating1 The total number of 1-star ratings for this book.
 * Must be positive.
 * @apiBody {number} entry.ratings.rating2 The total number of 2-star ratings for this book.
 * Must be positive.
 * @apiBody {number} entry.ratings.rating3 The total number of 3-star ratings for this book.
 * Must be positive.
 * @apiBody {number} entry.ratings.rating4 The total number of 4-star ratings for this book.
 * Must be positive.
 * @apiBody {number} entry.ratings.rating5 The total number of 5-star ratings for this book.
 * Must be positive.
 * @apiBody {Object} entry.icons An object holding the urls for the images of this book.
 * @apiBody {string} entry.icons.large The url whose destination matches an image for this book.
 * While not a direct requirement, the dimensions of the image this link leads to should fall
 * within about <code>98x147</code> in pixels.
 * @apiBody {string} entry.icons.small The url whose destination matches an image for this book.
 * While not a direct requirement, the dimensions of the image this link leads to should fall
 * within about <code>50x75</code> in pixels.
 *
 * @apiSuccess (201: Succesfully added) {String} message "Book successfully added."
 *
 * @apiError (400: Book exists) {String} message "Book exists"
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
booksRouter.post(
    '/',
    (request: IJwtRequest, response: Response, next: NextFunction) => {
        const isbn: number = request.body.entry.isbn13 as number;
        const authors: string = request.body.entry.authors as string;
        const publication: number = request.body.entry.publication as number;
        const original_title: string = request.body.entry.original_title as string;
        const title: string = request.body.entry.title as string;
        const rating_avg: number = request.body.entry.ratings.average as number;
        const rating_count: number = request.body.entry.ratings.count as number;
        const rating_1_star: number = request.body.entry.ratings.rating1 as number;
        const rating_2_star: number = request.body.entry.ratings.rating2 as number;
        const rating_3_star: number = request.body.entry.ratings.rating3 as number;
        const rating_4_star: number = request.body.entry.ratings.rating4 as number;
        const rating_5_star: number = request.body.entry.ratings.rating5 as number;
        const image_url: string = request.body.entry.icons.image_url as string;
        const image_small_url: string = request.body.entry.icons
        if (validationFunctions.isNumberProvided(isbn) && isbn >= 0) {
            next();
        } else {
            console.error('Invalid or missing ISBN');
            response.status(400).send({
                message:
                    'Invalid or missing ISBN - please refer to documentation',
            });
        }
    },
    (request: IJwtRequest, response: Response) => {

        const authors = request.body.entry.author.split(", ");
        console.log("AUTHORS DEBUG: " + authors);

        const theQuery =
            'INSERT INTO Books (isbn13, publication_year, original_title, title, rating_avg, rating_count, rating_1_star, rating_2_star, rating_3_star, rating_4_star, rating_5_star, image_url, image_small_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
        const values = [
            request.body.entry.isbn13,
            request.body.entry.publication,
            request.body.entry.original_title,
            request.body.entry.title,
            request.body.entry.ratings.average,
            request.body.entry.ratings.count,
            request.body.entry.ratings.rating1,
            request.body.entry.ratings.rating2,
            request.body.entry.ratings.rating3,
            request.body.entry.ratings.rating4,
            request.body.entry.ratings.rating5,
            request.body.entry.icons.large,
            request.body.entry.icons.small,
        ];

        pool.query(theQuery, values)
        .then((queryRes) => {
            const isbn13 = queryRes.rows[0].isbn13;
    
            let ids = [];
    
            authors.forEach((author) => {
                const theQuery = `
                    INSERT INTO Author (author_name) 
                    VALUES ($1)
                    ON CONFLICT (author_name) DO UPDATE 
                    SET author_name = EXCLUDED.author_name
                    RETURNING author_id;`;
                
                pool.query(theQuery, [author])
                    .then((queryRes) => {
                        const id = queryRes.rows[0].author_id;
                        ids.push(id); 
                        const theQuery = `
                            INSERT INTO books_authors (isbn13, author_id) 
                            VALUES ($1, $2) 
                            ON CONFLICT (isbn13, author_id) DO NOTHING;
                            `;
                        
                        pool.query(theQuery, [isbn13, id])
                            .catch((error) => {
                                console.error('Error inserting into books_authors:', error);
                            })
                    })
                    .catch((error) => {
                        console.error('Error inserting author:', error);
                    })
            });
    
            response.status(201).send({
                message: 'Book and authors inserted successfully',
                isbn13: isbn13,
            });
        })
            .catch((error) => {
                if (
                    error.detail != undefined &&
                    (error.detail as string).endsWith('already exists.')
                ) {
                    console.error('Name exists');
                    response.status(400).send({
                        message: 'Name exists',
                    });
                } else {
                    console.error('DB Query error on POST');
                    console.error(error);
                    response.status(500).send({
                        message: 'server error - contact support',
                    });
                }
            });
    }
);

/**
 * @api {get} /books/isbns/:isbn Request book by ISBN
 * @apiName GetBookByISBN
 * @apiGroup Books
 * @apiDescription Retrieve a book from the database that matches an exact 13-digit
 * ISBN number.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code> 0 <= isbn < 10^13</code>. While 13 digits are strictly required, values
 * less than <code> 10^12 </code> are interpreted as having leading zeros.
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
booksRouter.get('/isbns/:isbn', (request: IJwtRequest, response: Response) => {
    const theQuery = 'SELECT * FROM Books WHERE isbn13 = $1';
    const values = [request.params.isbn];

    pool.query(theQuery, values)
        .then((result) => {
            if (result.rowCount == 1) {
                response.send({
                    entry: result.rows[0],
                });
            } else {
                response.status(404).send({
                    message: 'isbn not found',
                });
            }
        })
        .catch((error) => {
            //log the error
            console.error('DB Query error on GET /isbns/:isbn');
            console.error(error);
            response.status(500).send({
                message: 'server error - contact support',
            });
        });
});

/**
 * @api {delete} /books/isbns/:isbn Delete book by ISBN
 * @apiName DeleteBookByISBN
 * @apiGroup Books
 * @apiDescription Delete a book from the database that matches an exact 13-digit
 * ISBN number.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code> 0 <= isbn < 10^13</code>. While 13 digits are strictly required, values
 * less than <code> 10^12 </code> are interpreted as having leading zeros.
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
booksRouter.delete(
    '/isbns/:isbn',
    (request: IJwtRequest, response: Response) => {
        const theQuery = 'DELETE FROM Books WHERE isbn13 = $1 RETURNING *';
        const values = [request.params.isbn];
        console.log(values);

        pool.query(theQuery, values)
            .then((result) => {
                if (result.rowCount >= 1) {
                    response.send({
                        entry: result.rows,
                    });
                } else {
                    response.status(404).send({
                        message: 'isbn not found',
                    });
                }
            })
            .catch((error) => {
                //log the error
                console.error('DB Query error on DELETE /isbns/:isbn');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }
);

/**
 * @api {get} /books/rating Request book by rating
 * @apiName GetBookByRating
 * @apiGroup Books
 * @apiDescription Retrieve all books whose mean rating falls within the interval
 * of two values as defined in the HTTP request body: <code> min <= book.ratings.average
 * <= max </code>. The order of returned books are also determined by their average
 * rating. Whether it is ordered by min-first or max-first is also determined by the body.
 * Note that the min - or lower-bound - must be less than or equal to the max - upper-bound.
 *
 * @apiBody {number} min The lower-bound of all average ratings for each book
 * this route returns.
 * @apiBody {number} max The upper-bound of all average ratings for each book
 * this route returns.
 * @apiBody {string} order The ordering of the returned books. The only two allowed
 * strings are: <code> "min-first" </code> or <code> "max-first" </code>.
 *
 * @apiSuccess {Object[]} results An aggregate of all books that fall within the
 * average rating interval.
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
 * @apiError (404: No books with given average rating interval) {String} message "No books fall within the interval requested"
 * @apiError (400: Lower-bound greater than upper-bound) {String} message "The lower bound for the interval is greater than the upper bound - please refer to documentation"
 * @apiError (400: Missing lower-bound) {String} message "Missing lower-bound parameter - please refer to documentation"
 * @apiError (400: Missing upper-bound) {String} message "Missing upper-bound parameter - please refer to documentation"
 * @apiError (400: Missing ordering field in body) {String} message "Missing ordering field in http body - please refer to documentation"
 */
booksRouter.get(
    '/rating',
    (request: IJwtRequest, response: Response, next: NextFunction) => {
        const min: number = request.body.min as number;
        const max: number = request.body.max as number;
        const order: string = request.body.order as string;
        if (validationFunctions.isNumberProvided(min) && min > 0 && max > min) {
            next();
        } else {
            console.error('Invalid or missing range');
            response.status(400).send({
                message:
                    'Invalid or missing range - please refer to documentation',
            });
        }
    },
    (request: IJwtRequest, response: Response) => {
        const min: number = request.body.min as number;
        const max: number = request.body.max as number;
        const order: string = request.body.order as string;
        const orderBy =
            order == 'min-first' ? 'rating_avg ASC' : 'rating_avg DESC';
        const theQuery = `SELECT * FROM Books WHERE rating_avg >= $1 AND rating_avg <= $2 ORDER BY ${orderBy}`;
        const values = [min, max];

        pool.query(theQuery, values)
            .then((result) => {
                response.status(201).send({
                    entry: result.rows,
                });
            })
            .catch((error) => {
                if (
                    error.detail != undefined &&
                    (error.detail as string).endsWith('already exists.')
                ) {
                    console.error('Name exists');
                    response.status(400).send({
                        message: 'Name exists',
                    });
                } else {
                    console.error('DB Query error on GET');
                    console.error(error);
                    response.status(500).send({
                        message: 'server error - contact support',
                    });
                }
            });
    }
);

/**
 * @api {put} /books/rating/:isbn/ Update book ratings
 * @apiName UpdateBookRating
 * @apiGroup Books
 * @apiDescription Update the rating object for a specific book in the database.
 *
 * @apiParam {number} isbn A 13-digit ISBN integer. Must be within the range of
 * <code>10^12 <= isbn < 10^13</code>
 *
 * @apiBody {Object} ratings An object representing all the information for
 * consumer and critic ratings for the given book.
 * @apiBody {float} ratings.average The mean value of all 5 star ratings for this
 * book. The value should be between 0 and 5 inclusive.
 * @apiBody {number} ratings.count The total number of ratings for this book. Must be
 * positive.
 * @apiBody{number} ratings.rating1 The total number of 1-star ratings for this book.
 * Must by positive.
 * @apiBody {number} ratings.rating2 The total number of 2-star ratings for this book.
 * Must by positive.
 * @apiBody {number} ratings.rating3 The total number of 3-star ratings for this book.
 * Must by positive.
 * @apiBody {number} ratings.rating4 The total number of 4-star ratings for this book.
 * Must by positive.
 * @apiBody {number} ratings.rating5 The total number of 5-star ratings for this book.
 * Must by positive.
 *
 * @apiSuccess {Object} result The book whose ratings are being updated.
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
 * @apiSuccess {float} result.ratings.average The mean value of all 5-star ratings for
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
 * @apiError (400: Empty query parameter) {String} message "No query parameter in url"
 * @apiError (400: Invalid rating average) {String} message "Rating average is not in range of 0 to 5 inclusive - please refer to documentation"
 * @apiError (400: Invalid rating count) {String} message "Rating count must be positive - please refer to documentation"
 */
booksRouter.put('/rating/:isbn', 
    (request: IJwtRequest, response: Response, next: NextFunction) => {
        const ratings = request.body.ratings;
        const rating_avg: number = request.body.ratings.average as number;
        const rating_count: number = request.body.ratings.count as number;
        const rating_1_star: number = request.body.ratings.rating1 as number;
        const rating_2_star: number = request.body.ratings.rating2 as number;
        const rating_3_star: number = request.body.ratings.rating3 as number;
        const rating_4_star: number = request.body.ratings.rating4 as number;
        const rating_5_star: number = request.body.ratings.rating5 as number;
        
        if (validationFunctions.isNumberProvided(rating_avg) && rating_count >= 0) {
            next();
        } else {
            console.error('Invalid or missing range');
            response.status(400).send({
                message:
                    'Invalid or missing range - please refer to documentation',
            });
        }
    },
    (request: IJwtRequest, response: Response) => {
        const theQuery = `
            UPDATE Books SET 
                rating_avg = $1, 
                rating_count = $2,
                rating_1_star = $3,
                rating_2_star = $4,
                rating_3_star = $5,
                rating_4_star = $6,
                rating_5_star = $7
            WHERE isbn13 = $8
            RETURNING *`;
        const values = [
            request.body.ratings.average,
            request.body.ratings.count,
            request.body.ratings.rating1,
            request.body.ratings.rating2,
            request.body.ratings.rating3,
            request.body.ratings.rating4,
            request.body.ratings.rating5,
            request.params.isbn,
        ];

        pool.query(theQuery, values)
            .then((result) => {
                response.status(201).send({
                    entry: result.rows,
                });
            })
            .catch((error) => {
                if (
                    error.detail != undefined &&
                    (error.detail as string).endsWith('already exists.')
                ) {
                    console.error('Name exists');
                    response.status(400).send({
                        message: 'Name exists',
                    });
                } else {
                    console.error('DB Query error on GET');
                    console.error(error);
                    response.status(500).send({
                        message: 'server error - contact support',
                    });
                }
            });
    }
);

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
    const theQuery = 'SELECT * FROM Books WHERE title = $1';
    const values = [request.params.name];

    pool.query(theQuery, values)
        .then((result) => {
            if (result.rowCount >= 1) {
                response.send({
                    entry: result.rows,
                });
            } else {
                response.status(404).send({
                    message: 'Title not found',
                });
            }
        })
        .catch((error) => {
            //log the error
            console.error('DB Query error on GET /title/:name');
            console.error(error);
            response.status(500).send({
                message: 'server error - contact support',
            });
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
booksRouter.delete(
    '/title/:name',
    (request: IJwtRequest, response: Response) => {
        const theQuery = 'DELETE FROM Books WHERE title = $1 RETURNING *';
        const values = [request.params.name];
        console.log(values);

        pool.query(theQuery, values)
            .then((result) => {
                if (result.rowCount >= 1) {
                    response.send({
                        entry: result.rows,
                    });
                } else {
                    response.status(404).send({
                        message: 'title not found',
                    });
                }
            })
            .catch((error) => {
                //log the error
                console.error('DB Query error on DELETE /title/:name');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }
);

/**
 * @api {get} /books/author/:name Request books by author
 * @apiName GetBooksByAuthor
 * @apiGroup Books
 * @apiDescription Retrieve all books that were written by a specified author. If
 * multiple books are returned by this query, it returns them in alphabetical order.
 *
 * @apiParam {string} name An author's name to query the database. The database is
 * queried exactly in the form of <code> Firstname Lastname </code>. While not case-sensitive,
 * only exact matches for first and last are returned.
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
booksRouter.get('/author/:name', (request: IJwtRequest, response: Response) => {
    const theQuery = `
        SELECT b.isbn13, b.title, b.original_title, b.publication_year, 
               b.rating_avg, b.rating_count, b.image_url 
        FROM Books b 
        JOIN Books_Authors ba ON b.isbn13 = ba.isbn13 
        JOIN Author a ON ba.Author_ID = a.Author_ID 
        WHERE a.Author_Name = $1;
    `;
    const values = [request.params.name];

    pool.query(theQuery, values)
        .then((result) => {
            if (result.rowCount >= 1) {
                response.send({
                    entry: result.rows,
                });
            } else {
                response.status(404).send({
                    message: 'Author not found',
                });
            }
        })
        .catch((error) => {
            //log the error
            console.error('DB Query error on GET /author/:name');
            console.error(error);
            response.status(500).send({
                message: 'server error - contact support',
            });
        });
});

/**
 * @api {delete} /books/author/:name Delete books by author
 * @apiName DeleteBooksByAuthor
 * @apiGroup Books
 * @apiDescription Delete all books that a specified author contributed to.
 *
 * @apiParam {string} name An author's name to query the database. The database is
 * queried exactly in the form of <code> Firstname Lastname </code>. While not case-sensitive,
 * only exact matches for first and last are deleted.
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
booksRouter.delete(
    '/author/:name',
    (request: IJwtRequest, response: Response) => {
        const theQuery =
            'DELETE FROM Author WHERE Author_name = $1 RETURNING *';
        const values = [request.params.name];
        console.log(values);

        pool.query(theQuery, values)
            .then((result) => {
                if (result.rowCount >= 1) {
                    response.send({
                        entry: result.rows,
                    });
                } else {
                    response.status(404).send({
                        message: 'Authors not found',
                    });
                }
            })
            .catch((error) => {
                //log the error
                console.error('DB Query error on DELETE /author/:name');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }
);

export { booksRouter };
