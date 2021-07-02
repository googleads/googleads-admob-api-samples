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
import com.google.api.services.admob.v1.model.GenerateNetworkReportRequest;
import com.google.api.services.admob.v1.model.GenerateNetworkReportResponse;
import com.google.api.services.admob.v1.model.NetworkReportSpec;
import com.google.api.services.samples.admob.AdMobFactory;
import com.google.api.services.samples.admob.util.DateUtils;
import com.google.common.collect.ImmutableList;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;


/** This example illustrates how to generate a network report. */
public class GenerateNetworkReport {
  /* ACCOUNT_NAME should follow the format "accounts/pub-XXXXXXXXXXXXXXXX"
   * where "pub-XXXXXXXXXXXXXXXX" is your publisher ID
   * See https://support.google.com/admob/answer/2784578
   * for instructions on how to find your publisher ID.
   */
  private static final String ACCOUNT_NAME = "accounts/pub-XXXXXXXXXXXXXXXX";

  // [START main_body]
  public static void runExample(
      AdMob adMob, String accountName, GenerateNetworkReportRequest request)
      throws Exception {

    // Get network report.
    InputStream response =
        adMob
            .accounts()
            .networkReport()
            .generate(accountName, request)
            .executeAsInputStream();

    List<GenerateNetworkReportResponse> result =
        Arrays.asList(
            new JsonObjectParser(Utils.getDefaultJsonFactory())
                .parseAndClose(
                    response, StandardCharsets.UTF_8, GenerateNetworkReportResponse[].class));

    // Print each record in the response stream.
    for (GenerateNetworkReportResponse record : result) {
      System.out.printf("%s%n", record);
    }
  }

  public static GenerateNetworkReportRequest getNetworkReportRequest() {
    /* AdMob API only supports the account default timezone and "America/Los_Angeles", see
     * https://developers.google.com/admob/api/v1/reference/rest/v1/accounts.networkReport/generate
     * for more information.
     */
    String timeZone = "America/Los_Angeles";
    Clock clock = Clock.system(ZoneId.of(timeZone));

    // Specify date range.
    Date startDate = DateUtils.daysBeforeNow(clock, 30);
    Date endDate = DateUtils.today(clock);
    DateRange dateRange = new DateRange().setStartDate(startDate).setEndDate(endDate);

    // Specify metrics.
    ImmutableList<String> metrics = ImmutableList.of("IMPRESSIONS", "MATCH_RATE");

    // Specify dimensions.
    ImmutableList<String> dimensions = ImmutableList.of("FORMAT", "AD_UNIT");

    // Create network report specification.
    NetworkReportSpec reportSpec =
        new NetworkReportSpec()
            .setDateRange(dateRange)
            .setTimeZone(timeZone)
            .setMetrics(metrics)
            .setDimensions(dimensions);

    // Create network report request.
    return new GenerateNetworkReportRequest().setReportSpec(reportSpec);
  }
  // [END main_body]

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();

    // Generate network report request.
    GenerateNetworkReportRequest request = getNetworkReportRequest();
    runExample(adMob, ACCOUNT_NAME, request);
  }
}

