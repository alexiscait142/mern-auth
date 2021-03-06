const router = require('express').Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//validation
// const Joi = require('@hapi/joi')
// const schema = Joi.object({
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()
// })

router.post('/register', async (req, res) => {

    //validate data before making user
    // const { error } = schema.validate(req.body)
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if user is already in database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('email exists in db')

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: user._id})
        // res.send(savedUser)
    }catch(err){
        res.status(400).send(err)
    }
})


//login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //find if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('incorrect email')

    //password is correct?
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('incorrect pw')

    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

    // res.send('logged in')
})

// router.post('/login', (req, res)=>{

// })

module.exports = router