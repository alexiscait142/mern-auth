const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const postRoute = require('./routes/posts')

//routes
const authRoute = require('./routes/auth')

dotenv.config()

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db'),
    { useUnifiedTopology: true },
    )

app.use(express.json())

//route middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, ()=>console.log("server up and running"))