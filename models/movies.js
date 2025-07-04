const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  adult: { type: Boolean },
  backdrop_path: { type: String },
  belongs_to_collection: { type: String },
  budget: { type: Number },
  genres: [{
    id: { type: Number },
    name: { type: String }
  }],
  homepage: { type: String },
  id: { type: Number, required: true, unique: true },
  imdb_id: { type: String },
  origin_country: [{ type: String }],
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  production_companies: [{
    id: { type: Number },
    logo_path: { type: String, default: null },
    name: { type: String },
    origin_country: { type: String }
  }],
  production_countries: [{
    iso_3166_1: { type: String },
    name: { type: String }
  }],
  release_date: { type: String },
  revenue: { type: Number },
  runtime: { type: Number },
  spoken_languages: [{
    english_name: { type: String },
    iso_639_1: { type: String },
    name: { type: String }
  }],
  status: { type: String },
  tagline: { type: String },
  title: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  pick: { type: Number }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie