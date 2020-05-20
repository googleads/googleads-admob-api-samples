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

namespace Examples\Accounts;

/**
 * This example illustrates how to get information on an account.
 */
class GetAccount
{
    /**
     * Gets account.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "Get AdMob Account\n";
        print $separator;

        // Get account.
        $result = $service->accounts->get($accountName);

        // Print account information.
        if (!empty($result)) {
            printf(
                "
          Account Name: '%s' \n
          Publisher Id: '%s' \n
          Currency Code: '%s' \n
          Reporting Time Zone: '%s' \n",
                $result->getName(),
                $result->getPublisherId(),
                $result->getCurrencyCode(),
                $result->getReportingTimezone()
            );
        } else {
            print "No accounts found.\n";
        }
        print "\n";
    }
}
