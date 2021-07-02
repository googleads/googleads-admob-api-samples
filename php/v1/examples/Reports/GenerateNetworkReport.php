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

namespace Examples\Reports;

use Examples\Utils\DateUtils;

/**
 * This example illustrates how to generate a network report.
 */
class GenerateNetworkReport
{
    // [START main_body]
    /**
     * Generates a network report.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "Get Network Report\n";
        print $separator;

        // Generate network report.
        $networkReportRequest = self::createNetworkReportRequest();
        $networkReportResponse = $service->accounts_networkReport->generate(
            $accountName,
            $networkReportRequest
        );

        // Convert network report response to a simple object.
        $networkReportResponse = $networkReportResponse->tosimpleObject();

        // Print each record in the report.
        if (!empty($networkReportResponse)) {
            foreach ($networkReportResponse as $record) {
                printf("'%s' \n", json_encode($record));
            }
        } else {
            print "No report found.\n";
        }
        print "\n";
    }

    /**
     * Generates a network report request.
     */
    public static function createNetworkReportRequest()
    {
        /*
         * AdMob API only supports the account default timezone and
         * "America/Los_Angeles", see
         * https://developers.google.com/admob/api/v1/reference/rest/v1/accounts.mediationReport/generate
         * for more information.
         */
        $startDate = DateUtils::oneWeekBeforeToday();
        $endDate = DateUtils::today();

        // Specify date range.
        $dateRange = new \Google_Service_AdMob_DateRange();
        $dateRange->setStartDate($startDate);
        $dateRange->setEndDate($endDate);

        // Create network report specification.
        $reportSpec = new \Google_Service_AdMob_NetworkReportSpec();
        $reportSpec->setMetrics(['IMPRESSIONS', 'MATCH_RATE']);
        $reportSpec->setDimensions(['FORMAT', 'AD_UNIT']);
        $reportSpec->setDateRange($dateRange);

        // Create network report request.
        $networkReportRequest = new \Google_Service_AdMob_GenerateNetworkReportRequest();
        $networkReportRequest->setReportSpec($reportSpec);

        return $networkReportRequest;
    }
    // [END main_body]
}
