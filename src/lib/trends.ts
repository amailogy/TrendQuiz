import Parser from "rss-parser";
import type { TrendItem } from "@/types/quiz";

const TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=JP";

export async function fetchTrends(): Promise<TrendItem[]> {
  // rss-parser doesn't handle ht: namespace well, so we fetch raw XML and parse manually
  const res = await fetch(TRENDS_RSS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch trends: ${res.status}`);
  }
  const xml = await res.text();

  const parser = new Parser({
    customFields: {
      item: [
        ["ht:approx_traffic", "approxTraffic"],
        ["ht:picture", "picture"],
      ],
    },
  });

  const feed = await parser.parseString(xml);

  const trends: TrendItem[] = feed.items.slice(0, 7).map((item) => {
    // Extract news items from raw XML for this trend
    const newsItems = extractNewsItems(xml, item.title || "");

    return {
      title: item.title || "",
      approxTraffic: (item as unknown as Record<string, string>).approxTraffic || "",
      pubDate: item.pubDate || "",
      picture: (item as unknown as Record<string, string>).picture || "",
      newsItems,
    };
  });

  return trends;
}

function extractNewsItems(
  xml: string,
  trendTitle: string
): TrendItem["newsItems"] {
  const newsItems: TrendItem["newsItems"] = [];

  // Find the item block containing this trend title
  const escapedTitle = trendTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const itemRegex = new RegExp(
    `<item>\\s*<title>${escapedTitle}</title>[\\s\\S]*?</item>`
  );
  const itemMatch = xml.match(itemRegex);
  if (!itemMatch) return newsItems;

  const itemBlock = itemMatch[0];

  // Extract all ht:news_item blocks
  const newsItemRegex =
    /<ht:news_item>[\s\S]*?<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>[\s\S]*?<ht:news_item_url>([\s\S]*?)<\/ht:news_item_url>[\s\S]*?<ht:news_item_source>([\s\S]*?)<\/ht:news_item_source>[\s\S]*?<\/ht:news_item>/g;

  let match;
  while ((match = newsItemRegex.exec(itemBlock)) !== null) {
    newsItems.push({
      title: match[1].trim(),
      url: match[2].trim(),
      source: match[3].trim(),
    });
  }

  return newsItems;
}
