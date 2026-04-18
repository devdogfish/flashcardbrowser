import type { Metadata } from "next";
import { DocsLayout } from "@/components/docs/docs-layout";
import { DOCS_SECTIONS } from "@/components/docs/sections";
import DocsContent from "@/content/docs.mdx";

export const metadata: Metadata = {
  title: "Documentation — flashcardbrowser",
  description: "API reference and integration guides for flashcardbrowser.com",
};

export default function DocsPage() {
  return (
    <DocsLayout sections={DOCS_SECTIONS}>
      <DocsContent />
    </DocsLayout>
  );
}
