<?php

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/************************************************
  ATTENTION: Change this path to point to your vendor folder if your project
  directory structure differs from this repository's!
 ************************************************/

require_once __DIR__ . '/vendor/autoload.php';

use Examples\Reports\GenerateMediationReport;
use Examples\Reports\GenerateNetworkReport;
use Examples\Accounts\ListAccounts;
use Examples\Accounts\GetAccount;

use function HtmlHelper\pageHeader;
use function HtmlHelper\pageFooter;

session_start();

// Configure token storage on disk.
// Store refresh tokens in a local disk file.
define('STORE_ON_DISK', true);
define('TOKEN_FILENAME', 'tokens.dat');

$client = new Google_Client();
$client->addScope('https://www.googleapis.com/auth/admob.report');
$client->setApplicationName('AdMob API PHP Quickstart');
$client->setAccessType('offline');

// Be sure to replace the contents of client_secrets.json with your developer
// credentials.
$client->setAuthConfig('client_secrets.json');

$service = new Google_Service_AdMob($client);

// If we're logging out we just need to clear our local access token.
// Note that this only logs you out of the session. If STORE_ON_DISK is
// enabled and you want to remove stored data, delete the file.
if (isset($_REQUEST['logout'])) {
    unset($_SESSION['access_info']);
}

// Configure redirect uri to return to main page once the authentication workflow has completed.
$redirectUri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$client->setRedirectUri($redirectUri);

// If we have a code back from the OAuth 2.0 flow, we need to exchange that
// with the authenticate() function. We store the resultant access token
// bundle in the session (and disk, if enabled), and redirect to this page.
if (isset($_GET['code'])) {
    $client->authenticate($_GET['code']);
    // Note that "getAccessToken" actually retrieves an object containing both the
    // access and refresh tokens as fields, assuming both are available.
    $_SESSION['access_info'] = $client->getAccessToken();
    if (STORE_ON_DISK) {
        file_put_contents(TOKEN_FILENAME, $_SESSION['access_info']);
    }
    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
    exit;
}

// If we have an access token, we can make requests, else we generate an
// authentication URL.
if (isset($_SESSION['access_info']) && $_SESSION['access_info']) {
    $client->setAccessToken($_SESSION['access_info']);
} elseif (
    STORE_ON_DISK && file_exists(TOKEN_FILENAME) &&
      filesize(TOKEN_FILENAME) > 0
) {
    // Note that "setAccessToken" actually sets both the access and refresh token,
    // assuming both were saved.
    $client->setAccessToken(file_get_contents(TOKEN_FILENAME));
    $_SESSION['access_info'] = $client->getAccessToken();
} else {
    // If we're doing disk storage, generate a URL that forces user approval.
    // This is the only way to guarantee we get back a refresh token.
    if (STORE_ON_DISK) {
        $client->setApprovalPrompt('force');
    }
    $authUrl = $client->createAuthUrl();
}

if (isset($authUrl)) {
    // No access token found, show the link to generate one
    printf("<a class='login' href='%s'>Login!</a>", $authUrl);
} else {
    print "<a class='logout' href='?logout'>Logout</a>";
}

echo pageHeader('AdMob API samples');

if ($client->getAccessToken()) {
    echo '<pre class="result">';
    // Now we're signed in, we can make our requests.
    makeRequests($service);
    // Note that we re-store the access_info bundle, just in case anything
    // changed during the request - the main thing that might happen here is the
    // access token itself is refreshed if the application has offline access.
    $_SESSION['access_info'] = $client->getAccessToken();
    echo '</pre>';
}

echo '</div>';
echo pageFooter(__FILE__);

// Makes all the API requests.
function makeRequests($service)
{
   /*
    * The first account from the list of accounts is being used as input
    * for the following requests.
    *
    * For other accounts, replace 'account_name' below which follows the format
    * "accounts/pub-XXXXXXXXXXXXXXXX".
    * See https://support.google.com/admob/answer/2784578
    * for instructions on how to find your account name.
    */
    $accountName = ListAccounts::getFirstAccountName($service);

    if (isset($accountName)) {
        ListAccounts::run($service);
        GetAccount::run($service, $accountName);
        GenerateNetworkReport::run($service, $accountName);
        GenerateMediationReport::run($service, $accountName);
    } else {
        echo 'Please specify the account_name, which should follow a format of
            "accounts/pub-XXXXXXXXXXXXXXXX".
            See https://support.google.com/admob/answer/2784578
            Sfor instructions on how to find your account name.';
    }
}
