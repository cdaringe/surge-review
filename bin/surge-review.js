#!/usr/bin/env node
'use strict'

require('perish')
var config = require('../src/config')
var sr = require('../src/index')
var parseArgs = require('minimist')
var argv = parseArgs(process.argv.slice(2))
var path = require('path')

if (argv.p || argv['publish-dir']) config.PUBLISH_DIR = path.resolve(process.cwd(), argv.p || argv['publish-dir'])
if (argv.b || argv['pr-branch']) config.GH_PULL_BRANCH = path.resolve(process.cwd(), argv.b || argv['pr-branch'])

sr.run(config, function (err) {
  if (err) throw err
  console.log('ok')
})
