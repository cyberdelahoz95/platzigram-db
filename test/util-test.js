'use strict'

const test = require('ava')
const utils = require('../lib/utils')

test('extracting hastags base on picture description', t => {
  let tags = utils.extractTags('a #picture with tag #AweSome #platzi #AVA and #100 ##yes')
  t.deepEqual(tags, ['picture', 'awesome', 'platzi', 'ava', '100', 'yes']) // t is main testing object, it is on charge of receiveing the assertions (which is a method that we use to compare or to set the rules to get an approved value or a rejected value)

  tags = utils.extractTags('a picture with no tags')
  t.deepEqual(tags, [])

  tags = utils.extractTags(null)
  t.deepEqual(tags, [])
})
