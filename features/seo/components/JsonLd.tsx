import React from "react";

export interface JsonLdProps {
  schema: unknown;
}

/**
 * Pure Server Component for safely injecting Schema.org JSON-LD structured data into the document head/body.
 * Escapes <, >, and & characters to prevent Cross-Site Scripting (XSS) attacks.
 */
export function JsonLd({ schema }: JsonLdProps) {
  const safeJson = JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
