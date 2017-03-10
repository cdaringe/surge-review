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
  GH_PROJECT: project || env.GH_PROJECT,
  GH_PROTOCOL: env.GH_PROTOCOL,
  GH_PULL_REQUEST: env.GH_PULL_REQUEST,
  GH_PULL_BRANCH: env.GH_PULL_BRANCH,
  GH_OWNER: owner || env.GH_OWNER,
  GH_TOKEN: env.GH_TOKEN,
  GHE: env.GHE,
  PUBLISH_DIR: process.cwd(),
  SURGE_TOKEN: env.SURGE_TOKEN
}
