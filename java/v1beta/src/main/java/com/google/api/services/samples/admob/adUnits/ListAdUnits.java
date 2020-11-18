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

package com.google.api.services.samples.admob.adunits;

import com.google.api.services.admob.v1beta.AdMob;
import com.google.api.services.admob.v1beta.model.AdUnit;
import com.google.api.services.admob.v1beta.model.ListAdUnitsResponse;
import com.google.api.services.samples.admob.AdMobFactory;
import java.util.List;

/** This example illustrates how to get a list of ad units. */
public class ListAdUnits {
  /* ACCOUNT_NAME should follow the format "accounts/pub-XXXXXXXXXXXXXXXX"
   * where "pub-XXXXXXXXXXXXXXXX" is your publisher ID
   * See https://support.google.com/admob/answer/2784578
   * for instructions on how to find your publisher ID.
   */
  private static final String ACCOUNT_NAME = "accounts/pub-XXXXXXXXXXXXXXXX";

  // Defines maximum size page to retrieve. A smaller page size will require more API requests, see
  // inventory quota limits at https://developers.google.com/admob/api/quotas.
  private static final Integer PAGE_SIZE = 1000;

  public static void runExample(AdMob adMob) throws Exception {

    ListAdUnitsResponse response;
    String nextPageToken = null;

    do {
      // Create and execute the apps list request.
      response =
          adMob
              .accounts()
              .adUnits()
              .list(ACCOUNT_NAME)
              .setPageSize(PAGE_SIZE)
              .setPageToken(nextPageToken)
              .execute();

      // Display ad units.
      List<AdUnit> adUnits = response.getAdUnits();
      for (AdUnit adUnit : adUnits) {
        System.out.printf(
            "Ad Unit Display Name: %s, "
                + "Ad Unit Name: %s, "
                + "Ad Unit ID: %s, "
                + "Ad Unit Format: %s, "
                + "Ad Unit App ID: %s, "
                + "Ad Unit Ad Types: %s%n",
            adUnit.getDisplayName(),
            adUnit.getName(),
            adUnit.getAdUnitId(),
            adUnit.getAdFormat(),
            adUnit.getAppId(),
            adUnit.getAdTypes());
      }

      // Update the next page token.
      nextPageToken = response.getNextPageToken();
    } while (nextPageToken != null);
  }

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();
    runExample(adMob);
  }
}
