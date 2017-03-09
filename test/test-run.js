'use strict'

var sr = require('../')
var defaultConfig = Object.assign({}, require('../src/config'))
var path = require('path')

var conf = Object.assign({}, defaultConfig, {
  GH_OWNER: 'cdaringe',
  GH_PROJECT: 'surge-review',
  GH_PULL_BRANCH: 'test',
  PUBLISH_DIR: path.join(__dirname, 'test-site')
})
sr.run(conf, err => {
  if (err) throw err
})
