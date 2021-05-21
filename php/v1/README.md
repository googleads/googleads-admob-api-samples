# AdMob API PHP Samples

This collection of samples written in PHP provide usage examples for the AdMob API.

## Prerequisites

Please make sure that you have [Composer](https://getcomposer.org/download/) installed and are running PHP 7.2 or higher.


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

Execute the following command in the root directory of the AdMob API PHP client library samples to install the dependencies.

    $ composer install

## Running the Examples ##

Before proceeding with the following steps, make sure you are in the root directory of the AdMob API PHP client library samples.

1.  To run the samples, execute the following command.

        $ php -S localhost:8000 index.php

1. [Open the sample](http://localhost:8000/index.php) in your browser.

1. Complete the authorization steps.

1. Select an example and provide the required information, and explore the AdMob API!
