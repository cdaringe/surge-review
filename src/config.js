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
  BUILD_ID: null,
  DEBUG: null,
  GH_DOMAIN: null,
  GH_FOLLOW_REDIRECTS: null,
  GH_PROJECT: project || env.GH_PROJECT,
  GH_PROTOCOL: null,
  GH_PULL_REQUEST: null,
  GH_PULL_BRANCH: null,
  GH_OWNER: owner || env.GH_OWNER,
  GH_TOKEN: env.GH_TOKEN,
  GHE: null,
  PUBLISH_DIR: process.cwd(),
  SURGE_TOKEN: env.SURGE_TOKEN
}
