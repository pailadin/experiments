/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjects
// ====================================================

export interface GetProjects_projects_edges_node {
  __typename: "Project";
  contractAddress: string;
  name: string;
  description: string | null;
  id: string;
}

export interface GetProjects_projects_edges {
  __typename: "Edge";
  node: GetProjects_projects_edges_node;
}

export interface GetProjects_projects {
  __typename: "Connection";
  edges: GetProjects_projects_edges[];
  totalCount: number;
}

export interface GetProjects {
  projects: GetProjects_projects;
}
