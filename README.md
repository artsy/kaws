kaws
===

Named after [the artist](https://artsy.net/artist/kaws), kaws is a backend service that powers [artsy.net](https://artsy.net) collection pages. What are collections you ask? A Collection is a prefiltered version of Artsy's [Collect](https://artsy.net/collect) page for marketing purposes.

[![CircleCI](https://circleci.com/gh/artsy/kaws.svg?style=svg)](https://circleci.com/gh/artsy/kaws)
* __State:__ in development
* __Production:__ [k8s](https://kubernetes.artsy.net/#!/deployment/default/kaws-web?namespace=default)
* __Staging:__  [http://kaws-staging.artsy.net](http://kaws-staging.artsy.net/playground) | [k8s](https://kubernetes-staging.artsy.net/#!/search?q=kaws&namespace=default)
* __Github:__ [https://github.com/artsy/kaws/](https://github.com/artsy/kaws/)
* __CI:__ [CircleCI](https://circleci.com/gh/artsy/kaws); merged PRs to artsy/kaws#master are automatically deployed to staging. PRs from `staging` to `release` are automatically deployed to production. [Start a deploy...](https://github.com/artsy/kaws/compare/release...staging?expand=1)
* **Point People:** [@l2succes](https://github.com/l2succes)

## Prerequisites

 * node.js 8.12.0 or newer
 * yarn 1.10.1 or newer
 * MongoDB 4.x


## Getting started

First, make sure to install dependencies:

```bash
yarn
```

We use the `.env` file to load environment-specific variables. Copy `.env.example` to `.env` so
[dotenv](https://www.npmjs.com/package/dotenv) will automatically load them upon app boot:
 
```bash
cp .env.example .env
```

Usually you do not have to change them, but if you need, update the variables to match your local development setup.

Once this is done, the next step would be to load test data. This repository
[also hosts fixtures](https://github.com/artsy/kaws/tree/master/fixtures) that could be used in development. Try running
the command below to load the fixture data to your local MongoDB instance:  

```bash
yarn bootstrap-data
```

> As of writing, this command doesn't exit automatically. You can kill the process once you confirm the data is in the
> db.

Finally, start the server by running the command below:

```bash
yarn start
```

Then open http://localhost:4000/playground and you should see Apollo's GraphQL Playground. Try running the GraphQL query
below, and if you see `"KAWS, Companions"` and `"Pablo Picasso, Lithographs"` you are good to go! 


```graphql
query {
  collections {
    id
    slug
    title
  }
}
```

## Testing

```sh
yarn jest
```
