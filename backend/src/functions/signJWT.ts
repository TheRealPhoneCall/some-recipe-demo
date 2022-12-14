import jwt, { sign } from 'jsonwebtoken'
import config from '../config/config'
import logging from '../config/logging'
import { IUser } from '../modules/auth/model'

const NAMESPACE = 'Auth'

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
  var timeSinceEpoch = new Date().getTime()
  var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000
  var expirationTimeInSeconds = Math.floor(expirationTime / 1000)

  logging.info(NAMESPACE, `Attempting to sign token for ${user.username}`)

  try {
    jwt.sign(
      { username: user.username },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: 'HS256',
        expiresIn: expirationTimeInSeconds
      },
      (error, token) => {
        if (error) {
          callback(error, null)
        } else if (token) {
          callback(null, token)
        }
      }
    )
  } catch (error: any) {
    logging.error(NAMESPACE, error.message, error)
    callback(error, null)
  }
}

export default signJWT