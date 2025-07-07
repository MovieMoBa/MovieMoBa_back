const express = require('express')
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
const host = '0.0.0.0'

const cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')
const url = "mongodb+srv://tlatamus0203:3PV3ZAuEL6MrXkfr@cluster23.cyyuqox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster23"

const Review = require('./models/reviews')
const Movie = require('./models/movies')
const Taste = require('./models/tastes')
const MovieTaste = require('./models/movieTastes')
// 처음 실행 전 반드시 movie/movieTaste 데이터 wipe 후 이용!!

const { spawn } = require('child_process')

var likes = []
var prevQuestions = []

function updateTaste(movie, taste) {
  if (movie.genres && Array.isArray(movie.genres)) {
    movie.genres.forEach(genreObj => {
      const genreName = genreObj.name
      if (genreName in taste) {
        taste[genreName] += 3
      }
    })
  }
  likes.push(movie.title)
}

async function makeMovieTaste(movie, taste) {
  if (movie.genres && Array.isArray(movie.genres)) {
    var tasteRecord = 0
    movie.genres.forEach(genreObj => {
      const genreName = genreObj.name
      if (genreName in taste) {
        tasteRecord += taste[genreName]
      }
    })
    const movieTaste = new MovieTaste({taste : tasteRecord, movie : movie})
    const savedMovieTaste = await movieTaste.save()
  }
}

function askGemini(question) {
  return new Promise((resolve, reject) => {
    const py = spawn('python', ['./gemini.py', question])

    let result = ''
    let error = ''

    py.stdout.on('data', (data) => {
      result += data.toString()
    })

    py.stderr.on('data', (data) => {
      error += data.toString()
    })

    py.on('close', (code) => {
      if (code === 0) {
        resolve(result)
      } else {
        reject(error || `Python process exited with code ${code}`)
      }
    })
  })
}

mongoose.connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

app.get('/', async (req, res) => {
    res.status(200)
})

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

app.post('/movies', async(req, res) => {
    try{
        const movie = new Movie(req.body)
        const savedMovie = await movie.save()
        res.status(201).json(savedMovie)
    } catch(err) {
        res.status(400).json({error: err.message})
    }
})

app.get('/movies/delete', async (req, res) => {
    await Movie.deleteMany({})
    res.json({"status" : "delete complete"})
})

app.post('/movies/recommend', async (req, res) => {
    await MovieTaste.deleteMany({})
    await Taste.deleteMany({})
    const taste = new Taste({
        Action: 1,
        Adventure: 1,
        Animation: 1,
        Comedy: 1,
        Crime: 1,
        Documentary: 1,
        Drama: 1,
        Family: 1,
        Fantasy: 1,
        History: 1,
        Horror: 1,
        Music: 1,
        Mystery: 1,
        Romance: 1,
        "Science Fiction": 1,
        "TV Movie": 1,
        Thriller: 1,
        War: 1,
        Western: 1
    })
    const movies = req.body.movies
    for (var movie of movies){
        updateTaste(movie, taste)
    }
    await taste.save()
    for (var movie of movies){
        await makeMovieTaste(movie, taste)
    }
    const recommendMovies = await MovieTaste.aggregate([
        { $sort: { taste: -1 } },
        { $limit: 3 }
    ])
    res.json(recommendMovies)
})

app.get('/movies/howabout', async (req, res) => {
    const taste = await Taste.findOne()
    // console.log(taste)

    const { _id, __v, ...tasteOnly } = taste._doc
    // console.log(tasteOnly)
    const tasteOnlyEntries = Object.entries(tasteOnly).sort((a,b) => b[1] - a[1])

    const first = tasteOnlyEntries[0]
    const second = tasteOnlyEntries[1]
    const eighth = tasteOnlyEntries[7]
    const ninth = tasteOnlyEntries[8] 

    res.json({like : [first, second], soso : [eighth, ninth]})
})

app.post('/ask', async (req, res) => {
    const question = req.body.question
    prevQuestions.push(question)

    const movieLikes = "다음은 내가 좋아하는 영화들이야 : " + likes.join(", ")
    const uptoPresent = prevQuestions.join(", ")
    var fullQuestion = ""
    if (likes.length>0){
        fullQuestion = uptoPresent + movieLikes
    }
    else {
        fullQuestion = uptoPresent
    }
    try {
        const answer = await askGemini(fullQuestion)
        const j_answer = JSON.parse(answer)
        res.json({answer : j_answer})
    } catch (err) {
        res.json({error : err})
    }
})

app.listen(port, host, () => {
    console.log(`Server running on port ${port}`)
})
