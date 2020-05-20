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

namespace Examples\Utils;

/**
 * Helper class to create the AdMob API Date object.
 */
class DateUtils
{
    public static function today()
    {
        $dateTime = getdate();
        return self::toDate($dateTime);
    }

    public static function oneWeekBeforeToday()
    {
        $dateTime = getdate(strtotime('-1 week'));
        return self::toDate($dateTime);
    }

    private static function toDate($dateTime)
    {
        $date = new \Google_Service_AdMob_Date();
        $date->setDay($dateTime['mday']);
        $date->setMonth($dateTime['mon']);
        $date->setYear($dateTime['year']);
        return $date;
    }
}
