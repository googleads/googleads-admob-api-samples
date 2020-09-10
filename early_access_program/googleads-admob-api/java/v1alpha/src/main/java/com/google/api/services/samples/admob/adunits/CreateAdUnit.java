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

import com.google.api.services.admob.v1alpha.AdMob;
import com.google.api.services.admob.v1alpha.model.AdUnit;
import com.google.api.services.samples.admob.AdMobFactory;
import java.util.ArrayList;
import java.util.List;

/** This example illustrates how to create an ad unit. */
public class CreateAdUnit {
  /* ACCOUNT_NAME should follow the format "accounts/pub-XXXXXXXXXXXXXXXX"
   * where "pub-XXXXXXXXXXXXXXXX" is your publisher ID
   * See https://support.google.com/admob/answer/2784578
   * for instructions on how to find your publisher ID.
   */
  private static final String ACCOUNT_NAME = "accounts/pub-XXXXXXXXXXXXXXXX";

  /* APP_ID should follow the format "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX".
   * See https://support.google.com/admob/answer/7356431
   * for instructions on how to find your app ID.
   */
  private static final String APP_ID = "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX";

  public static void runExample(AdMob adMob) throws Exception {

    // Create ad unit specification.
    String adFormat = "BANNER";
    List<String> adTypes = new ArrayList<String>();
    adTypes.add("VIDEO");
    String displayName = "Test Ad Unit";
    String name = "Test Ad Unit";

    AdUnit newAdUnit =
        new AdUnit()
            .setName(name)
            .setDisplayName(displayName)
            .setAppId(APP_ID)
            .setAdTypes(adTypes)
            .setAdFormat(adFormat);

    // Create ad unit.
    AdUnit adUnit = adMob.accounts().adUnits().create(ACCOUNT_NAME, newAdUnit).execute();

    // Display ad unit.
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

  public static void main(String[] args) throws Exception {
    AdMob adMob = AdMobFactory.getInstance();

    runExample(adMob);
  }
}
