to generate a secret key using node js

require('crypto').randomBytes(64).toString('hex')
