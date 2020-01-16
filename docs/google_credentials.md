# Recreating credentials for the Kaws ingestion script

The Kaws ingestion script — which lives inside the current Collections sheet
under **Tools > Script Editor > `forms.gs`** — requires certain Google Cloud
Platform credentials.

If it becomes necessary to re-generate those credentials you can do so as
follows:

1. Log into https://console.cloud.google.com with it@ credentials from 1password

2. Get yourself to the right project:
   [the KAWS project under the ARTSYMAIL.COM org](https://console.cloud.google.com/apis/credentials?project=kaws-1543434340529).
   (Look at for a dropdown in the global nav, just to the right of "Google Cloud
   Platform")

3. Go to **Create credentials** > **API key**

4. Go to **Create credentials** > **Service account key**

   - Service account: Kaws Sheets API
   - Key type: JSON

5. Locate the downloaded JSON file, and add it to the **Kaws Credentials**
   secure note in 1password (and remove the older one presumably)

6. Update the deployed app's environment to use the new credentials, i.e.

   ```sh
   # from API key
   hokusai staging env set 'GOOGLE_API_KEY=42424242'

   # from Service account key
   hokusai staging env set 'GOOGLE_CLIENT_ID=987654321'
   hokusai staging env set 'GOOGLE_CLIENT_SECRET=-----BEGIN PRIVATE KEY-----\nWOO\nHOO\n-----END PRIVATE KEY-----\n'

   hokusai staging refresh
   ```

7. If you are testing from a copy of the main spreedsheet rather than the
   original instance that curators use, then you will need to add that sheet's
   id to the environment as well:

   ```sh
   hokusai staging env set 'SPREADSHEET_IDS_ALLOWLIST=the_original_one,your_test_copy'

   hokusai staging refresh
   ```

8. Finally, it may be necessary for you or other end users to revoke permissions
   from older versions of the client app
   https://myaccount.google.com/permissions > Security > Manage third-party
   access > Update Collections > Remove access
