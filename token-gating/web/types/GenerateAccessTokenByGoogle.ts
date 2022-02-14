/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GenerateAccessTokenByGoogleRequest } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: GenerateAccessTokenByGoogle
// ====================================================

export interface GenerateAccessTokenByGoogle_generateAccessTokenByGoogle_data {
  __typename: "GenerateAccessTokenByGoogleResponseData";
  accessToken: string;
}

export interface GenerateAccessTokenByGoogle_generateAccessTokenByGoogle_error {
  __typename: "InvalidGoogleAccessTokenError";
}

export interface GenerateAccessTokenByGoogle_generateAccessTokenByGoogle {
  __typename: "GenerateAccessTokenByGoogleResponse";
  data: GenerateAccessTokenByGoogle_generateAccessTokenByGoogle_data | null;
  error: GenerateAccessTokenByGoogle_generateAccessTokenByGoogle_error | null;
}

export interface GenerateAccessTokenByGoogle {
  generateAccessTokenByGoogle: GenerateAccessTokenByGoogle_generateAccessTokenByGoogle;
}

export interface GenerateAccessTokenByGoogleVariables {
  request?: GenerateAccessTokenByGoogleRequest | null;
}
