// express is the framework we're going to use to handle requests
import express, { Request, Response, Router, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import {
    pool,
    validationFunctions,
    credentialingFunctions,
} from '../../core/utilities';

export interface Auth {
    email: string;
    password: string;
}

export interface AuthRequest extends Request {
    auth: Auth;
}

const isStringProvided = validationFunctions.isStringProvided;
const generateHash = credentialingFunctions.generateHash;

const signinRouter: Router = express.Router();

const key = {
    secret: process.env.JSON_WEB_TOKEN,
};

/**
 * @api {post} /login Request to sign a user in the system
 * @apiName PostLogin
 * @apiGroup Auth
 *
 * @apiBody {string} username The username for the registered user.
 * @apiBody {string} password The password matching the login credentials for the registered user.
 *
 * @apiSuccess {string} accessToken JSON Web Token
 * @apiSuccess {Object} user A user object.
 * @apiSuccess {string} user.email The email address for the user associated with <code>username</code>.
 * @apiSuccess {string} user.firstname The first name for the user associated with <code>username</code>.
 *
 * @apiError (400: Missing Username) {String} message "Missing username - please refer to documentation"
 * @apiError (400: Invalid Password) {String} message "Invalid or missing password - please refer to documentation"
 * @apiError (400: Invalid Credentials) {String} message "Invalid Credentials" when either the
 * supplied email does not exist in the dataset or the supplied password does not match the
 * entry in the dataset
 *
 */
signinRouter.post(
    '/login',
    (request: AuthRequest, response: Response, next: NextFunction) => {
        if ( isStringProvided(request.body.username) ) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing username - please refer to documentation.',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if ( isStringProvided(request.body.password) ) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing password - please refer to documentation.',
            });
        }
    },
        //if (
        //    isStringProvided(request.body.email) &&
        //    isStringProvided(request.body.password)
        //) {
        //    next();
        //} else {
        //    response.status(400).send({
        //        message: 'Missing required information',
        //    });
        //}
    //},
    (request: AuthRequest, response: Response) => {
        const theQuery = `SELECT salted_hash, salt, Account_Credential.account_id, account.email, account.firstname, account.lastname, account.phone, account.username, FROM Account_Credential
                      INNER JOIN Account ON
                      Account_Credential.account_id=Account.account_id 
                      WHERE Account.username=$1`;
        const values = [request.body.username];
        pool.query(theQuery, values)
            .then((result) => {
                if (result.rowCount == 0) {
                    console.error('User not found');
                    response.status(400).send({
                        message: 'Invalid Credentials',
                    });
                    return;
                } else if (result.rowCount > 1) {
                    //log the error
                    console.error(
                        'DB Query error on sign in: too many results returned'
                    );
                    response.status(500).send({
                        message: 'server error - contact support',
                    });
                    return;
                }

                //Retrieve the salt used to create the salted-hash provided from the DB
                const salt = result.rows[0].salt;

                //Retrieve the salted-hash password provided from the DB
                const storedSaltedHash = result.rows[0].salted_hash;

                //Generate a hash based on the stored salt and the provided password
                const providedSaltedHash = generateHash(
                    request.body.password,
                    salt
                );

                //Did our salted hash match their salted hash?
                if (storedSaltedHash === providedSaltedHash) {
                    //credentials match. get a new JWT
                    const accessToken = jwt.sign(
                        {
                            name: result.rows[0].firstname,
                            id: result.rows[0].account_id,
                        },
                        key.secret,
                        {
                            expiresIn: '14 days', // expires in 14 days
                        }
                    );
                    //package and send the results
                    // response.json({
                    //     accessToken,
                    //     id: result.rows[0].account_id,
                    // });
                    response.json({
                        accessToken,
                        user: {
                            email: result.rows[0].email,
                            name: result.rows[0].firstname,
                        },
                    });
                } else {
                    console.error('Credentials did not match');
                    //credentials dod not match
                    response.status(400).send({
                        message: 'Invalid Credentials',
                    });
                }
            })
            .catch((error) => {
                //log the error
                console.error('DB Query error on sign in');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }
);

export { signinRouter };
