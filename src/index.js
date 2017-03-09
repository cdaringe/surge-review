'use strict'

var cp = require('child_process')
var path = require('path')
var GitHub = require('github')
var wf = require('run-waterfall')

var config = require('./config')

var surgeBin = path.resolve(require.resolve('surge'), '..', 'cli.js')

var sr = {
  // props
  _prNumber: null,
  gh: null,

  // methods
  authenticateGH: function (req, gh) {
    return gh.authenticate({
      type: 'oauth',
      token: req.GH_TOKEN
    })
  },
  check: function (req, cb) {
    if (!req.SURGE_TOKEN) return cb(new Error('missing SURGE_TOKEN'))
    if (!req.GH_TOKEN) return cb(new Error('missing GH_TOKEN'))
    if (!req.GH_PULL_BRANCH && !req.GH_PULL_REQUEST) return cb(new Error('a GH_PULL_BRANCH or a GH_PULL_REQUEST must be provided'))
    cb()
  },
  deploy: function (req, cb) {
    var surgeURI = 'surge-pr-' + req.BUILD_ID + '.surge.sh'
    req.surgeURI = surgeURI
    var surge = cp.spawn(
      surgeBin,
      [
        '--domain', surgeURI,
        '--project', req.PUBLISH_DIR
      ],
      { stdio: 'inherit' }
    )
    surge.on('exit', function (code) {
      if (code) process.exit(code)
      cb(null, req)
    })
  },
  getConfig: function (cb) {
    return cb(null, config)
  },
  getGH: function (req) {
    if (this.gh) return this.gh
    var gh = new GitHub({
      debug: req.DEBUG || true,
      protocol: req.GH_PROTOCOL || 'https',
      host: req.GH_DOMAIN || null,
      pathPrefix: req.GHE ? '/api/v3' : null, // for some GHEs; none for GitHub
      headers: { 'user-agent': 'surge-review' },
      followRedirects: req.GH_FOLLOW_REDIRECTS || false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
      timeout: 5000
    })
    this.gh = gh
    this.authenticateGH(req, gh)
    return gh
  },
  getPRNumber: function (req, cb) {
    if (req.GH_PULL_REQUEST) return cb(null, req)
    if (!req.GH_PULL_BRANCH) throw new Error('cannot identify a PR to post to')
    var gh = this.getGH()
    gh.pullRequests.getAll({
      owner: req.GH_OWNER,
      repo: req.GH_PROJECT
    }, function (err, res) {
      if (err) return cb(err)
      debugger
      console.log('no')
    })
  },
  postPRUpdate: function (req, cb) {
    var gh = this.getGH(req)
    gh.pullRequests.createComment({
      owner: req.GH_OWNER,
      repo: req.GH_PROJECT,
      number: this._prNumber,
      body: [
        'Woohoo, new surge deploymet available for viewing!',
        this._surgeURI
      ].join(' ')
    }, cb)
  },
  run: function (cb) {
    wf([
      this.getConfig,
      this.check,
      this.deploy,
      this.getPRNumber,
      this.postPRUpdate
    ], cb)
  }
}

for (var key in sr) if (typeof sr[key] === 'function') sr[key] = sr[key].bind(sr)

module.exports = sr
