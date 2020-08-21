"use strict";

/** modules **/

const Joi = require("joi");
const {
  SomethingWentWrong,
  BackgroundProcess,
} = require("../utils/static-messages");
const { ResponseStatusCode } = require("../utils/constants");
const { convertErrorIntoReadableForm } = require("./common");
const { authenticationUser } = require("../_helpers/jwt_authentication");

let routeUtils = {};

/**function to create routes with validation in the express.**/
routeUtils.route = async (app, routes = []) => {
  routes.forEach(async (route) => {
    /** set middleware array for each route **/
    let middlewares = [getValidatorMiddleware(route)];
    middlewares = await assignUserAuth(middlewares, route); 

    /** Create api route **/
    app.route(route.path)[route.method.toLowerCase()](
        ...middlewares,
        getHandlerMethod(route.handler)
      );
  });


};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} request
 * @param {*} route
 */
let joiValidatorMethod = async (request, route) => {
  if (
    route.joiSchema.params &&
    Object.keys(route.joiSchema.params).length
  ) {
    request.params = await Joi.validate(
      request.params,
      route.joiSchema.params
    );
  }
  if (
    route.joiSchema.body &&
    Object.keys(route.joiSchema.body).length
  ) {
    request.body = await Joi.validate(
      request.body,
      route.joiSchema.body
    );
  }
  if (
    route.joiSchema.headers &&
    route.joiSchema.headers.authorization &&
    Object.keys(route.joiSchema.headers).length
  ) {
    request.headers = await Joi.validate(
      request.headers,
      route.joiSchema.headers
    );
  }
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route
 */
let getValidatorMiddleware = (route) => {
  return (request, response, next) => {
    joiValidatorMethod(request, route)
      .then((result) => {
        return next();
      })
      .catch((err) => {
        let error = convertErrorIntoReadableForm(err);
        let responseObject = {
          status: ResponseStatusCode.BadRequest,
          message: error.message,
        };
        return response.status(responseObject.status).json(responseObject);
      });
  };
};

/**
 * Get route handler and handle the api response commonly
 * @param {*} handler
 * @param {*} JoiJSON
 */
let getHandlerMethod = (handler) => {
  return async (request, response) => {
      let body = {
        ...(request.body || {}),
        ...(request.params || {}),
      };
      handler(body)
        .then((result) => {
          if (!result) {
            throw {
              status: ResponseStatusCode.BackgroundProcess,
              message: BackgroundProcess,
            };
          }
          response.status(result.status).json(result);
        })
        .catch(async (err) => {
          if (!err.status && !err.code && !err.status) {
            err = {
              status: ResponseStatusCode.BadRequest,
              message: SomethingWentWrong,
            };
          }
          err = await errorObj(err);

          /** Background process end code **/
          if (err.status === ResponseStatusCode.BackgroundProcess) return;
          response.status(err.status).json(err);
        });
  };
};



/**
 * Assign authentication function
 * @param {*} middlewares
 * @param {*} route
 * @returns {Promise<void>}
 */
const assignUserAuth = async (middlewares, route) => {
  if (route.auth) {
    middlewares.push(await authenticationUser());
  }
  return middlewares;
};

/**
 * Error message object
 * @param err
 * @returns {Promise<*>}
 */
const errorObj = async (err) => {
  let errMessage =
    (err || {}).message || (err || {}).errmsg || "Something went wrong!";
  let statusCode = (err || {}).status || 0;
  err = { status: statusCode, message: errMessage };
  return err;
};



module.exports = routeUtils;
