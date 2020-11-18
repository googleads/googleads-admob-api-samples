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

import os
import pickle

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# Constants for the AdMob API service.
API_NAME = 'admob'
API_VERSION = 'v1beta'
API_SCOPE = 'https://www.googleapis.com/auth/admob.readonly'

# Store refresh tokens in a local disk file. This file contains sensitive
# authorization information.
TOKEN_FILE = 'token.pickle'


def load_user_credentials():
  # Name of a file containing the OAuth 2.0 information for this
  # application, including client_id and client_secret, which are found
  # on the Credentials tab on the Google Developers Console.
  client_secrets = os.path.join(
      os.path.dirname(__file__), 'client_secrets.json')
  return client_secrets


# Authenticate user and create AdMob Service Object.
def authenticate():
  """Authenticates a user and creates an AdMob Service Object.

  Returns:
    An AdMob Service Object that is authenticated with the user using either
    a client_secrets file or previously stored access and refresh tokens.
  """

  # The TOKEN_FILE stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists(TOKEN_FILE):
    with open(TOKEN_FILE, 'rb') as token:
      credentials = pickle.load(token)

    if credentials and credentials.expired and credentials.refresh_token:
      credentials.refresh(Request())

  # If there are no valid stored credentials, authenticate using the
  # client_secrets file.
  else:
    client_secrets = load_user_credentials()
    flow = Flow.from_client_secrets_file(
        client_secrets,
        scopes=[API_SCOPE],
        redirect_uri='urn:ietf:wg:oauth:2.0:oob')

    # Redirect the user to auth_url on your platform.
    auth_url, _ = flow.authorization_url()
    print('Please go to this URL: {}\n'.format(auth_url))

    # The user will get an authorization code. This code is used to get the
    # access token.
    code = input('Enter the authorization code: ')
    flow.fetch_token(code=code)
    credentials = flow.credentials

  # Save the credentials for the next run.
  with open('token.pickle', 'wb') as token:
    pickle.dump(credentials, token)

  # Build the AdMob service.
  admob = build(API_NAME, API_VERSION, credentials=credentials)
  return admob
