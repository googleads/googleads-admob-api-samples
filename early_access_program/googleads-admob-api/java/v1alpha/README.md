# AdMob API v1alpha Java Samples

This collection of samples written in Java provide usage examples for the
v1alpha AdMob API.

## Prerequisites

Please make sure that you're running Java 7+ and have Maven installed.

## Set up your environment ##
### Via the command line ###

1. Download the AdMob API v1alpha java client library.
1. Extract the archive and then install the client library as a local maven
   artifact.

       $ tar -xf google-api-services-admob-v1alpha-rev0-1.25.0.tar.gz

1. In the extracted folder, move to the `google-api-services-admob-v1alpha-rev0-1.25.0/target`
   directory and run the following commands.

       $ jar xf google-api-services-admob-v1alpha-rev0-1.25.0-sources.jar
       $ mvn install:install-file -Dfile=google-api-services-admob-v1alpha-rev0-1.25.0.jar \
         -Dsources=google-api-services-admob-v1alpha-rev0-1.25.0-sources.jar \
         -DpomFile=pom.xml

1. From the **AdMob API v1alpha Java samples** directory, execute the following
   command in the directory where the `pom.xml` file exists. This file is found
   in the root directory of the v1alpha AdMob API Java client library samples.

       $ mvn compile

## Setup Authentication

This API uses OAuth 2.0. See [Using OAuth 2.0 to Access Google APIs](https://developers.google.com/identity/protocols/oauth2)
to learn more.

To get started quickly, follow these steps.

1. From the [API Library](https://console.cloud.google.com/apis/library), enable
   the **AdMob API**.
1. Click on **APIs & Services > Credentials** in the left navigation menu.
1. Click **CREATE CREDENTIALS > OAuth client ID**.
1. Select **Desktop app** as the application type, give it a name, then click
   **Create**.
1. From the Credentials page, click **Download JSON** next to the client ID you
   just created and save the file as `client_secrets.json` in the
   */main/resources/* directory



### Via Intellij ###

Import the sample

1. Select **Import Project** and find the root directory of the AdMob API Java
   v1alpha samples on your machine.
1. Select **Import project from external model** and **Maven**, then click
   **Next**.
1. Check **Import Maven projects automatically** and **Search for projects
   recursively**, then click **Next**.
1. Continue to click **Next**, until you can select **Finish**.

## Running the Examples ##

Once you've checked out the code:

1. Open a sample and fill in any prerequisite values. Required values will be
   declared as constants near the top of the file.

1. Run the sample.
    1. Via Intellij, right-click on the sample and select
       **Run &lt;sample_name&gt;.main()**.

1. Complete the authorization steps on your browser.

1. Examine the console output, and explore the AdMob API!
