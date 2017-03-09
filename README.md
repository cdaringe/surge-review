# surge-review :zap:

- Deploys a static site to [surge.sh](http://surge.sh)
- Adds a comment to your pull request with the new site URL :tada:

[ ![Codeship Status for cdaringe/surge-review](https://app.codeship.com/projects/f3909050-e73f-0134-cbdd-5eb6ba68ea7b/status?branch=master)](https://app.codeship.com/projects/207094) ![](https://img.shields.io/badge/standardjs-%E2%9C%93-brightgreen.svg) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## usage

`npm install --save-dev surge-review`

`$ surge-review`

see `surge-review -h` for common options.

genrally, you will setup your CI server for your project to:

- export github & surge tokens
- install this package
- build your website
- run `surge-review` to deploy to surge & post a comment to github

@notes:

- gitlab is not yet supported.  the api calls used are short and sweet. open a PR if you'd like to add it!
- github enterprise _is_ supported. see config options

## configuration

### required

- `SURGE_TOKEN`
- `GH_TOKEN`
- `GH_PROJECT`
- `GH_OWNER`
  - `GH_PROJECT_OWNER`, such as 'cdaringe/surge-review' can be used in exchange for the above two
- `GH_PULL_REQUEST`
  - the _number_ of your PR.  this is the number at the end of your PR URL
  - this isn't strictly required--`surge-review` will try to search for the PR number **iff* you also provide a `GH_PULL_BRANCH`

### optional

- `BUILD_ID` your <subdomain>.surge.sh is random by default. add this to make your subdomain `s`urgereview`${BUILD_ID}`
- `GHE` set to true if publishing to GitHub Enterprise
- `GH_DOMAIN` default: github.com
- `GH_PROTOCOL` default: 'https'
- `GH_FOLLOW_REDIRECTS` default: false
