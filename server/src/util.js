import crypto from 'crypto'
import {promisify} from 'util'
import {ObjectID} from 'mongodb'

export async function secureRandomString (): string {
  const buffer = await promisify(crypto.randomBytes)(32)
  return buffer.toString('hex')
}

export function mongoId (): string {
  return (new ObjectID()).toHexString()
}

export default {secureRandomString, mongoId}
