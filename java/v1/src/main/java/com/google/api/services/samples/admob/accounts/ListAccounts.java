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

package com.google.api.services.samples.admob.accounts;

import com.google.api.services.admob.v1.AdMob;
import com.google.api.services.admob.v1.model.ListPublisherAccountsResponse;
import com.google.api.services.admob.v1.model.PublisherAccount;
import com.google.api.services.samples.admob.AdMobFactory;

/** This example illustrates how to get a list of accounts. */
public class ListAccounts {

  public static void runExample(AdMob adMob) throws Exception {

    // Get publisher account which always returns a single account.
    ListPublisherAccountsResponse accountsList = adMob.accounts().list().setPageSize(1).execute();

    // Display publisher accounts.
    for (PublisherAccount account : accountsList.getAccount()) {
      System.out.printf(
          "Publisher Name: %s, Publisher Id: %s, Currency Code: %s, Reporting Time Zone: %s%n",
          account.getName(),
          account.getPublisherId(),
          account.getCurrencyCode(),
          account.getReportingTimeZone());
    }
  }

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();
    runExample(adMob);
  }
}
