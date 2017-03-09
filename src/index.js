'use strict'

var cp = require('child_process')
var path = require('path')
var GitHub = require('github')
var wf = require('run-waterfall')
var rando = require('./rando')

var surgeBin = path.resolve(require.resolve('surge'), '..', 'cli.js')

var sr = {
  // props
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
    cb(null, req)
  },
  deploy: function (req, cb) {
    var surgeURI = 'surgereview' + (req.BUILD_ID || rando()) + '.surge.sh'
    req.surgeURI = surgeURI
    var args = [surgeBin, ['.', surgeURI], { stdio: 'inherit', cwd: req.PUBLISH_DIR }]
    console.log(args)
    var surge = cp.spawn.apply(cp, args)
    surge.on('exit', function (code) {
      if (code) process.exit(code)
      cb(null, req)
    })
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
    if (!req.GH_PULL_BRANCH) return cb(new Error('cannot identify a PR to post to'))
    var gh = this.getGH(req)
    gh.pullRequests.getAll({
      owner: req.GH_OWNER,
      repo: req.GH_PROJECT
    }, function (err, res) {
      if (err) return cb(err)
      for (var j in res.data) {
        var pr = res.data[j]
        if (pr.head.ref.trim() === req.GH_PULL_BRANCH.trim()) {
          // req.GH_PULL_REQUEST = parseInt(pr.html_url.match(/\d+$/)[0], 10) // eslint-disable-line
          req.GH_PULL_REQUEST = pr.number
          return cb(null, req)
        }
      }
      return cb(new Error('unable to find PR number for branch: ' + req.GH_PULL_BRANCH))
    })
  },
  postPRUpdate: function (req, cb) {
    var surgeURI = req.surgeURI
    var gh = this.getGH(req)
    gh.issues.createComment({
      owner: req.GH_OWNER,
      repo: req.GH_PROJECT,
      number: req.GH_PULL_REQUEST,
      body: [
        'Woohoo! new surge deployment available for viewing! :tada:',
        '[' + surgeURI + '](http://' + surgeURI + ')'
      ].join(' ')
    }, cb)
  },
  run: function (config, cb) {
    wf([
      function injectConfig (cb) { cb(null, config) },
      this.check,
      this.deploy,
      this.getPRNumber,
      this.postPRUpdate
    ], cb)
  }
}

for (var key in sr) if (typeof sr[key] === 'function') sr[key] = sr[key].bind(sr)

module.exports = sr
