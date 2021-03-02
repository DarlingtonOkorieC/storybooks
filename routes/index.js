const e = require('express')
const express = require('express')
const {ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')




const router = express.Router()

router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {layout: 'login'})
})

router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id}).lean()   
    res.render('Dashboard',{
        name: req.user.firstName,
        stories
    })

    } catch (error) {
        console.error(error)
        res.render('error/500')        
    }

})

module.exports = router