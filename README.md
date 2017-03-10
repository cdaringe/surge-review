# surge-review :zap:

- Deploys a static site to [surge.sh](http://surge.sh)
- Adds a comment to your pull request with the new site URL :tada:

[ ![Codeship Status for cdaringe/surge-review](https://app.codeship.com/projects/f3909050-e73f-0134-cbdd-5eb6ba68ea7b/status?branch=master)](https://app.codeship.com/projects/207094) ![](https://img.shields.io/badge/standardjs-%E2%9C%93-brightgreen.svg) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## install

`npm install --save-dev surge-review`

## usage

`$ surge-review`

see `surge-review -h` for common options.  generally, you will setup your CI server for your project to:

- export github & surge tokens (`SURGE_LOGIN`, `SURGE_TOKEN`, & `GH_TOKEN`)
- install this package
- build your website
- run `surge-review` to deploy to `surge.sh` & post a comment to github

### support

- gitlab is not yet supported.  the api calls used are short and sweet. open a PR if you'd like to add it!
- github enterprise _is_ supported. see config options

## configuration

### required

- `SURGE_LOGIN`, email address registered with surge
- `SURGE_TOKEN`, token registered with surge
- `GH_TOKEN`, [github oauth token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
- `GH_PROJECT`, your CI should provide this.
- `GH_OWNER`, your CI should provide this.
  - `GH_PROJECT_OWNER`, such as 'cdaringe/surge-review' can be used in exchange for the above two. for instance, codeship offers up `CI_REPO_NAME`, which === `'cdaringe/surge-review'`, so `GH_PROJECT_OWNER=$CI_REPO_NAME` works
- `GH_PULL_REQUEST`
  - the _number_ of your PR.  this is the number at the end of your PR URL
  - this isn't strictly required--`surge-review` will try to search for the PR number **iff* you also provide a `GH_PULL_BRANCH`

### optional

- `BUILD_ID` your <subdomain>.surge.sh is random by default. add this to make your subdomain `s`urgereview`${BUILD_ID}`
- `GHE` set to true if publishing to GitHub Enterprise
- `GH_DOMAIN` default: github.com
- `GH_PROTOCOL` default: 'https'
- `GH_FOLLOW_REDIRECTS` default: false
