'use strict'

var env = process.env
var owner
var project
if (env.GH_PROJECT_OWNER) {
  var parts = env.GH_PROJECT_OWNER.split('/')
  owner = parts[0]
  project = parts[1]
}

module.exports = {
  BUILD_ID: env.BUILD_ID,
  DEBUG: env.DEBUG,
  GH_DOMAIN: env.GH_DOMAIN,
  GH_FOLLOW_REDIRECTS: env.GH_FOLLOW_REDIRECTS,
  GH_PROJECT: project || env.GH_PROJECT || env.CIRCLE_PROJECT_REPONAME,
  GH_PROTOCOL: env.GH_PROTOCOL,
  GH_PULL_REQUEST: env.GH_PULL_REQUEST, // circle's PR_NUMBER only works in forked builds
  GH_PULL_BRANCH: env.GH_PULL_BRANCH || env.CIRCLE_BRANCH,
  GH_OWNER: owner || env.GH_OWNER || env.CIRCLE_PROJECT_USERNAME,
  GH_TOKEN: env.GH_TOKEN,
  GHE: env.GHE,
  PUBLISH_DIR: process.cwd(),
  SURGE_TOKEN: env.SURGE_TOKEN
}
