# Kaws

Named after [the artist](https://artsy.net/artist/kaws), kaws is a backend
service that powers [artsy.net](https://artsy.net) collection pages. What are
collections you ask? A Collection is a prefiltered version of Artsy's
[Collect](https://artsy.net/collect) page for marketing purposes.

## Meta [![CircleCI](https://circleci.com/gh/artsy/kaws.svg?style=svg)](https://circleci.com/gh/artsy/kaws) [![codecov](https://codecov.io/gh/artsy/kaws/branch/master/graph/badge.svg)](https://codecov.io/gh/artsy/kaws)

- **State:** Production
- **Production:** [http://kaws.artsy.net](http://kaws.artsy.net/playground) |
  [k8s](https://kubernetes.artsy.net/#!/deployment/default/kaws-web?namespace=default)
- **Staging:**
  [http://kaws-staging.artsy.net](http://kaws-staging.artsy.net/playground) |
  [k8s](https://kubernetes-staging.artsy.net/#!/search?q=kaws&namespace=default)
- **GitHub:** [https://github.com/artsy/kaws/](https://github.com/artsy/kaws/)
- **CI:** [CircleCI](https://circleci.com/gh/artsy/kaws); merged PRs to
  artsy/kaws#master are automatically deployed to staging. PRs from `staging` to
  `release` are automatically deployed to production.
  [Start a deploy...](https://github.com/artsy/kaws/compare/release...staging?expand=1)
- **Point People:** [@mbilokonsky](https://github.com/mbilokonsky),
  [@xtina-starr](https://github.com/xtina-starr)

## Prerequisites

- node.js 8.12.0 or newer
- yarn 1.10.1 or newer
- MongoDB 4.x

## Note on Google API Access

KAWS exposes an `/upload` endpoint meant to be invoked from a google sheet. In
order for this process to work a few environment values must be supplied:

1. `GOOGLE_API_KEY`
1. `GOOGLE_CLIENT_ID`
1. `GOOGLE_CLIENT_SECRET`
1. `SPREADSHEET_IDS_ALLOWLIST`

See the hokusai and/or the **Kaws Credentials** secure note in 1passsword for
current values of these.

If it becomes necessary to re-generate these credentials in staging and
production — as has happened a couple of times in the past — you can follow
[these instructions](docs/google_credentials.md).

For local development, you can run `yarn test-google-config` to see if your
local .env file's values for `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and
`SPREADSHEET_IDS_ALLOWLIST` validate.

## Getting started

First, make sure to install dependencies:

```bash
yarn
```

We use the `.env` file to load environment-specific variables. Copy
`.env.example` to `.env` so [dotenv](https://www.npmjs.com/package/dotenv) will
automatically load them upon app boot:

```bash
cp .env.example .env
```

Usually you do not have to change them, but if you need, update the variables to
match your local development setup.

Once this is done, the next step would be to load test data. The collection data
is maintained by Artsy's marketing team
[in Google Drive as a spreadsheet](https://docs.google.com/spreadsheets/d/1K-FBuIQYiU75ETBEgU0YuexznElKCLi5Tr_P2bqkFZw/edit#gid=23745674)
(you need an `@artsymail.com` account). Download it as a CSV file (in this case
saved as `collections.csv`) and try running the command below to load the data
to your local MongoDB instance:

```bash
yarn update-database ./collections.csv
```

Finally, start the server by running the command below:

```bash
yarn dev
# or
hokusai dev start
```

Then open http://localhost:4000/playground and you should see Apollo's GraphQL
Playground. Try running the GraphQL query below, and if you see real collections
data coming back from the database you are good to go!

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
# or
hokusai test
```

## Did you change the GraphQL schema?

Metaphysics is the current consumer of Kaws GraphQL schema, and keeps a copy of
its latest schema in https://github.com/artsy/metaphysics/tree/master/src/data.
If you have made changes to the Kaws GraphQL schema, make sure you also update
the copy of this schema in Metaphysics. In order to do so follow these steps:

1. In kaws run

```shell
yarn dump-schema
```

2. copy the `_schema.graphql` file generated ☝🏼 to `kaws.graphql`

```shell
cp _schema.graphql kaws.graphql
```

3. move the file above to your local Metaphysics under `src/data` and make a PR
   to Metaphysics with this change.

## Updating the sitemap for Collect

When we update the production database with the `update-database` command, we
also need to inform Google of the updates so newly added collections will be
crawled. This could be done with the `update-sitemap` command. This comamnd
needs to be run in the k8s container as it neeeds to point to the production
databse:

```bash
hokusai production run 'yarn update-sitemap'
```

## About Artsy

<a href="https://www.artsy.net/">
  <img align="left" src="https://avatars2.githubusercontent.com/u/546231?s=200&v=4"/>
</a>

This project is the work of engineers at [Artsy][footer_website], the world's
leading and largest online art marketplace and platform for discovering art. One
of our core [Engineering Principles][footer_principles] is being [Open Source by
Default][footer_open] which means we strive to share as many details of our work
as possible.

You can learn more about this work from [our blog][footer_blog] and by following
[@ArtsyOpenSource][footer_twitter] or explore our public data by checking out
[our API][footer_api]. If you're interested in a career at Artsy, read through
our [job postings][footer_jobs]!

[footer_website]: https://www.artsy.net/
[footer_principles]: https://github.com/artsy/README/blob/master/culture/engineering-principles.md
[footer_open]: https://github.com/artsy/README/blob/master/culture/engineering-principles.md#open-source-by-default
[footer_blog]: https://artsy.github.io/
[footer_twitter]: https://twitter.com/ArtsyOpenSource
[footer_api]: https://developers.artsy.net/
[footer_jobs]: https://www.artsy.net/jobs
