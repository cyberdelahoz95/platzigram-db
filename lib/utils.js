'use strict'

const crypto = require('crypto')

const utils = {
  extractTags,
  encrypt
}

  // in ES6 i can set an json object property with one word in this case extractTags and nothing else because both the key and the value (in this case the function's name has the same name)

function extractTags (text) {
  if (text == null) return []

  let matches = text.match(/(#(\w+))/g) // using regular expressions i am getting the substring from the text variable that fits with the reg ex sent as parameter

  if (matches === null) return []

  matches = matches.map(normalize) // map iterates over every element in matches array

  return matches
}

function normalize (text) { // this function converts a string into lowercase 100%
  text = text.toLowerCase()
  text = text.replace(/#/g, '')
  return text
}

function encrypt (password) {
  let shasum = crypto.createHash('sha256')
  shasum.update(password)
  return shasum.digest('hex')
}

module.exports = utils
