const express = require('express')
const router = express.Router()
const Article = require('../models/article')

router.get('/add', (req, res) => {
    res.render('add', {
        title: 'Articles'
    })
})

router.post('/add', (req,res) => {
    req.checkBody('title', 'title is required').notEmpty()
    req.checkBody('author', 'author is required').notEmpty()
    req.checkBody('body', 'body is required').notEmpty()

    let errors = req.validationErrors()

    if(errors) {
        res.render('add', {
            title: 'Add article',
            errors: errors
        })
    } else {
        const article = new Article()
        article.title = req.body.title
        article.author = req.body.author
        article.body = req.body.body

        article.save((err) => {
            if(err){
                console.log(err)
                req.flash('danger', 'Article cannot add')
                return
            } else {
                req.flash('success', 'Article was added')
                res.redirect('/')
            }
        })
    }

    
})


router.get('/:id', (req,res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        })
    })
})

router.get('/edit/:id', (req,res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
})

router.post('/edit/:id', (req,res) => {
    const article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    const query = {_id: req.params.id}

    Article.update(query, article, (err) => {
        if(err){
            console.log(err)
            return
        } else {
            res.redirect('/')
        }
    })
})

router.delete('/:id', (req, res) => {
    const query = {_id: req.params.id}

    Article.deleteOne(query, (err) => {
        if(err) {
            console.log(err)
        }
        res.send('Success')
    })
})

module.exports = router;
