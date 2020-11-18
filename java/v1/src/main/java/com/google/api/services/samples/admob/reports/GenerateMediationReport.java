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

package com.google.api.services.samples.admob.reports;

import com.google.api.client.googleapis.util.Utils;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.services.admob.v1.AdMob;
import com.google.api.services.admob.v1.model.Date;
import com.google.api.services.admob.v1.model.DateRange;
import com.google.api.services.admob.v1.model.GenerateMediationReportRequest;
import com.google.api.services.admob.v1.model.GenerateMediationReportResponse;
import com.google.api.services.admob.v1.model.MediationReportSpec;
import com.google.api.services.admob.v1.model.MediationReportSpecDimensionFilter;
import com.google.api.services.admob.v1.model.MediationReportSpecSortCondition;
import com.google.api.services.admob.v1.model.StringList;
import com.google.api.services.samples.admob.AdMobFactory;
import com.google.api.services.samples.admob.util.DateUtils;
import com.google.common.collect.ImmutableList;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** This example illustrates how to generate a mediation report. */
public class GenerateMediationReport {
  /* ACCOUNT_NAME should follow the format "accounts/pub-XXXXXXXXXXXXXXXX"
   * where "pub-XXXXXXXXXXXXXXXX" is your publisher ID
   * See https://support.google.com/admob/answer/2784578
   * for instructions on how to find your publisher ID.
   */
  private static final String ACCOUNT_NAME = "accounts/pub-XXXXXXXXXXXXXXXX";

  public static void runExample(
      AdMob adMob, String accountName, GenerateMediationReportRequest request)
      throws Exception {

    // Get mediation report.
    InputStream response =
        adMob
            .accounts()
            .mediationReport()
            .generate(accountName, request)
            .executeAsInputStream();

    List<GenerateMediationReportResponse> result =
        Arrays.asList(
            new JsonObjectParser(Utils.getDefaultJsonFactory())
                .parseAndClose(
                    response, StandardCharsets.UTF_8, GenerateMediationReportResponse[].class));

    // Print each record in the response stream.
    for (GenerateMediationReportResponse record : result) {
      System.out.printf("%s%n", record);
    }
  }

  public static GenerateMediationReportRequest getMediationReportRequest() {
    /* AdMob API only supports the account default timezone and "America/Los_Angeles", see
     * https://developers.google.com/admob/api/v1/reference/rest/v1/accounts.mediationReport/generate
     * for more information.
     */
    String timeZone = "America/Los_Angeles";
    Clock clock = Clock.system(ZoneId.of(timeZone));

    // Specify date range.
    Date startDate = DateUtils.daysBeforeNow(clock, 30);
    Date endDate = DateUtils.today(clock);
    DateRange dateRange = new DateRange().setStartDate(startDate).setEndDate(endDate);

    // Specify metrics.
    ImmutableList<String> metrics = ImmutableList.of("CLICKS", "ESTIMATED_EARNINGS");

    // Specify dimensions.
    ImmutableList<String> dimensions = ImmutableList.of("APP", "AD_SOURCE", "COUNTRY");

    // Specify sorting conditions.
    List<MediationReportSpecSortCondition> sortConditions =
        new ArrayList<MediationReportSpecSortCondition>();
    sortConditions.add(
        new MediationReportSpecSortCondition().setOrder("ASCENDING").setMetric("CLICKS"));

    // Specify dimension filters.
    ImmutableList<String> countryList = ImmutableList.of("CA", "US");
    StringList dimensionFilterMatches = new StringList().setValues(countryList);
    List<MediationReportSpecDimensionFilter> dimensionFilters = new ArrayList<>();
    dimensionFilters.add(
        new MediationReportSpecDimensionFilter()
            .setDimension("COUNTRY")
            .setMatchesAny(dimensionFilterMatches));

    // Create mediation report specification.
    MediationReportSpec reportSpec =
        new MediationReportSpec()
            .setDateRange(dateRange)
            .setTimeZone(timeZone)
            .setMetrics(metrics)
            .setDimensions(dimensions)
            .setDimensionFilters(dimensionFilters)
            .setSortConditions(sortConditions);

    // Create mediation report request.
    return new GenerateMediationReportRequest().setReportSpec(reportSpec);
  }

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();

    // Generate mediation report request.
    GenerateMediationReportRequest request = getMediationReportRequest();
    runExample(adMob, ACCOUNT_NAME, request);
  }
}
