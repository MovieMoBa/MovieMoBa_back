const mongoose = require('mongoose');

const tasteSchema = new mongoose.Schema({
  Action: { type: Number, default: 0 },
  Adventure: { type: Number, default: 0 },
  Animation: { type: Number, default: 0 },
  Comedy: { type: Number, default: 0 },
  Crime: { type: Number, default: 0 },
  Documentary: { type: Number, default: 0 },
  Drama: { type: Number, default: 0 },
  Family: { type: Number, default: 0 },
  Fantasy: { type: Number, default: 0 },
  History: { type: Number, default: 0 },
  Horror: { type: Number, default: 0 },
  Music: { type: Number, default: 0 },
  Mystery: { type: Number, default: 0 },
  Romance: { type: Number, default: 0 },
  "Science Fiction": { type: Number, default: 0 },
  "TV Movie": { type: Number, default: 0 },
  Thriller: { type: Number, default: 0 },
  War: { type: Number, default: 0 },
  Western: { type: Number, default: 0 }
});

const Taste = mongoose.model('Taste', tasteSchema)

module.exports = Taste