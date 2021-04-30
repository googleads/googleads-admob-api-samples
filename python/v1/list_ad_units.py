# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import admob_utils

# Set the 'PUBLISHER_ID' which follows the format "pub-XXXXXXXXXXXXXXXX".
# See https://support.google.com/admob/answer/2784578
# for instructions on how to find your publisher ID.
PUBLISHER_ID = 'pub-XXXXXXXXXXXXXXXX'

# Defines maximum size page to retrieve. A smaller page size will require more
# API requests, see inventory quota limits at
# https://developers.google.com/admob/api/quotas.
PAGE_SIZE = 1000


def list_ad_units(service, publisher_id):
  """Gets and prints a list of ad units.

  Args:
    service: An AdMob Service Object.
    publisher_id: An ID that identifies the publisher.
  """

  next_page_token = ''

  while True:
    # Execute the request.
    response = service.accounts().adUnits().list(
        pageSize=PAGE_SIZE,
        pageToken=next_page_token,
        parent='accounts/{}'.format(publisher_id)).execute()

    # Check if the response is empty.
    if not response:
      break

    # Print the result.
    ad_units = response['adUnits']
    for ad_unit in ad_units:
      print('Ad Unit Display Name: ' + ad_unit['displayName'])
      print('Ad Unit Name: ' + ad_unit['name'])
      print('Ad Unit ID: ' + ad_unit['adUnitId'])
      print('Ad Unit Format: ' + ad_unit['adFormat'])
      print('Ad Unit ID: ' + ad_unit['appId'])
      if 'adTypes' in ad_unit:
        print('Ad Unit Format: ' + ', '.join(ad_unit['adTypes']))

    if 'nextPageToken' not in response:
      break
    # Update the next page token.
    next_page_token = response['nextPageToken']


def main():
  service = admob_utils.authenticate()
  list_ad_units(service, PUBLISHER_ID)


if __name__ == '__main__':
  main()
