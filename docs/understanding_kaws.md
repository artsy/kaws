# Understanding Kaws

Kaws is the service we use to manage collections at Artsy. It serves two primary
functions:

1. it allows our collections team to upload new collection data
2. it serves collection data to metaphysics on request.

This document is going to step through both processes, walking through the code
to point out tricky areas and potential places where the architecture could be
improved in addition to explicating its operation. In addition we'll itemize the
various npm tasks and look at which cron jobs run regularly.

### Why?

This document is being prepared by Myk Bilokonsky pending his departure from
Artsy to preserve institutional knowledge.

## Function One: Ingesting Collection Data

Our collections team uses a spreadsheet to maintain the current state of our
collections. This spreadsheet is wired up with an HTTP command that sends a POST
request to Kaws containing the spreadsheet ID. Kaws then queries google sheets
to retrieve that sheet and its data, and performs some preprocessing to convert
spreadsheet data into domain models. These models are then persisted in the
local Kaws instance of mongoDB. A collection is specified not as a set of
artworks but rather as a set of constraints - you can think of Kaws as basically
a glorified K/V store where the key is the slug of the collection and the value
is the set of constraints required to build the query that someone would need in
order to instantiate that collection against Gravity.

### Workflow

1. A member of the collections team makes a change to a sheet within the
   [collections document](https://docs.google.com/spreadsheets/d/10O4nqWJdXG9ZXv_yMtgn_-jfNatobcCs9QyfCLqU_ug/edit?usp=sharing).
2. They then invoke the "publish collection to (prod|staging)" command.
3. This sends a POST request to Kaws which is handled in
   [GSheetImport](https://github.com/artsy/kaws/blob/master/src/Routes/GSheetImport.ts#L106).
   <strong>Note:</strong> this endpoint does _not_ wait for the entire operation
   to complete. It will return an error if any errors are thrown in the initial
   handling, but once the database write starts this endpoint will return. This
   means that it's possible for a write to fail at the database layer but no
   notification to be sent to the user. This is currently an artifact of the way
   the google-sheets based workflow is running.
4. After some basic validation, the spreadsheet data is read from Google using
   [GSheetDataFetcher](https://github.com/artsy/kaws/blob/master/src/utils/gSheetDataFetcher.ts#L10),
   which abstracts out communication with Google Sheets.
5. That data is then converted into a domain model using
   [sanitizeRow](https://github.com/artsy/kaws/blob/master/src/utils/processInput.ts#L7)
   -- this is where the mapping between the spreadsheet and the domain model
   happens. When we use comma-delimited lists in Google Sheets, for instance, we
   turn those into arrays, etc.
   1. We always
      [convert](https://github.com/artsy/kaws/blob/master/src/utils/processInput.ts#L35)
      the `description` HTML into Markdown when we can.
   2. We have some assumptions around how price guidance works. Price guidance
      is defined as the price range of the most expensive items in a given
      collection. The idea is that it's a min and a max that can be computed at
      any time given the artworks in some collection. However, it can also be
      manually specified to override what would normally show up. If the
      incoming spreadsheet data provides a value for `price_guidance` then
      that's an indication that we should override the default price guidance
      with the provided value. If not, we clear whatever the current price
      guidance is so that we can recompute it and get an updated value.
   3. We use
      [linked collections](https://github.com/artsy/kaws/blob/master/src/utils/processInput.ts#L42)
      to define Artist Series, Featured Collections and Other collections that
      we want to associate to a given collection. In the google sheet the
      curation team has to be careful to specify slugs in the correct columns,
      delimited by commas.
   4. Finally, we define the
      [query](https://github.com/artsy/kaws/blob/master/src/utils/processInput.ts#L56)
      which will be used to identify which artworks belong in this collection
      whenever the collection is resolved. Note that this query is the only
      relation between the `Collections` in Kaws and the `Artworks` in Gravity,
      and it's one-way because it's an elastic search query. The returned
      artworks have no way to know that they belong to a collection, that
      membership isn't represented anywhere. This isn't helped by the fact that
      collection membership is unstable and may change depending on how the
      query resolves differently over time.
6. Finally, once all data has been converted to domain models we
   [update the database](https://github.com/artsy/kaws/blob/master/src/utils/updateDatabase.ts#L11).
   There's some logic here to ensure that we're upserting, not just inserting.
7. Then we
   [recompute price guidance](https://github.com/artsy/kaws/blob/master/src/utils/updateDatabase.ts#L53)
   on all collections where it's appropriate to do so and save that. This logic
   still makes priceGuidance a _static_ value, though, which is not ideal - but
   at least we're recomputing all price guidance data on every collection
   update, so it's not that stale.
8. (there is no 8 -- see 3 above, the endpoint has already returned either an
   error or a 200!)

### Notes

- The most important part of all of this code is in step 5 -- the place where we
  convert spreadsheet data into domain models. This code is tightly coupled to
  the shape of the spreadsheet, the order of the rows and non-enforceable
  conventions over which columns have which data types. This is precarious code,
  because if a sheet with an out-of-date or otherwise wrong schema gets pushed
  up it could lead to unpredictable results.
- Again, a returned 200 does not guarantee that the data has been successfully
  persisted - but it does mean that no validation errors were found.

## Function Two: Serving Collection Data

Whenever the Kaws MongoDB schema is changed a new GraphQL schema is generated.
This schema is copied over to metaphysics so that MP is able to query Kaws using
appropriate and accurate fields. Whenever some user-facing operation requires a
collection, MP queries Kaws for the definition of that collection and then uses
that definition to generate a list of artworks to return. This is just
bog-standard GraphQL without anything too complicated to go over. Whenever you
change the database schemas for anything here in Kaws, though, you should
remember to follow the steps outlined in the readme to `dumpSchema` and PR the
changes into metaphysics!

## Cron Jobs

There are three daily cron jobs that run on Kaws production (see
hokusai/production.yaml)

### kaws-update-sailthu

Every day we run `utils/updateSailthru` in order to publish our latest
collection state to sailthru. It's pretty straightforward!

### kaws-update-elastic-search

This job runs every day and keeps our collection metadata up to date. It's
responsible for doing things like pulling an updated image every day, etc. You
can find more information in `utils/indexForSearch`

### kaws-update-site-map

This job runs every day and just adds all collection URLs to a sitemap by
generating URLs based on collection slug. It's really straightforward - see
`utils/updateSitemap` for the logic.
