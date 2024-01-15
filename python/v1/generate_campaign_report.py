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

import csv
import time
import admob_utils
from googleapiclient.http import MediaFileUpload

# Set the 'PUBLISHER_ID' which follows the format "pub-XXXXXXXXXXXXXXXX".
# See https://support.google.com/admob/answer/2784578
# for instructions on how to find your publisher ID.
PUBLISHER_ID = 'pub-XXXXXXXXXXXXXXXX'

# List of all oauth2 scopes needed for this code sample to run end-to-end. Note
# that specific API endpoints may only need a subset of these API scopes. This
# code sample requests all oauth2 scopes together to demonstrate the usage of
# refresh token and to avoid reauthentication.
ALL_OAUTH_SCOPES = [
    'https://www.googleapis.com/auth/admob.readonly',
    'https://www.googleapis.com/auth/drive.file',
]


def generate_campaign_report():
  """Generates and returns a campaign report.

  Returns:
    A JSON dict object consisting of rows in the campaign report.
  """

  date_range = {
      'start_date': {'year': 2023, 'month': 12, 'day': 1},
      'end_date': {'year': 2023, 'month': 12, 'day': 31},
  }

  # Set dimensions.
  dimensions = ['CAMPAIGN_NAME', 'COUNTRY', 'AD_NAME']

  # Set metrics.
  metrics = ['IMPRESSIONS', 'INSTALLS', 'CLICKS']

  # Create network report specifications.
  report_spec = {
      'date_range': date_range,
      'dimensions': dimensions,
      'metrics': metrics,
  }

  # Create network report request.
  request = {'report_spec': report_spec}

  service = admob_utils.authenticate(
      api_version='v1beta',
      api_scopes=ALL_OAUTH_SCOPES,
  )

  # Execute network report request.
  response = (
      service.accounts()
      .campaignReport()
      .generate(parent='accounts/{}'.format(PUBLISHER_ID), body=request)
      .execute()
  )

  return response['rows']


def save_to_csv(report, csv_output_path='/tmp/campaign_report.csv'):
  """Saves the campaign report into a csv file.

  Args:
    report: campaign report returned from generate_campaign_report().
    csv_output_path: file path to store csv.
  """
  if not report:
    # Empty report.
    return

  with open(csv_output_path, 'w') as csv_output:
    csv_writer = csv.writer(csv_output)

    # Extract csv header.
    header = list(report[0]['dimensionValues'].keys()) + list(
        report[0]['metricValues'].keys()
    )
    csv_writer.writerow(header)

    # Populate rows.
    for row in report:
      csv_writer.writerow([
          list(elem.values())[0]
          for elem in list(row['dimensionValues'].values())
          + list(row['metricValues'].values())
      ])


def upload_csv_to_google_sheets(csv_output_path='/tmp/campaign_report.csv'):
  """Upload to Google Sheets.

  Args:
    csv_output_path: file path to store csv.

  Returns:
    Drive object ID.
  """
  drive_service = admob_utils.authenticate('drive', 'v3', ALL_OAUTH_SCOPES)
  file_metadata = {
      'name': 'campaign report csv upload ' + str(time.time()),
      'mimeType': 'application/vnd.google-apps.spreadsheet',
  }
  media = MediaFileUpload(csv_output_path, mimetype='text/csv', resumable=False)
  file_id = (
      drive_service.files()
      .create(body=file_metadata, media_body=media, fields='id')
      .execute()
  ).get('id')
  print(f'Uploaded to: https://docs.google.com/spreadsheets/d/{file_id}')
  return file_id


def main():
  # Call AdMob API to generate campaign report.
  report = generate_campaign_report()

  # Save AdMob campaign report locally in CSV format.
  save_to_csv(report)

  # Call Drive API to upload local CSV file to Google Sheets.
  upload_csv_to_google_sheets()


if __name__ == '__main__':
  main()
