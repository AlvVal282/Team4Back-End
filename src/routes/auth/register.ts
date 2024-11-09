// express is the framework we're going to use to handle requests
import express, { Request, Response, Router, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

const key = {
    secret: process.env.JSON_WEB_TOKEN,
};

import {
    pool,
    validationFunctions,
    credentialingFunctions,
} from '../../core/utilities';

const isStringProvided = validationFunctions.isStringProvided;
const isNumberProvided = validationFunctions.isNumberProvided;
const generateHash = credentialingFunctions.generateHash;
const generateSalt = credentialingFunctions.generateSalt;

const registerRouter: Router = express.Router();

export interface IUserRequest extends Request {
    id: number;
}

const passRegex = /^[a-zA-Z0-9!@#$%^&*_]{8,20}$/;
const isValidPassword = (password: string): boolean =>
    isStringProvided(password) && passRegex.exec(password) !== null;

// Add more/your own phone number validation here. The *rules* must be documented
// and the client-side validation should match these rules.
const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
const isValidPhone = (phone: string): boolean =>
    //isStringProvided(phone) && phone.length >= 10;
    isStringProvided(phone) && phoneRegex.exec(phone) !== null;

// Add more/your own email validation here. The *rules* must be documented
// and the client-side validation should match these rules.
const emailRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9\-$&_,~:!]+\.(com|net|edu|dev|gov|org)$/;
const isValidEmail = (email: string): boolean =>
    //isStringProvided(email) && email.includes('@');
    isStringProvided(email) && emailRegex.exec(email) !== null;

// middleware functions may be defined elsewhere!
const emailMiddlewareCheck = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (isValidEmail(request.body.email)) {
        next();
    } else {
        response.status(400).send({
            message: 'Invalid or missing email - please refer to documentation',
        });
    }
};

/**
 * @api {post} /register Request to register a user
 * 
 * @apiName PostRegister
 * @apiGroup Auth
 *
 * @apiDescription Send a request to the API to register a new account.
 *
 * <strong>Email rules</strong>: Emails must follow the format of <code>a@b.c</code> where <code>a</code> and <code>b</code> is any string of
 * characters of length greater than zero, and <code>c</code> is some TLD matching one of <code>com</code>, <code>net</code>, <code>edu</code>,
 * <code>dev</code>, <code>gov</code>, and <code>org</code>. Emails between accounts must be unique to that account. Note that missing parameters
 * will return a <code>400: Error</code> only for individual missing fields at a time.
 *
 * <strong>Password rules</strong>: Passwords must be have a string length between 8 and 20 characters, inclusive. Passwords may contain any combination
 * of letters, numbers, and/or special characters in the set of: <code>!, @, #, $, %, ^, &, *, _</code>. Passwords are stored in a case-sensitive manner.
 *
 * <strong>Phone Rules</strong>: When passing a phone number string, it must follow the format: <code>###-###-####</code> where <code>#</code>
 * is any number between <code>0-9</code>.
 *
 * @apiBody {string} firstname The registering user's first name. May contain any string characters. Case-sensitive.
 * @apiBody {string} lastname The registering user's last name. May contain any string characters. Case-sensitive.
 * @apiBody {string} email A unique email address for the registering user following common email address conventions. Refer to API description
 * for more detailed formatting instructions.
 * @apiBody {string} password The registering user's password. For a detailed description of formatting rules please read the API description.
 * @apiBody {string} username A unique username for the registering user. May contain any string characters. Case-sensitive.
 * @apiBody {string} phone A phone number for this user. For detailed formatting details please read API description.
 *
 * @apiSuccess (Success 201) {string} accessToken A newly created JWT.
 *
 * @apiError (400: Missing First Name) {String} message <code>"Missing first name - please refer to documentation"</code>
 * @apiError (400: Missing Last Name) {String} message <code>"Missing last name- please refer to documentation"</code>
 * @apiError (400: Missing Username) {String} message <code>"Missing username - please refer to documentation"</code>
 * @apiError (400: Invalid Password) {String} message <code>"Invalid or missing password - please refer to documentation"</code>
 * @apiError (400: Invalid Phone) {String} message <code>"Invalid or missing phone number - please refer to documentation"</code>
 * @apiError (400: Invalid Email) {String} message <code>"Invalid or missing email - please refer to documentation"</code>
 * @apiError (400: Username exists) {String} message <code>"Username exists"</code>
 * @apiError (400: Email exists) {String} message <code>"Email exists"</code>
 *
 */
registerRouter.post(
    '/register',
    emailMiddlewareCheck, // these middleware functions may be defined elsewhere!
    (request: Request, response: Response, next: NextFunction) => {
        if (isStringProvided(request.body.firstname)) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing first name - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if (isStringProvided(request.body.lastname)) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing last name - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if (isStringProvided(request.body.username)) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing username - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if (isValidPhone(request.body.phone)) {
            next();
        } else {
            response.status(400).send({
                message:
                    'Invalid or missing phone number - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if (isValidPassword(request.body.password)) {
            next();
        } else {
            response.status(400).send({
                message:
                    'Invalid or missing password - please refer to documentation',
            });
        }
    },
    (request: IUserRequest, response: Response, next: NextFunction) => {
        const theQuery =
            'INSERT INTO Account(firstname, lastname, username, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING account_id';
        const values = [
            request.body.firstname,
            request.body.lastname,
            request.body.username,
            request.body.email,
            request.body.phone,
        ];
        // console.dir({ ...request.body, password: '******' });
        pool.query(theQuery, values)
            .then((result) => {
                //stash the account_id into the request object to be used in the next function
                // NOTE the TYPE for the Request object in this middleware function
                request.id = result.rows[0].account_id;
                next();
            })
            .catch((error) => {
                //log the error
                // console.log(error)
                if (error.constraint == 'account_username_key') {
                    response.status(400).send({
                        message: 'Username exists',
                    });
                } else if (error.constraint == 'account_email_key') {
                    response.status(400).send({
                        message: 'Email exists',
                    });
                } else {
                    //log the error
                    console.error('DB Query error on register');
                    console.error(error);
                    response.status(500).send({
                        message: 'server error - contact support',
                    });
                }
            });
    },
    (request: IUserRequest, response: Response) => {
        //We're storing salted hashes to make our application more secure
        //If you're interested as to what that is, and why we should use it
        //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
        const salt = generateSalt(32);
        const saltedHash = generateHash(request.body.password, salt);

        const theQuery =
            'INSERT INTO Account_Credential(account_id, salted_hash, salt) VALUES ($1, $2, $3)';
        const values = [request.id, saltedHash, salt];
        pool.query(theQuery, values)
            .then(() => {
                const accessToken = jwt.sign(
                    {
                        name: request.body.firstname,
                        id: request.id,
                    },
                    key.secret,
                    {
                        expiresIn: '14 days', // expires in 14 days
                    }
                );
                console.dir({ ...request.body, password: '******' });
                //We successfully added the user!
                response.status(201).send({
                    accessToken
                });
            })
            .catch((error) => {
                /***********************************************************************
                 * If we get an error inserting the PWD, we should go back and remove
                 * the user from the member table. We don't want a member in that table
                 * without a PWD! That implementation is up to you if you want to add
                 * that step.
                 **********************************************************************/
                // TODO
                // currently not implementing previous comment

                //log the error
                console.error('DB Query error on register');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }
);

registerRouter.get('/hash_demo', (request, response) => {
    const password = 'password12345';

    const salt = generateSalt(32);
    const saltedHash = generateHash(password, salt);
    const unsaltedHash = generateHash(password, '');

    response.status(200).send({
        salt: salt,
        salted_hash: saltedHash,
        unsalted_hash: unsaltedHash,
    });
});

export { registerRouter };
