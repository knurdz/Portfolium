import { getPortfolioBySubdomain } from "@/lib/actions/portfolio";
import { notFound } from "next/navigation";

export default async function PortfolioPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  
  const portfolio = await getPortfolioBySubdomain(subdomain);

  if (!portfolio) {
    notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: portfolio.htmlContent }}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
