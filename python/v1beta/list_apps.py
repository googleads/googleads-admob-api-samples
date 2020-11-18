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


def list_apps(service, publisher_id):
  """Gets and prints a list of apps.

  Args:
    service: An AdMob Service Object.
    publisher_id: An ID that identifies the publisher.
  """

  next_page_token = ''

  while True:
    # Execute the request.
    response = service.accounts().apps().list(
        pageSize=PAGE_SIZE,
        pageToken=next_page_token,
        parent='accounts/{}'.format(publisher_id)).execute()

    # Check if the response is empty.
    if not response:
      break

    # Print the result.
    apps = response['apps']
    for app in apps:
      print('App ID: ' + app['appId'])
      print('App Platform: ' + app['platform'])
      print('App Name: ' + app['name'])

      if 'linkedAppInfo' in app:
        linked_app_info = app['linkedAppInfo']
        print('App Store ID: ' + linked_app_info['appStoreId'])
        print('App Store Display Name: ' + linked_app_info['displayName'])

      if 'manualAppInfo' in app:
        manual_app_info = app['manualAppInfo']
        print('App Manual Info: ' + manual_app_info['displayName'])

    if 'nextPageToken' not in response:
      break

    # Update the next page token.
    next_page_token = response['nextPageToken']


def main():
  service = admob_utils.authenticate()
  list_apps(service, PUBLISHER_ID)


if __name__ == '__main__':
  main()
