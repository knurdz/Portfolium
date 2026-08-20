import { getPortfolioBySubdomain } from "@/lib/actions/portfolio";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export default async function PortfolioPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  
  const portfolio = await getPortfolioBySubdomain(subdomain);

  if (!portfolio) {
    notFound();
  }

  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(portfolio.htmlContent, {
    ADD_TAGS: ['style', 'link', 'meta'],
    ADD_ATTR: ['target', 'rel', 'href', 'src', 'crossorigin', 'integrity', 'media', 'type', 'charset', 'name', 'content', 'property'],
    WHOLE_DOCUMENT: true,
    ALLOW_DATA_ATTR: true,
  });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
