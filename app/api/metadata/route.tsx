import { NextResponse } from "next/server";
import metaScraper from "metadata-scraper";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const metadata = await metaScraper(url);
    return NextResponse.json({
      title: metadata.title || new URL(url).hostname,
      description: metadata.description || "",
      image: metadata.image || "",
      icon: metadata.icon || "",
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
