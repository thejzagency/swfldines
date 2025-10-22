import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export function MetaTags({
  title = 'SW Florida Dines - Southwest Florida\'s Premier Restaurant Directory',
  description = 'Discover the best restaurants in Southwest Florida. From Naples to Fort Myers, Cape Coral to Bonita Springs, find your next favorite dining experience with SW Florida Dines.',
  image = 'https://www.swfldines.com/og-image.jpg',
  url = 'https://www.swfldines.com',
  type = 'website',
  structuredData
}: MetaTagsProps) {
  useEffect(() => {
    document.title = title;

    updateMetaTag('description', description);
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    if (structuredData) {
      updateStructuredData(structuredData);
    }

    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (link) {
      link.href = url;
    }
  }, [title, description, image, url, type, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function updateStructuredData(data: object) {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function generateRestaurantStructuredData(restaurant: {
  name: string;
  description: string;
  image_url: string;
  cuisine_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website?: string;
  price_range: string;
  rating?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image_url,
    servesCuisine: restaurant.cuisine_type,
    priceRange: restaurant.price_range,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      addressRegion: restaurant.state,
      postalCode: restaurant.zip_code,
      addressCountry: 'US'
    },
    telephone: restaurant.phone,
    ...(restaurant.website && { url: restaurant.website }),
    ...(restaurant.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: restaurant.rating,
        ratingCount: 1
      }
    })
  };
}

export function generateBlogPostStructuredData(post: {
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  author: string;
  published_at: string;
  updated_at?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'SW Florida Dines',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.swfldines.com/favicon.svg'
      }
    },
    datePublished: post.published_at,
    ...(post.updated_at && { dateModified: post.updated_at }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.swfldines.com/blog'
    }
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SW Florida Dines',
    description: 'Southwest Florida\'s premier restaurant directory',
    url: 'https://www.swfldines.com',
    logo: 'https://www.swfldines.com/favicon.svg',
    sameAs: [
      'https://www.facebook.com/swfldines',
      'https://www.instagram.com/swfldines',
      'https://twitter.com/swfldines'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@swfldines.com'
    }
  };
}
