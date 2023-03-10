require('dotenv').config()
const config = require('config')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const logger = require('morgan')
const mongoose = require('mongoose')
const userRouter = require('./src/routes/user.route')
const weight = require('./src/routes/weight.route')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!process.env.jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose
  .connect('mongodb://localhost/weight-tracker', {})
  .then(
    () => {
      console.log('Successfully connected to DB')
      const port = process.env.PORT || 3001
      const userUrl = '/api/users'
      app.use(logger('dev')) // log requests to the console
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
