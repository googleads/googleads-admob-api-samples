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
 * This example illustrates how to get a list of accounts.
 */
class ListAccounts
{
    /**
     * Gets list of accounts.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     */
    public static function run($service)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "List AdMob Accounts\n";
        print $separator;

        // [START main_body]
        // Lists the AdMob publisher account that was most recently signed in to from the
        // AdMob UI. For more information, see https://support.google.com/admob/answer/10243672.
        $result = $service->accounts->listAccounts();
        $accounts = $result->account;

        // Print account information.
        if (!empty($accounts)) {
            foreach ($accounts as $account) {
                printf(
                    "
          Account Name: '%s' \n
          Publisher Id: '%s' \n
          Currency Code: '%s' \n
          Reporting Time Zone: '%s' \n",
                    $account->getName(),
                    $account->getPublisherId(),
                    $account->getCurrencyCode(),
                    $account->getReportingTimezone()
                );
            }
        } else {
            print "No accounts found.\n";
        }
        // [END main_body]
        print "\n";
    }

    /*
     * Gets name of the first account.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @return account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function getFirstAccountName($service)
    {
        // Get list of accounts.
        $result = $service->accounts->listAccounts();
        $accounts = $result->account;

        // Return first account name.
        return $accounts[0]->getName();
    }
}
