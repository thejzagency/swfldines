import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const urls: SitemapUrl[] = [];
    const baseUrl = 'https://www.swfldines.com';

    // Static pages
    urls.push({
      loc: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0]
    });

    urls.push({
      loc: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: 0.8
    });

    urls.push({
      loc: `${baseUrl}/contact`,
      changefreq: 'monthly',
      priority: 0.7
    });

    urls.push({
      loc: `${baseUrl}/blog`,
      changefreq: 'daily',
      priority: 0.9
    });

    urls.push({
      loc: `${baseUrl}/pricing`,
      changefreq: 'monthly',
      priority: 0.8
    });

    // Fetch active restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('id, updated_at')
      .eq('status', 'active');

    if (restaurants) {
      restaurants.forEach((restaurant) => {
        urls.push({
          loc: `${baseUrl}/restaurant/${restaurant.id}`,
          lastmod: restaurant.updated_at
            ? new Date(restaurant.updated_at).toISOString().split('T')[0]
            : undefined,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    }

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (posts) {
      posts.forEach((post) => {
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: post.updated_at
            ? new Date(post.updated_at).toISOString().split('T')[0]
            : undefined,
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // Generate XML
    const xmlContent = generateXML(urls);

    return new Response(xmlContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error: any) {
    console.error("Sitemap generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateXML(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls.map((url) => {
    let entry = '  <url>\n';
    entry += `    <loc>${escapeXml(url.loc)}</loc>\n`;

    if (url.lastmod) {
      entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      entry += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }

    entry += '  </url>';
    return entry;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
