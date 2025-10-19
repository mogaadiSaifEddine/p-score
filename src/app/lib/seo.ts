// src/lib/seo.ts
// SEO utilities for dynamic metadata generation

import type { Metadata } from "next";

interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  gameCode?: string;
  teamName?: string;
  teamScore?: number;
  gameStatus?: 'not_started' | 'in_progress' | 'finished';
}

const DEFAULT_CONFIG = {
  siteName: 'Scoreboard',
  defaultTitle: 'Locatify - Interactive Location-Based Games & Treasure Hunts',
  defaultDescription: 'Experience immersive location-based games and treasure hunts. Track your team\'s progress and compete with others in real-time.',
  defaultImage: '/og-image.png',
  domain: 'https://locatify.com', // Update with your actual domain
  twitterHandle: '@locatify', // Update with your actual Twitter handle
  locale: 'en_US'
};

export function generateSEOMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    siteName = DEFAULT_CONFIG.siteName,
    locale = DEFAULT_CONFIG.locale,
    gameCode,
    teamName,
    teamScore,
    gameStatus
  } = config;

  // Dynamic title generation
  let finalTitle = title || DEFAULT_CONFIG.defaultTitle;
  if (gameCode && teamName) {
    finalTitle = `${teamName} - Game ${gameCode} | ${siteName}`;
  } else if (gameCode) {
    finalTitle = `Game ${gameCode} Scoreboard | ${siteName}`;
  }

  // Dynamic description generation
  let finalDescription = description || DEFAULT_CONFIG.defaultDescription;
  if (gameCode && teamName && teamScore !== undefined) {
    const statusText = gameStatus === 'finished' ? 'completed' : gameStatus === 'in_progress' ? 'is playing' : 'joined';
    finalDescription = `${teamName} ${statusText} game ${gameCode} with ${teamScore} points. Follow their progress in this exciting location-based treasure hunt!`;
  } else if (gameCode) {
    finalDescription = `Live scoreboard for Locatify game ${gameCode}. Track team progress and scores in real-time!`;
  }

  // Image generation
  const finalImage = image || DEFAULT_CONFIG.defaultImage;
  const imageUrl = finalImage.startsWith('http') ? finalImage : `${DEFAULT_CONFIG.domain}${finalImage}`;

  // URL generation
  const finalUrl = url || DEFAULT_CONFIG.domain;
  const canonicalUrl = finalUrl.startsWith('http') ? finalUrl : `${DEFAULT_CONFIG.domain}${finalUrl}`;

  return {
    title: finalTitle,
    description: finalDescription,
    
    // Open Graph metadata for Facebook, LinkedIn, etc.
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: finalTitle,
        }
      ],
      locale,
      type,
    },

    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      site: DEFAULT_CONFIG.twitterHandle,
      creator: DEFAULT_CONFIG.twitterHandle,
      images: [imageUrl],
    },

    // Additional metadata
    alternates: {
      canonical: canonicalUrl,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Schema.org structured data would be added via JSON-LD in components
    other: {
      'theme-color': '#201c96', // Your primary color
    }
  };
}

// Generate dynamic images for social sharing (you can implement this with an API route)
export function generateDynamicOGImage(config: {
  gameCode?: string;
  teamName?: string;
  teamScore?: number;
  gameStatus?: string;
}): string {
  const params = new URLSearchParams();
  
  if (config.gameCode) params.append('gameCode', config.gameCode);
  if (config.teamName) params.append('teamName', config.teamName);
  if (config.teamScore !== undefined) params.append('teamScore', config.teamScore.toString());
  if (config.gameStatus) params.append('gameStatus', config.gameStatus);
  
  return `/api/og?${params.toString()}`;
}

// Schema.org structured data generators
export function generateGameSchema(config: {
  gameCode: string;
  teamName?: string;
  teamScore?: number;
  gameStatus?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": `Locatify Game ${config.gameCode}`,
    "description": `Interactive location-based treasure hunt game ${config.gameCode}`,
    "url": config.url,
    "gameLocation": {
      "@type": "Place",
      "name": "Various Locations"
    },
    "numberOfPlayers": "Multiple Teams",
    "genre": "Location-based Game"
  };
}

export function generateTeamSchema(config: {
  teamName: string;
  teamScore: number;
  gameCode: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": config.teamName,
    "sport": "Location-based Treasure Hunt",
    "url": config.url,
    "memberOf": {
      "@type": "SportsOrganization",
      "name": `Locatify Game ${config.gameCode}`
    }
  };
}