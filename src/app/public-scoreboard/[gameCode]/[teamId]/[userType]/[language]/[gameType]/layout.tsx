// src/app/public-scoreboard/[gameCode]/[teamId]/[userType]/[language]/[gameType]/layout.tsx
// Dynamic layout with metadata for public scoreboard pages

import { generateDynamicOGImage, generateGameSchema, generateSEOMetadata, generateTeamSchema } from "@/app/lib/seo";
import type { Metadata } from "next";

interface ScoreboardLayoutProps {
  children: React.ReactNode;
  params: {
    gameCode: string;
    teamId: string;
    userType: string;
    language: string;
    gameType: string;
  };
}

// This function generates metadata dynamically based on the route parameters
export async function generateMetadata({ params }: { params: ScoreboardLayoutProps['params'] }): Promise<Metadata> {
  const { gameCode, teamId, userType, language, gameType } = params;
  
  // You could fetch actual team data here if needed
  // For now, we'll use the route parameters to generate metadata
  const teamName = `Team ${teamId}`;
  const gameCodeUpper = gameCode.toUpperCase();
  
  // Generate dynamic Open Graph image URL
  const dynamicImage = generateDynamicOGImage({
    gameCode: gameCodeUpper,
    teamName,
    gameStatus: 'in_progress' // You could determine this from an API call
  });

  // Generate the current page URL
  const currentUrl = `/public-scoreboard/${gameCode}/${teamId}/${userType}/${language}/${gameType}`;

  return generateSEOMetadata({
    title: `${teamName} - Game ${gameCodeUpper} Live Scoreboard`,
    description: `Follow ${teamName}'s progress in PowerMaps game ${gameCodeUpper}. Watch their live score and see their treasure hunting achievements in real-time!`,
    image: dynamicImage,
    url: currentUrl,
    type: 'article',
    gameCode: gameCodeUpper,
    teamName,
    locale: language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`
  });
}

export default function ScoreboardLayout({ children, params }: ScoreboardLayoutProps) {
  const { gameCode, teamId, userType, language, gameType } = params;
  const teamName = `Team ${teamId}`;
  const gameCodeUpper = gameCode.toUpperCase();
  const currentUrl = `https://powermaps.app/public-scoreboard/${gameCode}/${teamId}/${userType}/${language}/${gameType}`;

  // Generate structured data for better SEO
  const gameSchema = generateGameSchema({
    gameCode: gameCodeUpper,
    teamName,
    url: currentUrl
  });

  const teamSchema = generateTeamSchema({
    teamName,
    teamScore: 0, // You could fetch this from an API
    gameCode: gameCodeUpper,
    url: currentUrl
  });

  return (
    <>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(teamSchema)
        }}
      />
      
      {/* Additional meta tags specific to this page */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="article:section" content="Gaming" />
      <meta property="article:tag" content="treasure hunt" />
      <meta property="article:tag" content="location-based game" />
      <meta property="article:tag" content="team competition" />
      <meta property="article:tag" content={`game-${gameCodeUpper}`} />
      <meta property="article:tag" content={teamName.toLowerCase().replace(' ', '-')} />
      
      {/* Additional Open Graph tags */}
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Twitter-specific tags */}
      <meta name="twitter:label1" content="Game Code" />
      <meta name="twitter:data1" content={gameCodeUpper} />
      <meta name="twitter:label2" content="Team" />
      <meta name="twitter:data2" content={teamName} />
      
      {children}
    </>
  );
}