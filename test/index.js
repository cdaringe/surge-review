'use strict'

var tape = require('tape')
var sr = require('../')
var defaultConfig = Object.assign({}, require('../config'))
var wf = require('run-waterfall')

tape('find pr', t => {
  t.plan(1)
  var conf = Object.assign({}, defaultConfig)
  wf([
    sr.getPRNumber(conf)
  ], function (err, res) {
    if (err) return t.end(err)
    t.ok(res)
    t.end()
  })
})
