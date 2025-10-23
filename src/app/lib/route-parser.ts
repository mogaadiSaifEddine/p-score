// lib/route-parser.ts
// Utility for parsing and validating route parameters

import { ReadonlyURLSearchParams } from 'next/navigation';

export interface RouteParams {
  gameCode: string;
  teamId: string;
  userType: string;
  language: string;
  appName: string;
}

export interface ParsedRouteData {
  gameCode: string;
  teamId: number;
  userType: 'player' | 'observer' | 'admin';
  language: string;
  appName: string;
  isValid: boolean;
  errors: string[];
}

export interface RouteValidationRules {
  gameCodeMinLength?: number;
  validUserTypes?: string[];
  validLanguages?: string[];
  validAppNames?: string[];
}

export class RouteParser {
  private static defaultRules: RouteValidationRules = {
    gameCodeMinLength: 3,
    validUserTypes: ['player', 'observer', 'admin'],
    validLanguages: ['en', 'fr', 'es', 'is', 'de', 'fi'],
    validAppNames: ['turf_hunt', 'treasure_hunt', 'scavenger_hunt', 'quiz_game'],
  };

  static parsePublicScoreboardRoute(
    params: RouteParams,
    rules: RouteValidationRules = {}
  ): ParsedRouteData {
    const validationRules = { ...this.defaultRules, ...rules };
    const errors: string[] = [];

    // Extract parameters
    const gameCode = params.gameCode?.trim();
    const teamIdStr = params.teamId?.trim();
    const userType = params.userType?.toLowerCase().trim();
    const language = params.language?.toLowerCase().trim();
    const appName = params.appName?.toLowerCase().trim();

    // Validate gameCode
    if (!gameCode) {
      errors.push('Game code is required');
    } else if (gameCode.length < (validationRules.gameCodeMinLength || 3)) {
      errors.push(`Game code must be at least ${validationRules.gameCodeMinLength} characters`);
    } else if (!/^[A-Z0-9]+$/i.test(gameCode)) {
      errors.push('Game code must contain only letters and numbers');
    }

    // Validate and parse teamId
    const teamId = parseInt(teamIdStr);
    if (!teamIdStr) {
      errors.push('Team ID is required');
    } else if (isNaN(teamId) || teamId < 1) {
      errors.push('Team ID must be a positive number');
    }

    // Validate userType
    if (!userType) {
      errors.push('User type is required');
    } else if (!validationRules.validUserTypes?.includes(userType)) {
      errors.push(`User type must be one of: ${validationRules.validUserTypes?.join(', ')}`);
    }

    // Validate language with fallback to English
    let validatedLanguage = language;
    if (
      !language ||
      language.length !== 2 ||
      (validationRules.validLanguages && !validationRules.validLanguages.includes(language))
    ) {
      validatedLanguage = 'en';
    }

    // Validate appName
    if (!appName) {
      errors.push('App name is required');
    } else if (
      validationRules.validAppNames &&
      !validationRules.validAppNames.includes(appName)
    ) {
      errors.push(`App name must be one of: ${validationRules.validAppNames.join(', ')}`);
    }

    return {
      gameCode: gameCode.toUpperCase(),
      teamId,
      userType: userType as 'player' | 'observer' | 'admin',
      language: validatedLanguage.toLowerCase(),
      appName: appName.toLowerCase(),
      isValid: errors.length === 0,
      errors,
    };
  }

  static generatePublicScoreboardUrl(data: {
    gameCode: string;
    teamId: number;
    userType: string;
    language: string;
    appName: string;
    baseUrl?: string;
  }): string {
    const { gameCode, teamId, userType, language, appName, baseUrl = '' } = data;

    return `${baseUrl}/public-scoreboard/${gameCode.toUpperCase()}/${teamId}/${userType.toLowerCase()}/${language.toLowerCase()}/${appName.toLowerCase()}`;
  }

  static parseSearchParams(
    searchParams: URLSearchParams | ReadonlyURLSearchParams
  ): Record<string, string> {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  static validateGameCode(gameCode: string): { isValid: boolean; error?: string } {
    if (!gameCode) {
      return { isValid: false, error: 'Game code is required' };
    }

    if (gameCode.length < 3) {
      return { isValid: false, error: 'Game code must be at least 3 characters' };
    }

    if (!/^[A-Z0-9]+$/i.test(gameCode)) {
      return { isValid: false, error: 'Game code must contain only letters and numbers' };
    }

    return { isValid: true };
  }

  static validateTeamId(teamId: string | number): {
    isValid: boolean;
    teamId?: number;
    error?: string;
  } {
    const id = typeof teamId === 'string' ? parseInt(teamId) : teamId;

    if (isNaN(id) || id < 1) {
      return { isValid: false, error: 'Team ID must be a positive number' };
    }

    return { isValid: true, teamId: id };
  }

  static validateLanguage(language: string): {
    isValid: boolean;
    language: string;
    error?: string;
  } {
    if (!language) {
      return {
        isValid: false,
        language: 'en',
        error: 'Language is required, falling back to English',
      };
    }

    const normalizedLang = language.toLowerCase().trim();

    if (normalizedLang.length !== 2) {
      return {
        isValid: false,
        language: 'en',
        error: 'Language must be a 2-character code, falling back to English',
      };
    }

    if (!this.defaultRules.validLanguages?.includes(normalizedLang)) {
      return {
        isValid: false,
        language: 'en',
        error: `Unsupported language '${normalizedLang}', falling back to English`,
      };
    }

    return { isValid: true, language: normalizedLang };
  }

  static getRouteDescription(routeData: ParsedRouteData): string {
    const { gameCode, teamId, userType, language, appName } = routeData;

    const userTypeDescriptions = {
      player: 'Player View',
      observer: 'Observer View',
      admin: 'Admin View',
    };

    const appNameDescriptions = {
      turf_hunt: 'Turf Hunt',
      treasure_hunt: 'Treasure Hunt',
      scavenger_hunt: 'Scavenger Hunt',
      quiz_game: 'Quiz Game',
    };

    return `${appNameDescriptions[appName] || appName} - ${userTypeDescriptions[userType] || userType} for Team ${teamId} in Game ${gameCode} (${language.toUpperCase()})`;
  }

  static getValidationErrorsFormatted(errors: string[]): string {
    if (errors.length === 0) return '';

    if (errors.length === 1) {
      return errors[0];
    }

    return `Multiple errors: ${errors.join('; ')}`;
  }

  // Helper to check if current route matches expected pattern
  static isPublicScoreboardRoute(pathname: string): boolean {
    const pattern = /^\/public-scoreboard\/[^\/]+\/\d+\/[^\/]+\/[^\/]+\/[^\/]+\/?$/;
    return pattern.test(pathname);
  }

  // Extract parameters from pathname
  static extractParamsFromPath(pathname: string): RouteParams | null {
    const match = pathname.match(
      /^\/public-scoreboard\/([^\/]+)\/(\d+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/?$/
    );

    if (!match) return null;

    return {
      gameCode: match[1],
      teamId: match[2],
      userType: match[3],
      language: match[4],
      appName: match[5],
    };
  }

  // Parse route with automatic language fallback and redirect suggestion
  static parsePublicScoreboardRouteWithFallback(
    params: RouteParams,
    rules: RouteValidationRules = {}
  ): ParsedRouteData & { shouldRedirect?: boolean; redirectUrl?: string } {
    const originalLanguage = params.language?.toLowerCase().trim();
    const parsedData = this.parsePublicScoreboardRoute(params, rules);

    // Check if language was changed due to fallback
    const languageChanged = originalLanguage !== parsedData.language;

    if (languageChanged && parsedData.isValid) {
      // Generate redirect URL with corrected language
      const redirectUrl = this.generatePublicScoreboardUrl({
        gameCode: parsedData.gameCode,
        teamId: parsedData.teamId,
        userType: parsedData.userType,
        language: parsedData.language,
        appName: parsedData.appName,
      });

      return {
        ...parsedData,
        shouldRedirect: true,
        redirectUrl,
      };
    }

    return parsedData;
  }
}

// Export convenience functions
export const parsePublicScoreboardRoute = RouteParser.parsePublicScoreboardRoute;
export const parsePublicScoreboardRouteWithFallback =
  RouteParser.parsePublicScoreboardRouteWithFallback;
export const generatePublicScoreboardUrl = RouteParser.generatePublicScoreboardUrl;
export const validateGameCode = RouteParser.validateGameCode;
export const validateTeamId = RouteParser.validateTeamId;
export const validateLanguage = RouteParser.validateLanguage;
