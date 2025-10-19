// hooks/useRouteParams.ts
// React hook for handling route parameter parsing and validation

import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { RouteParser } from '../lib/route-parser';

export interface UseRouteParamsOptions {
  validateOnMount?: boolean;
  customValidationRules?: {
    gameCodeMinLength?: number;
    validUserTypes?: string[];
    validLanguages?: string[];
    validGameTypes?: string[];
  };
}

export function usePublicScoreboardRoute(options: UseRouteParamsOptions = {}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const routeData = useMemo(() => {
    // Check if this is a valid public scoreboard route
    if (!RouteParser.isPublicScoreboardRoute(pathname)) {
      return {
        isValidRoute: false,
        error: 'Not a valid public scoreboard route',
        parsedData: null,
        searchParams: {},
        originalParams: params
      };
    }

    // Extract and parse parameters
    const extractedParams = RouteParser.extractParamsFromPath(pathname);
    if (!extractedParams) {
      return {
        isValidRoute: false,
        error: 'Could not extract parameters from path',
        parsedData: null,
        searchParams: {},
        originalParams: params
      };
    }

    // Parse and validate
    const parsedData = RouteParser.parsePublicScoreboardRoute(
      extractedParams,
      options.customValidationRules
    );

    // Parse search parameters
    const searchParamsObj = RouteParser.parseSearchParams(searchParams);

    return {
      isValidRoute: true,
      error: null,
      parsedData,
      searchParams: searchParamsObj,
      originalParams: params,
      pathname
    };
  }, [params, searchParams, pathname, options.customValidationRules]);

  return routeData;
}

// Hook specifically for game code validation
export function useGameCode() {
  const params = useParams();
  
  const gameCodeData = useMemo(() => {
    const gameCode = params.gameCode as string;
    const validation = RouteParser.validateGameCode(gameCode);
    
    return {
      gameCode: gameCode?.toUpperCase() || '',
      isValid: validation.isValid,
      error: validation.error
    };
  }, [params.gameCode]);

  return gameCodeData;
}

// Hook specifically for team ID validation
export function useTeamId() {
  const params = useParams();
  
  const teamIdData = useMemo(() => {
    const teamIdStr = params.teamId as string;
    const validation = RouteParser.validateTeamId(teamIdStr);
    
    return {
      teamIdString: teamIdStr || '',
      teamId: validation.teamId || 0,
      isValid: validation.isValid,
      error: validation.error
    };
  }, [params.teamId]);

  return teamIdData;
}

// Hook for generating URLs
export function useRouteGenerator() {
  const generateUrl = (data: {
    gameCode: string;
    teamId: number;
    userType: string;
    language: string;
    gameType: string;
  }) => {
    return RouteParser.generatePublicScoreboardUrl({
      ...data,
      baseUrl: window.location.origin
    });
  };

  const generateRelativeUrl = (data: {
    gameCode: string;
    teamId: number;
    userType: string;
    language: string;
    gameType: string;
  }) => {
    return RouteParser.generatePublicScoreboardUrl(data);
  };

  return {
    generateUrl,
    generateRelativeUrl
  };
}

// Combined hook for route data and API calls
export function usePublicScoreboardData(options: UseRouteParamsOptions = {}) {
  const routeInfo = usePublicScoreboardRoute(options);
  
  // Return combined data
  return {
    // Route information
    ...routeInfo,
    
    // Helper functions
    getRouteDescription: () => {
      if (!routeInfo.parsedData) return '';
      return RouteParser.getRouteDescription(routeInfo.parsedData);
    },
    
    isPlayerView: () => routeInfo.parsedData?.userType === 'player',
    isObserverView: () => routeInfo.parsedData?.userType === 'observer',
    isAdminView: () => routeInfo.parsedData?.userType === 'admin',
    
    // Game type checks
    isTurfHunt: () => routeInfo.parsedData?.gameType === 'turf_hunt',
    isTreasureHunt: () => routeInfo.parsedData?.gameType === 'treasure_hunt',
    
    // Language helpers
    isEnglish: () => routeInfo.parsedData?.language === 'en',
    getLanguageCode: () => routeInfo.parsedData?.language || 'en',
    
    // Validation helpers
    hasValidationErrors: () => (routeInfo.parsedData?.errors?.length || 0) > 0,
    getValidationErrorsFormatted: () => {
      if (!routeInfo.parsedData?.errors) return '';
      return RouteParser.getValidationErrorsFormatted(routeInfo.parsedData.errors);
    }
  };
}