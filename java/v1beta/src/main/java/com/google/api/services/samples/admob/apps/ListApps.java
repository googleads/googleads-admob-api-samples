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

package com.google.api.services.samples.admob.apps;

import com.google.api.services.admob.v1beta.AdMob;
import com.google.api.services.admob.v1beta.model.App;
import com.google.api.services.admob.v1beta.model.AppLinkedAppInfo;
import com.google.api.services.admob.v1beta.model.ListAppsResponse;
import com.google.api.services.samples.admob.AdMobFactory;
import java.util.List;

/** This example illustrates how to get a list of apps. */
public class ListApps {
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

    ListAppsResponse response;
    String nextPageToken = null;

    do {
      // Create and execute the apps list request.
      response =
          adMob
              .accounts()
              .apps()
              .list(ACCOUNT_NAME)
              .setPageSize(PAGE_SIZE)
              .setPageToken(nextPageToken)
              .execute();

      // Display apps.
      List<App> apps = response.getApps();

      for (App app : apps) {
        AppLinkedAppInfo linkedAppInfo = app.getLinkedAppInfo();

        System.out.printf(
            "App Name: %s, "
                + "App ID: %s, "
                + "App Platform: %s, "
                + "App Store ID: %s, "
                + "App Store Display Name: %s, "
                + "App Manual Info: %s%n",
            app.getName(),
            app.getAppId(),
            app.getPlatform(),
            linkedAppInfo == null ? "" : linkedAppInfo.getAppStoreId(),
            linkedAppInfo == null ? "" : linkedAppInfo.getDisplayName(),
            app.getManualAppInfo().getDisplayName());
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
