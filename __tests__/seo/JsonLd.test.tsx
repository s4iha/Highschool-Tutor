import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "@/features/seo/components/JsonLd";

describe("<JsonLd /> Server Component", () => {
  it("should render application/ld+json script tag with serialized schema", () => {
    const testSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "HighSchool Tutor",
    };

    const html = renderToStaticMarkup(<JsonLd schema={testSchema} />);
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('"name":"HighSchool Tutor"');
  });

  it("should escape <, >, and & characters to prevent XSS injection", () => {
    const maliciousSchema = {
      "@context": "https://schema.org",
      "@type": "Comment",
      text: "<script>alert('XSS');</script> & 'cookies' > 0",
    };

    const html = renderToStaticMarkup(<JsonLd schema={maliciousSchema} />);
    // Inside the payload, raw <script> or payload unescaped tags should NOT exist
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("alert('XSS');</script>");
    expect(html).not.toContain(" & ");
    expect(html).not.toContain(" > ");

    // MUST contain unicode escapes in the payload
    expect(html).toContain("\\u003cscript\\u003ealert('XSS');\\u003c/script\\u003e");
    expect(html).toContain("\\u0026");
    expect(html).toContain("\\u003e");
  });
});
