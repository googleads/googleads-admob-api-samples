<?php

/*
 * Copyright 2021 Google LLC
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

namespace Examples\Apps;

/**
 * This example illustrates how to get a list of apps.
 */
class ListApps
{
    /**
     * Gets list of apps.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName, $maxPageSize)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "List AdMob Apps\n";
        print $separator;

        // Create the page token variable.
        $pageToken = '';

        $optParams['pageSize'] = $maxPageSize;

        do {
            $optParams['pageToken'] = $pageToken;
            // Get list of apps.
            $response = $service->accounts_apps->listAccountsApps($accountName, $optParams);
            $apps = $response->getApps();

            // Print list of apps.
            if (!empty($apps)) {
                foreach ($apps as $app) {
                    if(!empty($app->getLinkedAppInfo)){
                        $appStoreId = $app->getLinkedAppInfo()->getAppStoreId();
                        $displayName = $app->getLinkedAppInfo()->getDisplayName();
                    } else {
                        $appStoreId = '';
                        $displayName = '';
                    }
                    printf(
                      "App Name: '%s' \n"
                      ."App ID: '%s' \n"
                      ."App Platform: '%s' \n"
                      ."App Store ID: '%s' \n"
                      ."App Store Display Name: '%s' \n"
                      ."App Display Name: '%s' \n\n",
                      $app->getName(),
                      $app->getAppId(),
                      $app->getPlatform(),
                      $appStoreId,
                      $displayName,
                      $app->getManualAppInfo()->getDisplayName(),
                    );
                }
            }
            $pageToken = $response->getNextPageToken();
        } while ($pageToken);

        print "\n";
    }
}
