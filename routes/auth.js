


const express = require('express')


const passport = require('passport')





const router = express.Router()

//Authenticate with Google




router.get('/google', passport.authenticate('google', {scope: ['profile'] }))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

router.get('/dashboard', (req, res) => {
    res.render('Dashboard')
})

// Logout

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router