const config = require('config')
const express = require('express')
const app = express()
const logger = require('morgan')
const mongoose = require('mongoose')
const userRouter = require('./src/routes/user.route')
const weight = require('./src/routes/weight.route')

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose
  .connect('mongodb://localhost/weight-tracker', {})
  .then(
    () => {
      console.log('Successfully connected to DB')
      const port = process.env.PORT || 3000
      const userUrl = '/api/users'
      app.use(logger('dev')) // log requests to the console

      // Parse incoming requests data
      app.use(express.json())

      // load our API routes
      app.use(userUrl, userRouter)
      app.use(userUrl, weight)

      // establish http server connection
      app.listen(port, () => console.log(`Server listening on port ${port}!`))
    },
    (err) => {
      console.log('possible middleware error: ', err)
    }
  )
  .catch((err) => console.log('DB error: ', err))
