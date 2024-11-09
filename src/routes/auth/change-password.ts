// express is the framework we're going to use to handle requests
import express, { Request, Response, Router, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import {
    pool,
    validationFunctions,
    credentialingFunctions,
} from '../../core/utilities';

export interface IUserRequest extends Request {
    id: number;
}

const isStringProvided = validationFunctions.isStringProvided;
const generateSalt = credentialingFunctions.generateSalt;
const generateHash = credentialingFunctions.generateHash;

const changePasswordRouter: Router = express.Router();

const key = {
    secret: process.env.JSON_WEB_TOKEN,
};

const passRegex = /^[a-zA-Z0-9!@#$%^&*_]{8,20}$/;
const isValidPassword = (password: string): boolean =>
    isStringProvided(password) && passRegex.exec(password) !== null;

/**
 * @api {put} /change-password Request to change the password for a given account
 * @apiName PutChangePassword
 * @apiGroup Auth
 *
 * @apiDescription Change the password for a user matching a username and the previous password in which they would like to change.
 *
 * <strong>New password rules</strong>: Passwords must be have a string length between 8 and 20 characters, inclusive. All passwords must start with
 * one letter, followed by between 7 and 19 letters, numbers, and/or special characters in the set of: <code>!, @, #, $, %, ^, &, *</code>. When
 * using your password to login, capitalization matters.

 *
 * @apiBody {string} username The username for the registered user.
 * @apiBody {string} oldPassword The password matching the login credentials for the registered user.
 * @apiBody {string} newPassword A new password to be set for the credentialed user. Must match the format as described in the API description.
 *
 * @apiSuccess {string} message <code>"Successfully changed password for \<username\>!"</code>
 *
 * @apiError (400: Missing Username) {String} message <code>"Missing username - please refer to documentation"</code>
 * @apiError (400: Missing Old Password) {String} message <code>"Missing old password - please refer to documentation"</code>
 * @apiError (400: Invalid New Password) {String} message <code>"New password does not match required format - please refer to documentation"</code>
 * @apiError (400: Invalid Credentials) {String} message <code>"Invalid Credentials"</code>
 *
 * Occurs when either the supplied username does not exist in the dataset or the supplied password does not match the entry in the dataset.
 */
changePasswordRouter.put(
    '/change-password',
    (request: Request, response: Response, next: NextFunction) => {
        if ( isStringProvided(request.body.username) ) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing username - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if ( isStringProvided(request.body.oldPassword) ) {
            next();
        } else {
            response.status(400).send({
                message: 'Missing old password - please refer to documentation',
            });
        }
    },
    (request: Request, response: Response, next: NextFunction) => {
        if ( isValidPassword(request.body.newPassword) ) {
            next();
        } else {
            response.status(400).send({
                message: 'New password does not match required format - please refer to documentation',
            });
        }
    },
    (request: IUserRequest, response: Response, next: NextFunction) => {
        const theQuery = `SELECT salted_hash, salt, Account_Credential.account_id, account.email, account.firstname, account.lastname, account.phone, account.username FROM Account_Credential
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
                    request.body.oldPassword,
                    salt
                );

                //Did our salted hash match their salted hash?
                if (storedSaltedHash === providedSaltedHash) {
                    //credentials match.
                    // NOTE: needs testing
                    request.id = result.rows[0].account_id;
                    next();
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
    },
    (request: IUserRequest, response: Response, next: NextFunction) => {
        // REMOVE OLD PASSWORD
        const theQuery =
            'DELETE FROM Account_Credential WHERE account_id=$1';
        const values = [request.id];
        pool.query(theQuery, values)
            .then(() => {
                console.dir("Successfully deleted old password for user: " + request.body.username);
                next();
            })
            .catch((error) => {
                //log the error
                console.error('Error on DB Query to remove old password.');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    },
    (request: IUserRequest, response: Response) => {
        // ADD NEW PASSWORD
        const salt = generateSalt(32);
        const saltedHash = generateHash(request.body.newPassword, salt);

        const theQuery =
            'INSERT INTO Account_Credential(account_id, salted_hash, salt) VALUES ($1, $2, $3)';
        const values = [request.id, saltedHash, salt];
        pool.query(theQuery, values)
            .then(() => {
                //We successfully changed the password!
                response.status(201).send("Successfully changed password for " + request.body.username + "!");
            })
            .catch((error) => {
                // If this error were to occur, there would not exist an account credential
                // for the user, which would be catastrophic. Probably should be accounted
                // for in this block.
                //log the error
                console.error('Error adding new password for changed password.');
                console.error(error);
                response.status(500).send({
                    message: 'server error - contact support',
                });
            });
    }

);

export { changePasswordRouter };
