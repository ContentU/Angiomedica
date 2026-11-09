"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletons } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "angiomedica",
  title: "Angiomedica",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  schema: {
    types: schemaTypes,
    // i singleton non si creano né si duplicano dal menu "nuovo documento"
    templates: (t) => t.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType) ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : prev,
  },
  plugins: [structureTool({ structure })],
});
