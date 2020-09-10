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

package com.google.api.services.samples.admob;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.util.Utils;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.admob.v1alpha.AdMob;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.security.auth.login.CredentialException;

/** Utility methods used by all AdMob API samples. */
public class AdMobFactory {
  /** Directory to store user credentials. */
  private static final java.io.File DATA_STORE_DIR =
      new java.io.File(System.getProperty("user.home"), ".store/admobapi_sample");

  private static final HttpTransport HTTP_TRANSPORT = Utils.getDefaultTransport();
  private static final JsonFactory JSON_FACTORY = Utils.getDefaultJsonFactory();

  /** The OAuth 2.0 scope to request. */
  public static final String ADMOB_READONLY = "https://www.googleapis.com/auth/admob.readonly";
  public static final String ADMOB_REPORT = "https://www.googleapis.com/auth/admob.report";
  public static final String ADMOB_MONETIZATION =
      "https://www.googleapis.com/auth/admob.monetization";
  private static Set<String> ADMOB_SCOPES =
      new HashSet<>(Arrays.asList(ADMOB_REPORT, ADMOB_MONETIZATION));

  /**
   * Authorizes the application to access users' protected data.
   *
   * @return An initialized {@link Credential} object.
   */
  private static Credential authorize() throws CredentialException, IOException, RuntimeException {
    // Load application default credentials if they're available.
    Credential credential = loadApplicationDefaultCredentials();

    // Otherwise, load credentials from the provided client secrets file.
    if (credential == null) {
      String clientSecretsFile = AdMobFactory.class.getResource("/client_secrets.json").getFile();
      credential = loadUserCredentials(clientSecretsFile, new FileDataStoreFactory(DATA_STORE_DIR));
    }

    return credential;
  }

  /**
   * Attempts to load application default credentials.
   *
   * @return A {@link Credential} object initialized with application default credentials, or {@code
   *     null} if none were found.
   */
  @Nullable
  private static Credential loadApplicationDefaultCredentials() {
    try {
      GoogleCredential credential = GoogleCredential.getApplicationDefault();
      return credential.createScoped(ADMOB_SCOPES);
    } catch (IOException ignored) {
      // No application default credentials, continue to try other options.
    }

    return null;
  }

  /**
   * Attempts to load user credentials from the provided client secrets file and persists data to
   * the provided data store.
   *
   * @param clientSecretsFile The path to the file containing client secrets.
   * @param dataStoreFactory The data store to use for caching credential information.
   * @return A {@link Credential} object initialized with user account credentials.
   */
  private static Credential loadUserCredentials(
      String clientSecretsFile, @Nonnull DataStoreFactory dataStoreFactory)
      throws CredentialException, IOException, RuntimeException {

    // Load client secrets JSON file.
    GoogleClientSecrets clientSecrets = null;
    try (Reader reader = Files.newBufferedReader(Paths.get(clientSecretsFile), UTF_8)) {
      clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
    }

    // Set up the authorization code flow.
    GoogleAuthorizationCodeFlow flow =
        new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, ADMOB_SCOPES)
            .setDataStoreFactory(dataStoreFactory)
            .build();

    // Authorize and persist credential information to the data store.
    return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
  }

  /**
   * Performs all necessary setup steps for running requests against the API.
   *
   * @return An initialized {@link AdMob} service object.
   */
  public static AdMob getInstance() throws Exception {
    Credential credential = authorize();

    // Create AdMob client.
    return new AdMob.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
        .setApplicationName("admobapi-java-samples")
        .build();
  }
}
