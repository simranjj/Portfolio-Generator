`use strict`;

const Joi = require(`joi`);
const {
    convertErrorIntoReadableForm,
    authorization,
} = require(`../utils/common`);
const {AuthorizationToken} = require(`../utils/static-messages`);
const {
    authenticate,
    register,
    _delete,
    update,
    getById,
} = require(`../controllers/users.controller`);

let Routes = [
    {
        method: `POST`,
        path: `/users/authenticate`,
        joiSchema: {
            body: {
                username: Joi.string()
                    .required()
                    .description(`Enter username`)
                    .label(`Username`),
                password: Joi.string()
                    .required()
                    .description(`Enter password`)
                    .label(`Password`),
            },
        },
        auth: false,
        handler: authenticate,
    },

    {
        method: `POST`,
        path: `/users/register`,
        joiSchema: {
            body: {
                name: Joi.string().optional().description(`Enter name`).label(`Name`),
                username: Joi.required()
                    .description(`Enter User Name`)
                    .label(`User Name`),
                email: Joi.string()
                    .email()
                    .required()
                    .description(`Enter email id`)
                    .label(`Email Id`),
                password: Joi.string()
                    .required()
                    .description(`Enter password`)
                    .label(`Password`),
                dob: Joi.date().optional().description(`Enter Birth Date`).label(`DOB`),
                description: Joi.string()
                    .optional()
                    .description(`Enter description`)
                    .label(`Description`),
                skills: Joi.object()
                    .optional()
                    .description("Enter your skills")
                    .label("skills"),
                acedemic_project: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your projects")
                    .label("projects"),
                professional_experience: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your experience")
                    .label("expeirence"),
                achievements: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your achievemnents")
                    .label("achievemnents"),
                certificates: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your certifications")
                    .label("certificates"),
            },
        },
        auth: false,
        handler: register,
    },

    {
        method: `GET`,
        path: `/users/:id`,
        joiSchema: {
            params: {
                id: Joi.string()
                    .required()
                    .description(`Enter user id `)
                    .label(`User id`),
            },
            headers: authorization(AuthorizationToken),
        },
        auth: true,
        handler: getById,
    },

    {
        method: `PUT`,
        path: `/users/:id`,
        joiSchema: {
            params: {
                id: Joi.string()
                    .required()
                    .description(`Enter user id `)
                    .label(`User id`),
            },
            body: {
                name: Joi.string().optional().description(`Enter name`).label(`Name`),
                username: Joi.string()
                    .description(`Enter User Name`)
                    .label(`User Name`),
                email: Joi.string()
                    .email()
                    .description(`Enter email id`)
                    .label(`Email Id`),
                password: Joi.string()
                    .optional()
                    .description(`Enter password`)
                    .label(`Password`),
                dob: Joi.date().optional().description(`Enter Birth Date`).label(`DOB`),
                description: Joi.string()
                    .optional()
                    .description(`Enter description`)
                    .label(`Description`),
                github: Joi.string()
                    .optional()
                    .description(`Enter github url`)
                    .label(`Description`),
                linkedin: Joi.string()
                    .optional()
                    .description(`Enter linkedin url`)
                    .label(`Description`),
                skills: Joi.object()
                    .optional()
                    .description("Enter your skills")
                    .label("skills"),
                acedemic_project: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your projects")
                    .label("projects"),
                professional_experience: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your experience")
                    .label("expeirence"),
                achievements: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your achievemnents")
                    .label("achievemnents"),
                certificates: Joi.array()
                    .items(Joi.object())
                    .optional()
                    .description("Enter your certifications")
                    .label("certificates"),
            },
            headers: authorization(AuthorizationToken),
        },
        auth: true,
        handler: update,
    },

    {
        method: `DELETE`,
        path: `/users/delete/:id`,
        joiSchema: {
            params: {
                id: Joi.string()
                    .required()
                    .description(`Enter user id `)
                    .label(`User id`),
            },
            headers: authorization(AuthorizationToken),
        },
        auth: true,
        handler: _delete,
    },
];

module.exports = Routes;
