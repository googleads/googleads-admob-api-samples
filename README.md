# AdMob Reporting API Java Samples

This collection of samples written in Java provide usage examples for the AdMob Reporting API.

## Prerequisites

Please make sure that you're running Java 7+ and have Maven installed.

## Setup Authentication

This API uses OAuth 2.0. See [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2) to learn more.

Or, if you'd like to dive right in, follow these steps.

1. Visit https://console.developers.google.com to register your application.
2. From the API Manager -> Google APIs screen, activate access to **AdMob API**.
3. Click on **Credentials** in the left navigation menu.
4. Click the button labeled **Create credentials** and select **OAuth Client ID**.
5. Select **Other** as the **Application type**, then **Create**.
6. From the Credentials page, click **Download JSON** next to the client ID you just created and save the file as `client_secrets.json` in the samples project directory.

## Set up your environment ##
### Via the command line ###

Execute the following command in the directory where the pom.xml file exists. This file is found in the root directory of the AdMob API Java client library samples.

    $ mvn compile

### Via Intellij ###

Import the sample

1. Select **Import Project** and find the root directory of this example on your machine.
2. Select **Import project from external model** and **Maven**, then click **Next**.
3. Check **Import Maven projects automatically** and **Search for projects recursively**, then click **Next**.
4. Continue to click **Next**, until you can select **Finish**.

## Running the Examples ##

Once you've checked out the code:

1. Open a sample and fill in any prerequisite values. Required values will be declared as constants near the top of the file.

2. Run the sample.
    1. Via Intellij, right-click on the sample and select **Run &lt;sample_name&gt;.main()**.

3. Complete the authorization steps on your browser.

4. Examine the console output, and explore the AdMob Reporting API!