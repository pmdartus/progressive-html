'use strict'

var async = require('async')
var express = require('express')
var app = express()

require('marko/compiler').defaultOptions.writeToDisk = false
var marko = require('marko')
var indexCmp = marko.load(require.resolve('./cmp/index.marko'))
var fragmentCmp = marko.load(require.resolve('./cmp/fragment.marko'))

function getName (callback) {
  const name = { val: 'BOB' }
  setTimeout(function () {
    callback(null, name)
  }, 1000)
}

function getCount (callback) {
  const count = { val: 100 }
  setTimeout(function () {
    callback(null, count)
  }, 500)
}

app.get('/sync', function (req, res) {
  async.parallel([
    getName,
    getCount
  ], function (err, values) {
    if (err) {
      console.error(err)
    }

    const template = indexCmp.renderSync({
      name: values[0].val,
      count: values[1].val
    })

    res.send(template)
  })
})

app.get('/fragment', function (req, res) {
  fragmentCmp.render({
    userDataProvider: function (arg, cb) {
      getName(cb)
    }
  }, res)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
