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

package com.google.api.services.samples.admob.util;

import com.google.api.services.admob.v1.model.Date;
import java.time.Clock;
import java.time.ZonedDateTime;

/*
 * Helper class to create the AdMob API Date object.
 */
public final class DateUtils {

  private DateUtils() {}

  public static Date today(Clock clock) {
    ZonedDateTime dateTime = ZonedDateTime.now(clock);
    return toDate(dateTime);
  }

  public static Date yesterday(Clock clock) {
    return daysBeforeNow(clock, 1L);
  }

  public static Date daysBeforeNow(Clock clock, long days) {
    ZonedDateTime dateTime = ZonedDateTime.now(clock).minusDays(days);
    return toDate(dateTime);
  }

  private static Date toDate(ZonedDateTime dateTime) {
    return new Date()
        .setYear(dateTime.getYear())
        .setMonth(dateTime.getMonthValue())
        .setDay(dateTime.getDayOfMonth());
  }
}
