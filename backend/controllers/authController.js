const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// register
authController.post('/register', async(req, res) => {
    try {
      const {username, email, password} = req.body
      if(!username || !email || !password){
        return res.status(400).json({msg: "username, email and password are required"})
      }
      if(password.length < 6){
        return res.status(400).json({msg: "Password must be at least 6 characters"})
      }

      const isExisting = await User.findOne({email})
      if(isExisting){
        return res.status(409).json({msg: "Already an account with this email. Try a new one!"})
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      // only take known, safe fields - never spread req.body, or a client could pass isAdmin: true here
      const newUser = await User.create({username, email, password: hashedPassword})
      const {password: _pw, ...others} = newUser._doc
      const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET, {expiresIn: '5h'})

      return res.status(201).json({others, token})
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Something went wrong while registering"})
    }
})

// login
authController.post('/login', async(req, res) => {
    try {
       const {email, password} = req.body
       if(!email || !password){
        return res.status(400).json({msg: "email and password are required"})
       }

       const user = await User.findOne({email})
       if(!user){
          return res.status(401).json({msg: "User credentials are wrong!"})
       }

       const comparePass = await bcrypt.compare(password, user.password)
       if(!comparePass){
        return res.status(401).json({msg: "User credentials are wrong!"})
       }

       const {password: _pw, ...others} = user._doc
       // isAdmin must be signed in here too, or verifyTokenAdmin would only ever pass right after registering, never after a normal login
       const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {expiresIn: '5h'})

       return res.status(200).json({others, token})
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Something went wrong while logging in"})
    }
})


module.exports = authController
