const User = require("../models/userModel");
const errorHandler = require("../errors/errorHandler");
const pushToQ = require("../queue/pushToQueueHandler");
const { token, refreshToken } = require("../helpers/token");
const bcrypt = require("bcrypt");
const { log } = require("../modules/logModule");

const saltValue = 12;
const tokenDuration = "3h";
const refreshTokenDuration = "30d";

const findAll = async (request, reply) => {
  try {
    const findAllUsers = await User.find();
    if (!findAllUsers) {
      return await errorHandler(404, "users-not-found", true, request, reply);
    }

    await reply.code(200).send({
      success: true,
      data: findAllUsers,
    });
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const findOne = async (request, reply) => {
  try {
    const { id } = request.params;
    const findOneUser = await User.findById(id);

    if (!findOneUser) {
      return await errorHandler(404, "user-not-found", true, request, reply);
    }
    await reply.code(200).send({
      success: true,
      data: findOneUser,
    });
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const createUser = async (request, reply) => {
  try {
    const findUser = await User.findOne({ email: request.body.email });

    if (findUser) {
      return await errorHandler(406, "email-in-use", true, request, reply);
    } else {
      const createdUser = await User.create({
        ...request.body,
        password: await bcrypt.hash(request.body.password, saltValue),
      });

      if (!createdUser) {
        return await errorHandler(
          400,
          "user-not-created",
          true,
          request,
          reply,
        );
      }
      pushToQ("create", createdUser);
      await reply.code(201).send({
        success: true,
        data: {
          user: createdUser,
          token: token.generate(createdUser, tokenDuration),
          refreshToken: refreshToken.generate(
            createdUser,
            refreshTokenDuration,
          ),
        },
      });
    }
  } catch (error) {
    return await errorHandler(400, error, false, request, reply);
  }
};

const signInUser = async (request, reply) => {
  try {
    const findUser = await User.findOne({ email: request.body.email });

    if (!findUser) {
      return await errorHandler(
        406,
        "authentication-failed",
        true,
        request,
        reply,
      );
    } else {
      if (findUser.is_banned) {
        return await errorHandler(403, "user-is-banned", true, request, reply);
      } else {
        const validPassword = await bcrypt.compare(
          request.body.password,
          findUser.password,
        );
        if (!validPassword) {
          return await errorHandler(
            406,
            "authentication-failed",
            true,
            request,
            reply,
          );
        } else {
          if (findUser.is_deleted) {
            const updateUser = await findUser.update({
              is_deleted: false,
            });
            pushToQ("create", updateUser);
            await reply.code(200).send({
              success: true,
              data: {
                user: updateUser,
                token: token.generate(updateUser, tokenDuration),
                refreshToken: refreshToken.generate(
                  updateUser,
                  refreshTokenDuration,
                ),
              },
            });
          } else {
            await reply.code(200).send({
              success: true,
              data: {
                user: findUser,
                token: token.generate(findUser, tokenDuration),
                refreshToken: refreshToken.generate(
                  findUser,
                  refreshTokenDuration,
                ),
              },
            });
          }
        }
      }
    }
  } catch (error) {
    return await errorHandler(400, error, false, request, reply);
  }
};
const updateUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const findUser = await User.findById(id);

    if (!findUser) {
      return await errorHandler(404, "user-not-found", true, request, reply);
    } else {
      const updatedUser = await findUser.update({
        ...request.body,
      });

      if (!updatedUser) {
        return await errorHandler(
          400,
          "user-update-failed",
          true,
          request,
          reply,
        );
      }
      if (request.body.is_deleted) {
        pushToQ("delete", updatedUser);
        await reply.code(200).send({
          success: true,
          data: updatedUser,
        });
      } else {
        pushToQ("update", updatedUser);
        await reply.code(200).send({
          success: true,
          data: {
            user: updatedUser,
            token: token.generate(updatedUser, tokenDuration),
            refreshToken: refreshToken.generate(
              updatedUser,
              refreshTokenDuration,
            ),
          },
        });
      }
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const updateUserPassword = async (request, reply) => {
  try {
    const { id } = request.params;
    const findUser = await User.findById(id);

    if (!findUser) {
      return await errorHandler(404, "user-not-found", true, request, reply);
    } else {
      const updatedUser = await findUser.update({
        password: await bcrypt.hash(request.body.password, saltValue),
      });

      if (!updatedUser) {
        return await errorHandler(
          400,
          "user-password-update-failed",
          true,
          request,
          reply,
        );
      }
      await reply.code(200).send({
        success: true,
        data: {
          user: updatedUser,
          token: token.generate(updatedUser, tokenDuration),
          refreshToken: refreshToken.generate(
            updatedUser,
            refreshTokenDuration,
          ),
        },
      });
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

const deleteUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const findUser = await User.findById(id);

    if (!findUser) {
      return await errorHandler(404, "user-not-found", true, request, reply);
    } else {
      const deletedUser = await findUser.deleteOne();

      if (!deletedUser) {
        return await errorHandler(
          400,
          "user-delete-failed",
          true,
          request,
          reply,
        );
      }
      pushToQ("delete", findUser);
      await reply.code(200).send({
        success: true,
        data: findUser,
      });
    }
  } catch (error) {
    return await errorHandler(404, error, false, request, reply);
  }
};

module.exports = {
  findAll,
  findOne,
  createUser,
  signInUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
