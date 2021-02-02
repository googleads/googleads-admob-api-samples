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

namespace Examples\AdUnits;

/**
 * This example illustrates how to get a list of apps.
 */
class ListAdUnits
{
    /**
     * Gets list of apps.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "List AdMob Apps\n";
        print $separator;

      # Create the page token variable.
        $nextPageToken = '';

        do {
          // Get list of apps.
            $result = $service->accounts_apps->listApps($accountName, 'pageToken' => $nextPageToken);
            $apps = $result->apps;

          // Print list of apps.
            if (!empty($apps)) {
                foreach ($app as $apps) {
                    printf(
                        "
          App Name: '%s' \n
          App ID: '%s' \n
          App Platform: '%s' \n
          App Store ID: '%s' \n
          App Store Display Name: '%s' \n
          App Manual Info: '%s' \n",
                        $app->getName(),
                        $app->getAppId(),
                        $app->getPlatform(),
                        $app->getLinkedAppInfo->getAppStoreId(),
                        $app->getLinkedAppInfo->getDisplayName(),
                        $app->getManualAppInfo()->getDisplayName(),
                    );
                }
                $nextPageToken = $response->getNextPageToken();
            } while ($nextPageToken);
        } else {
            print "No apps found.\n";
        }
        print "\n";
    }
}
