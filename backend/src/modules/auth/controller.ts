import { NextFunction, Request, Response } from "express";
import logging from "../../config/logging";
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose'
import User from './model'
import signJWT from "../../functions/signJWT";


const NAMESPACE = "User"

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Token validated. User authorized.")

  return res.status(200).json({ message: "Authorized" })
}

const register = (req: Request, res: Response, next: NextFunction) => {
  let {
    username, password, firstName, lastName,
    email, phoneNumbers, photo, userType

  } = req.body
  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      logging.error(NAMESPACE, hashError.message, hashError)
      return res.status(500).json({
        message: hashError.message,
        error: hashError
      })
    }

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hash,
      firstName,
      lastName,
      email,
      photo,
      phoneNumbers,
      userType
    })

    return newUser.save()
      .then(user => {
        signJWT(user, (jwtError, token) => {
          if (jwtError) {
            logging.error(NAMESPACE, 'Unable to sign token: ', jwtError)
            return res.status(401).json({
              message: 'Unauthorized',
              error: jwtError
            })
          }
          if (token) {
            logging.info(NAMESPACE, 'Token signing successful', token)
            return res.status(201).json({
              message: 'Auth successful',
              token,
              user
            })
          }
        })
      })
      .catch(error => {
        logging.error(NAMESPACE, error, error)
        return res.status(500).json({
          message: error,
          error
        })
      })

  })
}

const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  let {
    _id, username, password, firstName, lastName,
    email, phoneNumbers, photo, userType
  } = req.body

  let updatedUser = {}
  if (username) { updatedUser = { ...updatedUser, username } }
  if (firstName) { updatedUser = { ...updatedUser, firstName } }
  if (lastName) { updatedUser = { ...updatedUser, lastName } }
  if (email) { updatedUser = { ...updatedUser, email } }
  if (phoneNumbers) { updatedUser = { ...updatedUser, phoneNumbers } }
  if (photo) { updatedUser = { ...updatedUser, photo } }
  if (userType) { updatedUser = { ...updatedUser, userType } }
  if (password) {
    bcryptjs.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        logging.error(NAMESPACE, hashError.message, hashError)
        return res.status(500).json({
          message: hashError.message,
          error: hashError
        })
      }

      updatedUser = { ...updatedUser, password: hash }
    })
  }
  console.info(updatedUser)
  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $set: updatedUser }
    )
    console.info(user)

    if (user == null) {
      logging.error(NAMESPACE, `Cannot find user with id ${_id}`)
      return res.status(500).json({
        message: `Cannot find user with id ${_id}`,
        error: 'Record not found'
      })
    }
    if (password) {
      signJWT(user, (jwtError, token) => {
        if (jwtError) {
          logging.error(NAMESPACE, 'Unable to sign token: ', jwtError)
          return res.status(401).json({
            message: 'Unauthorized',
            error: jwtError
          })
        }
        if (token) {
          logging.info(NAMESPACE, 'Token signing successful', token)
          return res.status(201).json({
            message: 'Auth successful',
            token,
            user
          })
        }
      })
    }
    return res.status(200).json({
      message: 'User updated.',
      user
    })
  } catch (error) {
    logging.error(NAMESPACE, error.message, error)
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

const login = (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body

  User.find({ username })
    .exec()
    .then(users => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: 'Unauthorized'
        })
      }

      const _user = users[0]

      bcryptjs.compare(password, _user.password, (error, result) => {
        if (error) {
          logging.error(NAMESPACE, error.message, error)
          return res.status(401).json({
            message: 'Unauthorized'
          })
        }
        if (result) {
          signJWT(_user, (jwtError, token) => {
            if (jwtError) {
              logging.error(NAMESPACE, 'Unable to sign token: ', jwtError)
              return res.status(401).json({
                message: 'Unauthorized',
                error: jwtError
              })
            }
            if (token) {
              return res.status(200).json({
                message: 'Auth successful',
                token,
                user: _user
              })
            }
          })
        }
      })
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error
      })
    })
}

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .select('-password')
    .exec()
    .then(users => {
      return res.status(200).json({
        users,
        count: users.length
      })
    })
    .catch(error => {
      return res.status(500).json({
        message: error.message,
        error
      })
    })
}

export default {
  validateToken,
  register,
  updateAccount,
  login,
  getAllUsers
}

