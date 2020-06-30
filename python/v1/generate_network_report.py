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


def generate_network_report(service, publisher_id):
  """Generates and prints a network report.

  Args:
    service: An AdMob Service Object.
    publisher_id: An ID that identifies the publisher.
  """

  # Set date range. AdMob API only supports the account default timezone and
  # "America/Los_Angeles", see
  # https://developers.google.com/admob/api/v1/reference/rest/v1/accounts.networkReport/generate
  # for more information.
  date_range = {
      'start_date': {'year': 2020, 'month': 1, 'day': 1},
      'end_date': {'year': 2020, 'month': 3, 'day': 30}
  }

  # Set dimensions.
  dimensions = ['DATE', 'APP', 'PLATFORM', 'COUNTRY']

  # Set metrics.
  metrics = ['ESTIMATED_EARNINGS', 'AD_REQUESTS', 'MATCHED_REQUESTS']

  # Set sort conditions.
  sort_conditions = {'dimension': 'DATE', 'order': 'DESCENDING'}

  # Set dimension filters.
  dimension_filters = {
      'dimension': 'COUNTRY',
      'matches_any': {
          'values': ['US', 'CA']
      }
  }

  # Create network report specifications.
  report_spec = {
      'date_range': date_range,
      'dimensions': dimensions,
      'metrics': metrics,
      'sort_conditions': [sort_conditions],
      'dimension_filters': [dimension_filters]
  }

  # Create network report request.
  request = {'report_spec': report_spec}

  # Execute network report request.
  result = service.accounts().networkReport().generate(
      parent='accounts/{}'.format(publisher_id), body=request).execute()

  # Display results.
  for report_line in result:
    print(report_line)
  print()


def main():
  service = admob_utils.authenticate()
  generate_network_report(service, PUBLISHER_ID)


if __name__ == '__main__':
  main()
