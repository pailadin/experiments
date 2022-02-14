/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateProjectRequest } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateProject
// ====================================================

export interface CreateProject_createProject_data_project {
  __typename: "Project";
  name: string;
  id: string;
}

export interface CreateProject_createProject_data {
  __typename: "CreateProjectResponseData";
  project: CreateProject_createProject_data_project;
}

export interface CreateProject_createProject {
  __typename: "CreateProjectResponse";
  data: CreateProject_createProject_data | null;
}

export interface CreateProject {
  createProject: CreateProject_createProject | null;
}

export interface CreateProjectVariables {
  request?: CreateProjectRequest | null;
}
