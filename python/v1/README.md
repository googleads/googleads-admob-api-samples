# AdMob API Python Samples

This collection of samples written in Python provide usage examples for the AdMob API.

## Prerequisites

Please make sure that you have [pip](https://pip.pypa.io/en/stable/installing/) installed and Python 3.5 or higher.

## Setup Authentication

This API uses OAuth 2.0. See [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2) to learn more.

To get started quickly, follow these steps.

1. Visit https://console.developers.google.com to register your application.
1. From the [API Library](https://console.cloud.google.com/start/api?id=admob.googleapis.com), enable
   the **AdMob API**.
1. Click on **APIs & Services > Credentials** in the left navigation menu.
1. Click **CREATE CREDENTIALS > OAuth client ID**.
1. Select **Desktop app** as the application type, give it a name, then click
   **Create**.
1. From the Credentials page, click **Download JSON** next to the client ID you
   just created and save the file as `client_secrets.json` in the root directory
   of the samples.

## Set up your environment ##
### Via the command line ###

Execute the following command in the root directory of the AdMob API Python client library samples to install the dependencies.

    $ pip install --upgrade google-api-python-client
    $ pip install --upgrade google-auth-oauthlib

## Running the Examples ##

Before proceeding with the following steps, make sure you are in the root directory of the AdMob API Python client library samples.

1. Open an example and replace the **PUBLISHER_ID** constant with your Publisher ID.

1. To run the sample, execute the following command.

        $ python <sample_name>

1. Complete the authorization steps in the browser.

1. Enter the authorization code in the terminal surrounded by double quotes,
   for example, "AUTHORIZATION_CODE".

1. Enjoy exploring the AdMob API!
