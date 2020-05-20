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
 * This example illustrates how to generate a mediation report.
 */
class GenerateMediationReport
{
    /**
     * Generates a mediation report.
     *
     * @param $service Google_Service_AdMob AdMob service object on which to
     *     run the requests.
     * @param account_name which follows the format "accounts/pub-XXXXXXXXXXXXXXXX".
     */
    public static function run($service, $accountName)
    {
        $separator = str_repeat('=', 80) . "\n";
        print $separator;
        print "Get Mediation Report\n";
        print $separator;

        // Generate mediation report.
        $mediationReportRequest = self::createMediationReportRequest();
        $mediationReportResponse = $service->accounts_mediationReport->generate(
            $accountName,
            $mediationReportRequest
        );

        // Convert mediation report response to a simple object.
        $mediationReportResponse = $mediationReportResponse->tosimpleObject();

        // Print each record in the report.
        if (!empty($mediationReportResponse)) {
            foreach ($mediationReportResponse as $record) {
                printf("'%s' \n", json_encode($record));
            }
        } else {
            print "No report found.\n";
        }
        print "\n";
    }

    /**
     * Generates a mediation report request.
     */
    public static function createMediationReportRequest()
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

        // Specify sorting conditions.
        $sortConditions = new \Google_Service_AdMob_MediationReportSpecSortCondition();
        $sortConditions->setOrder('ASCENDING');
        $sortConditions->setMetric('CLICKS');

        // Specify dimension filters.
        $countries = new \Google_Service_AdMob_StringList();
        $countries->setValues(['CA', 'US']);
        $dimensionFilterMatches = new \Google_Service_AdMob_MediationReportSpecDimensionFilter();
        $dimensionFilterMatches->setDimension('COUNTRY');
        $dimensionFilterMatches->setMatchesAny($countries);

        // Create mediation report specification.
        $reportSpec = new \Google_Service_AdMob_MediationReportSpec();
        $reportSpec->setMetrics(['CLICKS', 'ESTIMATED_EARNINGS']);
        $reportSpec->setDimensions(['APP', 'AD_SOURCE', 'COUNTRY']);
        $reportSpec->setDateRange($dateRange);
        $reportSpec->setDimensionFilters($dimensionFilterMatches);
        $reportSpec->setSortConditions($sortConditions);

        // Create mediation report request.
        $mediationReportRequest = new \Google_Service_AdMob_GenerateMediationReportRequest();
        $mediationReportRequest->setReportSpec($reportSpec);

        return $mediationReportRequest;
    }
}
