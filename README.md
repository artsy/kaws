# kaws

Named after [the artist](https://artsy.net/artist/kaws), kaws is a backend
service that powers [artsy.net](https://artsy.net) collection pages. What are
collections you ask? A Collection is a prefiltered version of Artsy's
[Collect](https://artsy.net/collect) page for marketing purposes.

## Meta [![CircleCI](https://circleci.com/gh/artsy/kaws.svg?style=svg)](https://circleci.com/gh/artsy/kaws) [![codecov](https://codecov.io/gh/artsy/kaws/branch/master/graph/badge.svg)](https://codecov.io/gh/artsy/kaws)

- **State:** production
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
order for this process to work a few constraints have to hold:

1. `GOOGLE_CLIENT_ID` must be set - currently, the value we are using for this
   is the EMAIL ADDRESS of the Goole Service Account created for this purpose.
   See
   [this page](https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=1&orgonly=true&project=project-id-9346371200481951628&supportedpurview=organizationId)
   for more information, but please make sure you're logged in using `it@` to
   see it.
1. `GOOGLE_CLIENT_SECRET` must be set - this is a private key, and as such
   contains line-breaks. Those line-breaks must be represented in the .env file
   as simple `\n` characters!
1. `SPREADSHEET_IDS_ALLOWLIST` is badly named - this is just the ID of the
   spreadsheet you want to use. Currently there is exactly one such spreadsheet
   and its ID is floating around, ask anyone on grow or galleries, or just run
   `hokusai staging env get` to see what's being used there.
1. You can run `yarn test-google-config` to see if your local .env file's values
   for `GOOGLE_CLOUD_ID`, `GOOGLE_CLOUD_SECRET` and `SPREADSHEET_IDS_ALLOWLIST`
   validate.

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
