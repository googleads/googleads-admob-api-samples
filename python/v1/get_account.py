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

// [START main_body]
# Set the 'PUBLISHER_ID' which follows the format "pub-XXXXXXXXXXXXXXXX".
# See https://support.google.com/admob/answer/2784578
# for instructions on how to find your publisher ID.
PUBLISHER_ID = 'pub-XXXXXXXXXXXXXXXX'


def get_account(service, publisher_id):
  """Gets and prints an AdMob account.

  Args:
    service: An AdMob Service Object.
    publisher_id: An ID that identifies the publisher.
  """

  # Execute the request.
  response = service.accounts().get(
      name='accounts/{}'.format(publisher_id)).execute()

  # Print the response.
  print('Name: ' + response['name'])
  print('Publisher ID: ' + response['publisherId'])
  print('Currency code: ' + response['currencyCode'])
  print('Reporting time zone: ' + response['reportingTimeZone'])

// [END main_body]

def main():
  service = admob_utils.authenticate()
  get_account(service, PUBLISHER_ID)


if __name__ == '__main__':
  main()
