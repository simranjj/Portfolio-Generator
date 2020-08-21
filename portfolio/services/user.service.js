`use strict`;

const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

const { getOneDoc, updateData, removeOne } = require("./db-queries.service");

const staticMessage = require("../utils/static-messages");
const { ResponseStatusCode } = require("../utils/constants");
const {
  createJWTToken,
  caseInSensitiveObject,
  convertErrorIntoReadableForm,
} = require("../utils/common");

const User = db.User;

/**
 * Authentication email and password
 * @param email
 * @param password
 * @returns {Promise<{message: *, status: number}|{data: userWithoutHash}>}
 */
async function authenticate({ username, password }) {
  let loginusername = caseInSensitiveObject(username);
  let criteriaForUser = { username: loginusername };
  let errorObject = { status: ResponseStatusCode.BadRequest, message: "" };
  try {
    let user = await User.findOne(criteriaForUser);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const userWithoutHash = user.toObject();
        const token = await createJWTToken(user);

        let dataToUpdate = {
          $push: { token_manager: [token] },
          last_login_at: new Date(),
        };

        await User.findOneAndUpdate(criteriaForUser, dataToUpdate, {
          new: true,
        });

        delete userWithoutHash.password;
        return {
          status: ResponseStatusCode.Success,
          message: staticMessage.LoginSuccessful,
          data: userWithoutHash,
        };
      } else {
        errorObject["message"] = staticMessage.InvalidPassword;
        throw errorObject;
      }
    } else {
      errorObject["message"] = staticMessage.AccountNotFound;
      throw errorObject;
    }
  } catch (error) {
    throw {
      status: ResponseStatusCode.BadRequest,
      message: error.message
    };
  }
}

/**
 * Get user details by user id
 * @param id
 * @returns {Promise<{details: *}>}
 */
async function getById(id) {
  try {
    let criteria = { _id: { $eq: id } },
      projection = { __v: 0, password: 0, token_manager: 0 },
      options = { lean: true };
    let user = await getOneDoc(User, criteria, projection, options);
    if (user)
      return {
        status: ResponseStatusCode.Success,
        data: user,
      };
    else
      return {
        status: ResponseStatusCode.BadRequest,
        message: staticMessage.AccountNotFound,
      };
  } catch (error) {
    throw {
      status: ResponseStatusCode.BadRequest,
      message: staticMessage.OppsSomethingBadHappen,
    };
  }
}

//async function create(userParam, req) {
async function create(body) {
  try {
    const vUsername = await User.findOne({ username: body.username });

    if (vUsername) {
      throw {
        status: ResponseStatusCode.BadRequest,
        message: staticMessage.AlreadyTaken(body.username),
      };
    } else {
      const user = new User(body);

      // // hash password
      if (body.password) {
        user.password = bcrypt.hashSync(body.password, 10);
      }
      // save user
      const result = await user.save();

      const user_id = result._id;
      return {
        status: ResponseStatusCode.Success,
        message: staticMessage.UserCreated(body.name),
        data: { user_id },
      };
    }
  } catch (err) {
    throw {
      status: ResponseStatusCode.BadRequest,
      message: convertErrorIntoReadableForm(err),
    };
  }
}

/**
 * Update user data
 * @param id
 * @param userParam
 * @returns {Promise<*>}
 */
async function update(id, userParam) {
  try {
    let criteria = { _id: id },
      options = { lean: true, new: true },
      dataToUpdate = userParam;

    // hash password
    if (userParam.password) {
      dataToUpdate.password = bcrypt.hashSync(userParam.password, 10);
    }
    let user = await updateData(
      User,
      criteria,
      { $set: dataToUpdate },
      options
    );
    delete user.password;
    delete user.token_manager;
    return {
      status: ResponseStatusCode.Success,
      message: staticMessage.UserUpdated(user.name),
      data: user,
    };
  } catch (err) {
    console.log(err.message);
    throw {
      status: ResponseStatusCode.BadRequest,
      message: staticMessage.ErrorUpdating,
    };
  }
}

async function _delete(id) {
  try {
    let criteria = { _id: { $eq: id } };
    let user = await removeOne(User, criteria, true);
    return {
      status: ResponseStatusCode.Success,
      data: user,
    };
  } catch (error) {
    throw {
      status: ResponseStatusCode.BadRequest,
      message: staticMessage.OppsSomethingBadHappen,
    };
  }
}

module.exports = {
  authenticate,
  getById,
  create,
  update,
  delete: _delete,
};
