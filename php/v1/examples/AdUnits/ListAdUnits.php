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

namespace Examples\AdUnits;

/**
 * This example illustrates how to get a list of ad units.
 */
class ListAdUnits
{
    /**
     * Gets list of ad units.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName, $maxPageSize)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "List AdMob Ad Units\n";
        print $separator;

        // [START main_body]
        // Create the page token variable.
        $pageToken = '';

        $optParams['pageSize'] = $maxPageSize;

        do {
            $optParams['pageToken'] = $pageToken;
            // Get list of ad units.
            $response = $service->accounts_adUnits->listAccountsAdUnits($accountName, $optParams);
            $adUnits = $response->adUnits;

            // Print list of ad units.
            if (!empty($adUnits)) {
                foreach ($adUnits as $adUnit) {
                    printf(
                      "Ad Unit Display Name: '%s' \n"
                      ."Ad Unit Name: '%s' \n"
                      ."Ad Unit ID: '%s' \n"
                      ."Ad Unit Format: '%s' \n"
                      ."Ad Unit App ID: '%s' \n"
                      ."Ad Unit Ad Types: '%s' \n\n",
                      $adUnit->getDisplayName(),
                      $adUnit->getName(),
                      $adUnit->getAdUnitId(),
                      $adUnit->getAdFormat(),
                      $adUnit->getAppId(),
                      json_encode($adUnit->getAdTypes()),
                        );
                }
            }
            $pageToken = $response->getNextPageToken();
        } while ($pageToken);
        // [END main_body]
      
        print "\n";
    }
}
