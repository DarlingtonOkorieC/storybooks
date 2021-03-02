const e = require('express')
const express = require('express')
const {ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')




const router = express.Router()

//stories/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

//stories/read more

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById({_id: req.params.id})
        .populate('user')
        .lean()

        if(!story){
            return res.render('error/404')
        }

        res.render('stories/show',{
            story
        })
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
})


//stories/post

router.post('/', ensureAuth, async (req, res) => {
   try {
       req.body.user = req.user.id
       await Story.create(req.body)
       res.redirect('/dashboard')

   } catch (error) {
       console.error(error)
       res.render('error/500')
       
   }
})

//Stories Get

router.get('/', ensureAuth, async (req, res) => {
    try{
        
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

        res.render('stories', {
            stories
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

//stories/edit

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story){
            res.render('error/404')
        }
    
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            res.render('stories/edit', {
                story
            })
        }    
    } catch (error) {
        console.log(error);
        return res.render('error/500',{
            error
        })
    }
    
})

//Put Request into update

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
    if(!story){
        return res.render('/error/404')
    }
    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
            story = Story.findOneAndUpdate({_id: req.params.id}, req.body,
               {
                   new: true,
                   runValidators: true
               })
               res.redirect('/dashboard')
        }

        
    } catch (error) {
        console.log(error);
        return res.render('error/500',{
            error
        })
    }
    })

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.findByIdAndDelete( req.params.id)
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  router.delete('/delete/:id', async (req, res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

  

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:id', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })
  


module.exports = router