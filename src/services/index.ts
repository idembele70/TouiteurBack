import crypto from 'crypto'

const random = () => {
  const { RANDOM_BYTES, CRYPTO_BASE } = process.env
  return crypto.randomBytes(Number(RANDOM_BYTES)).toString(CRYPTO_BASE)
}
const authentification = (salt: string, password: string) => {
  const { HMAC, PASSWORD_SECRET_KEY, DIGEST } = process.env
  return crypto.createHmac(HMAC, [salt, password].join('/')).update(
    PASSWORD_SECRET_KEY
  ).digest(DIGEST)
}
export {
  authentification, random
}
