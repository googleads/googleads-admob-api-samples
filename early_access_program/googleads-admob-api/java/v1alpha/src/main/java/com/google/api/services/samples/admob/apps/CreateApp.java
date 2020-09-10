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

import com.google.api.services.admob.v1alpha.AdMob;
import com.google.api.services.admob.v1alpha.model.App;
import com.google.api.services.admob.v1alpha.model.AppLinkedAppInfo;
import com.google.api.services.admob.v1alpha.model.AppManualAppInfo;
import com.google.api.services.samples.admob.AdMobFactory;

/** This example illustrates how to create an app. */
public class CreateApp {
  /* ACCOUNT_NAME should follow the format "accounts/pub-XXXXXXXXXXXXXXXX"
   * where "pub-XXXXXXXXXXXXXXXX" is your publisher ID
   * See https://support.google.com/admob/answer/2784578
   * for instructions on how to find your publisher ID.
   */
  private static final String ACCOUNT_NAME = "accounts/pub-XXXXXXXXXXXXXXXX";

  public static void runExample(AdMob adMob) throws Exception {
    // Create app specification.
    AppManualAppInfo manualAppInfo = new AppManualAppInfo().setDisplayName("Test");
    String platform = "ANDROID";
    App newApp = new App().setManualAppInfo(manualAppInfo).setPlatform(platform);

    // Create app.
    App app = adMob.accounts().apps().create(ACCOUNT_NAME, newApp).execute();

    // Display app.
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
        linkedAppInfo != null ? linkedAppInfo.getAppStoreId() : "",
        linkedAppInfo != null ? linkedAppInfo.getDisplayName() : "",
        app.getManualAppInfo().getDisplayName());
  }

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();

    runExample(adMob);
  }
}
