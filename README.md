# weight-tracker-api

# Getting Started with Running the Server

Run the following command

I used a mongoodb database, if you don't have mongodb installed, please check this out https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

and then start it `brew services start mongodb`

### `npm i` to install the dependancies
### make sure you create a `.env` file on the root of the project directory

and the just add this key on your `.env` file `jwtPrivateKey` with a value ofcourse.

like 
### jwtPrivateKey='YourPrivateKeyHere'

and then to run it you may use this command 
`nodemon`
