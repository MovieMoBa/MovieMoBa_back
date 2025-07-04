const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')
const url = "mongodb+srv://tlatamus0203:3PV3ZAuEL6MrXkfr@cluster23.cyyuqox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster23"

const Review = require('./models/reviews')

mongoose.connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

app.post('/reviews', async(req, res) => {
    try{
        const review = new Review(req.body)
        const savedReview = await review.save()
        res.status(201).json(savedReview)
    } catch(err) {
        res.status(400).json({error: err.message})
    }
})

app.get('/reviews/:movieID', async(req, res) => {
    const { movieID } = req.params
    if(!movieID){
        return res.status(400).json({error: 'movieID가 필요합니다!'})
    }
    const reviews = await Review.find({ movieID })
    res.json(reviews)
})

app.get('/reviews/:movieID/average', async(req, res) => {
    const { movieID } = req.params
    if(!movieID){
        return res.status(400).json({error: 'movieID가 필요합니다!'})
    }
    const reviews = await Review.find({ movieID })

    var sum = 0
    var cnt = 0
    for (var movie of reviews){
        cnt++
        sum = sum + movie.rating
    }
    var average = sum/cnt
    res.json({"average" : `${average}`})
})

app.get('/top6', async (req, res) => {
    const topMovies = await Review.aggregate([
        { $group: { _id: "$movieID", reviewCount: { $sum: 1 } } },
        { $sort: { reviewCount: -1 } },
        { $limit: 6 }
    ])
    res.json(topMovies)
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
