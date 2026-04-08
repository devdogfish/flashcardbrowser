import { PageLayout } from "@/components/page-layout";
import { DocsContent } from "@/components/docs-content";

export default function DocsPage() {
  return (
    <PageLayout
      title="Docs"
      backHref="/decks"
      backLabel="Back to decks"
      // className="border-2 border-red-400"
    >
      <DocsContent />
    </PageLayout>
  );
}
