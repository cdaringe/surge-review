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
            html_url: 'github.com/bha/bjbia/1',
            number: 1
          }
        ]
      })
    }
  },
  issues: {
    createComment (args, cb) {
      return cb(null, args)
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
  var stubGetGitHub = sinon.stub(sr, 'getGH').callsFake(req => mockGH)
  var stubDeploy = sinon.stub(sr, 'deploy').callsFake((req, cb) => cb(null, req))
  wf([
    cb => sr.getPRNumber(conf, cb)
  ], function (err, res) {
    if (err) return t.end(err)
    t.equal(res.GH_PULL_REQUEST, 1)
    stubGetGitHub.restore()
    stubDeploy.restore()
    t.ok(stubGetGitHub.calledOnce)
    t.end()
  })
})

tape('run with dir & pull-request', t => {
  t.plan(2)
  sinon.stub()
  var conf = Object.assign({}, defaultConfig, {
    SURGE_TOKEN: 'test-surge-token',
    GH_TOKEN: 'test-gh-token',
    GH_OWNER: 'cdaringe',
    GH_PROJECT: 'surge-review',
    GH_PULL_REQUEST: '25'
  })
  var stubDeploy = sinon.stub(sr, 'deploy').callsFake((req, cb) => cb(null, req))
  var stubGetGitHub = sinon.stub(sr, 'getGH').callsFake((req) => mockGH)
  sr.run(conf, function (err, res) {
    if (err) return t.end(err)
    t.equal(res.number, '25')
    stubGetGitHub.restore()
    stubDeploy.restore()
    t.ok(stubGetGitHub.calledOnce)
    t.end()
  })
})
