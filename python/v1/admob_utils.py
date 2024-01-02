# Copyright 2020 Google LLC

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

import hashlib
import os
import re
import socket
import sys
import pickle

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

# [START main_body]
PORT = 8080
REDIRECT_URI = f"http://127.0.0.1:{PORT}"

# This variable specifies the name of a file that contains the OAuth 2.0
# information for this application, including its client_id and client_secret.
CLIENT_SECRETS_FILE = "client_secrets.json"

# Default OAuth 2.0 access parameters.
#
# These parameters allow for full read access to the authenticated user's AdMob
# account and requires requests to use an SSL connection.
API_NAME = "admob"
API_VERSION = "v1"
API_SCOPE = "https://www.googleapis.com/auth/admob.readonly"

# Store refresh tokens in a local disk file. This file contains sensitive
# authorization information.
TOKEN_FILE = 'token.pickle'


def load_user_credentials():
  # Name of a file containing the OAuth 2.0 information for this
  # application, including client_id and client_secret, which are found
  # on the Credentials tab on the Google Developers Console.
  client_secrets = os.path.join(os.path.dirname(__file__), CLIENT_SECRETS_FILE)
  return client_secrets


# Authenticate user and create AdMob Service Object.
def authenticate(
    api_name=API_NAME,
    api_version=API_VERSION,
    api_scopes=[API_SCOPE],
):
  """Authenticates a user and creates a Google API Service Object.

  Args:
    api_name: Google API name as shown in the API discovery doc. Defaults to the
      AdMob API.
    api_version: Google API version as shown in the API discovery doc. Defaults
      to v1.
    api_scopes: scope(s) to authenticate with oauth2 flow to access the APIs.
      Defaults to https://www.googleapis.com/auth/admob.readonly.

  Returns:
    A Google API Service Object that is authenticated with the user using either
    a client_secrets file or previously stored access and refresh tokens. By
    default, returns the AdMob API service object.
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
    flow = Flow.from_client_secrets_file(client_secrets, scopes=api_scopes)

    flow.redirect_uri = REDIRECT_URI

    # Create an anti-forgery state token as described here:
    # https://developers.google.com/identity/protocols/OpenIDConnect#createxsrftoken
    passthrough_val = hashlib.sha256(os.urandom(1024)).hexdigest()

    # Redirect the user to auth_url on your platform.
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        state=passthrough_val,
        included_granted_scopes="true")

    # Prints the authorization URL so you can paste into your browser. In a
    # typical web application you would redirect the user to this URL, and they
    # would be redirected back to "redirect_url" provided earlier after
    # granting permission.
    print("Paste this URL into your browser: ")
    print(authorization_url)
    print(f"\nWaiting for authorization and callback to: {REDIRECT_URI}...")

    # Retrieves an authorization code by opening a socket to receive the
    # redirect request and parsing the query parameters set in the URL.
    code = _get_authorization_code(passthrough_val)

    # Pass the code back into the OAuth module to get a refresh token.
    flow.fetch_token(code=code)
    refresh_token = flow.credentials.refresh_token
    credentials = flow.credentials

    print(f"\nYour refresh token is: {refresh_token}\n")

    # Save the credentials for the next run.
    with open(TOKEN_FILE, "wb") as token:
      pickle.dump(credentials, token)

  # Build the Google API service stub.
  service = build(api_name, api_version, credentials=credentials)
  return service


def _get_authorization_code(passthrough_val):
  """Opens a socket to handle a single HTTP request containing auth tokens.

    Args:
        passthrough_val: an anti-forgery token used to verify the request
          received by the socket.

    Returns:
        a str access token from the Google Auth service.
    """
  # Open a socket at localhost:PORT and listen for a request
  sock = socket.socket()
  sock.bind(("localhost", PORT))
  sock.listen(1)
  connection, address = sock.accept()
  data = connection.recv(1024)
  # Parse the raw request to retrieve the URL query parameters.
  params = _parse_raw_query_params(data)

  try:
    if not params.get("code"):
      # If no code is present in the query params then there will be an
      # error message with more details.
      error = params.get("error")
      message = f"Failed to retrieve authorization code. Error: {error}"
      raise ValueError(message)
    elif params.get("state") != passthrough_val:
      message = "State token does not match the expected state."
      raise ValueError(message)
    else:
      message = "Authorization code was successfully retrieved."
  except ValueError as error:
    print(error)
    sys.exit(1)
  finally:
    response = ("HTTP/1.1 200 OK\n"
                "Content-Type: text/html\n\n"
                f"<b>{message}</b>"
                "<p>Please check the console output.</p>\n")

    connection.sendall(response.encode())
    connection.close()

  return params.get("code")


def _parse_raw_query_params(data):
  """Parses a raw HTTP request to extract its query params as a dict.

    Note that this logic is likely irrelevant if you're building OAuth logic
    into a complete web application, where response parsing is handled by a
    framework.
    Args:
        data: raw request data as bytes.

    Returns:
        a dict of query parameter key value pairs.
    """
  # Decode the request into a utf-8 encoded string
  decoded = data.decode("utf-8")
  # Use a regular expression to extract the URL query parameters string
  match = re.search("GET\s\/\?(.*) ", decoded)
  params = match.group(1)
  # Split the parameters to isolate the key/value pairs
  pairs = [pair.split("=") for pair in params.split("&")]
  # Convert pairs to a dict to make it easy to access the values
  return {key: val for key, val in pairs}
  # [END main_body]
