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


def list_accounts(service):
  """Gets and prints a list of AdMob accounts.

  Note: the list method is currently limited to returning a single response.

  Args:
    service: An AdMob Service Object.
  """

  # Execute the request.
  response = service.accounts().list(pageSize=1).execute()

  # Print the response.
  account_list = response['account']
  for account in account_list:
    print('Name: ' + account['name'])
    print('Publisher ID: ' + account['publisherId'])
    print('Currency code: ' + account['currencyCode'])
    print('Reporting time zone: ' + account['reportingTimeZone'])


def main():
  service = admob_utils.authenticate()
  list_accounts(service)


if __name__ == '__main__':
  main()
