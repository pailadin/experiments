/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CreateProjectRequest {
  name: string;
  description?: string | null;
  contractAddress: string;
  discordId: string;
  discordChannel: string;
  discordBotAccessToken: string;
}

export interface DeleteProjectRequest {
  id: string;
}

export interface GenerateAccessTokenByGoogleRequest {
  accessToken: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
