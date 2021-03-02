
var GoogleStrategy = require('passport-google-oauth20').Strategy;


const mongoose = require('mongoose')

const User = require('../models/User')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: '1004718366573-n1jidqjgvo2urd21grlrvodac355kod9.apps.googleusercontent.com',
        clientSecret: 'BIbYnwMkSoBqcjXMHzyEZnUH',
        callbackURL: 'http://localhost:8000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
           let user = await User.findOne({
               googleId: profile.id
           })
           if(user){
               done(null, user)
           }else{
               user = await User.create(newUser)
               done(null, user)
           }            
        } catch (error) {
            console.log(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}