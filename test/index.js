'use strict'

var tape = require('tape')
var sr = require('../')
var defaultConfig = Object.assign({}, require('../src/config'))
var wf = require('run-waterfall')
const sinon = require('sinon')

var mockGH = {
  authenticate: () => true,
  pullRequests: {
    getAll: (req, cb) => {
      cb(null, {
        data: [
          {
            head: {
              ref: 'test'
            },
            html_url: 'github.com/bha/bjbia/1'
          }
        ]
      })
    }
  }
}

tape('find pr', t => {
  t.plan(2)
  sinon.stub()
  var conf = Object.assign({}, defaultConfig, {
    GH_OWNER: 'cdaringe',
    GH_PROJECT: 'surge-review',
    GH_PULL_BRANCH: 'test'
  })
  var stub = sinon.stub(sr, 'getGH', (req) => mockGH)
  wf([
    cb => sr.getPRNumber(conf, cb)
  ], function (err, res) {
    if (err) return t.end(err)
    t.equal(res.GH_PULL_REQUEST, 1)
    t.ok(stub.calledOnce)
    stub.restore()
    t.end()
  })
})
