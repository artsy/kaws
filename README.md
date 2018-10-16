kaws
===

Named after [the artist](https://artsy.net/artist/kaws), kaws is a backend service that powers [artsy.net](https://artsy.net) collection pages. What are collections you ask? A Collection is a prefiltered version of Artsy's [Collect](https://artsy.net/collect) page for marketing purposes.

[![CircleCI](https://circleci.com/gh/artsy/kaws.svg?style=svg)](https://circleci.com/gh/artsy/kaws)
* __State:__ in development
* __Production:__ [k8s](https://kubernetes.artsy.net/#!/deployment/default/kaws-web?namespace=default)
* __Staging:__  [http://kaws-staging.artsy.net](http://kaws-staging.artsy.net/playground) | [k8s](https://kubernetes-staging.artsy.net/#!/search?q=kaws&namespace=default)
* __Github:__ [https://github.com/artsy/positron/](https://github.com/artsy/kaws/)
* __CI:__ [CircleCI](https://circleci.com/gh/artsy/kaws); merged PRs to artsy/kaws#master are automatically deployed to staging. PRs from `staging` to `release` are automatically deployed to production. [Start a deploy...](https://github.com/artsy/kaws/compare/release...staging?expand=1)
* **Point People:** [@l2succes](https://github.com/l2succes)

## How do I work on this?

```sh
git clone https://github.com/artsy/kaws.git
cd kaws
yarn install

# Open VS Code with `code .`

# Run tests
yarn jest
```

