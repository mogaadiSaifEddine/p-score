import React from 'react';
import './MobileScoreboard.css'
import ThemeToggle from './ThemeToggle';
import TeamViewToggle from './TeamViewToggle';
import { useTranslation } from '../hooks/useTranslation';
import { gameObserverService, ChallengePicture } from '../lib/game-observer-service';

// Image overlay component
const ImageOverlay: React.FC<{
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}> = ({ isOpen, imageSrc, imageAlt, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-overlay-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-overlay-close" onClick={onClose}>
          ×
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="image-overlay-image"
        />
      </div>
    </div>
  );
};

// Component for challenge picture image with fallback
const ChallengePictureImage: React.FC<{
  challengePicture: ChallengePicture;
  onClick?: () => void;
}> = ({ challengePicture, onClick }) => {
  const [imageSrc, setImageSrc] = React.useState('https://cms.locatify.com' + challengePicture.url);
  const [hasError, setHasError] = React.useState(false);
  console.log(challengePicture);

  // Default challenge picture image as SVG data URL
  const defaultChallengeImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="60" rx="8" fill="#f3f4f6"/>
      <rect x="2" y="2" width="96" height="56" rx="6" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="20" cy="20" r="6" fill="#e5e7eb"/>
      <path d="M30 35 L45 20 L60 30 L75 15 L90 25 L90 50 L10 50 Z" fill="#d1d5db"/>
      <rect x="35" y="40" width="30" height="3" rx="1.5" fill="#9ca3af"/>
      <rect x="40" y="45" width="20" height="2" rx="1" fill="#d1d5db"/>
    </svg>
  `)}`;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(defaultChallengeImage);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={`Challenge picture from ${challengePicture.upload_time}`}
      className={`coupon-image ${onClick ? 'coupon-image-clickable' : ''}`}
      onError={handleError}
      onClick={onClick}
    />
  );
};

// Component for coupon image with fallback
const CouponImage: React.FC<{
  couponId: number;
  couponName: string;
  onClick?: () => void;
}> = ({ couponId, couponName, onClick }) => {
  const [imageSrc, setImageSrc] = React.useState(
    `https://cms.locatify.com/store/get_coupon_image/turf_hunt/${couponId}`
  );
  const [hasError, setHasError] = React.useState(false);

  // Default coupon image as SVG data URL
  const defaultCouponImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="60" rx="8" fill="#f3f4f6"/>
      <rect x="2" y="2" width="96" height="56" rx="6" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="15" cy="30" r="8" fill="#e5e7eb"/>
      <circle cx="85" cy="30" r="8" fill="#e5e7eb"/>
      <rect x="25" y="20" width="50" height="4" rx="2" fill="#d1d5db"/>
      <rect x="30" y="28" width="40" height="3" rx="1.5" fill="#e5e7eb"/>
      <rect x="35" y="35" width="30" height="3" rx="1.5" fill="#e5e7eb"/>
      <path d="M15 22 L15 38 M11 30 L19 30" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M85 22 L85 38 M81 30 L89 30" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `)}`;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(defaultCouponImage);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={couponName}
      className={`coupon-image ${onClick ? 'coupon-image-clickable' : ''}`}
      onError={handleError}
      onClick={onClick}
    />
  );
};

// Component for treasure image with fallback
const TreasureImage: React.FC<{
  waypointId: number;
  treasureName: string;
  fallbackIcon: string;
  appName?: string;
  gameProject?: number;
}> = ({ waypointId, treasureName, fallbackIcon, appName, gameProject }) => {
  // Build the treasure icon URL using the provided pattern
  console.log(appName, gameProject , 'gameproj');
  
  const treasureIconUrl = React.useMemo(() => {
    if (appName && gameProject) {
      const url = `https://cms.locatify.com/store/point_image/${appName}/${gameProject}/${waypointId}/ld/`;
      console.log('Treasure icon URL:', url);
      return url;
    }
    // Fallback to the old pattern if we don't have the required parameters
    const fallbackUrl = `https://cms.locatify.com/store/point_image/turf_hunt/${waypointId}`;
    console.log('Treasure icon fallback URL:', fallbackUrl);
    return fallbackUrl;
  }, [appName, gameProject, waypointId]);

  const [imageSrc, setImageSrc] = React.useState(treasureIconUrl);
  const [hasError, setHasError] = React.useState(false);

  // Update image source when URL changes
  React.useEffect(() => {
    setImageSrc(treasureIconUrl);
    setHasError(false);
  }, [treasureIconUrl]);

  // Default treasure image as SVG data URL
  const defaultTreasureImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="20" cy="20" r="12" fill="#fcd34d"/>
      <path d="M20 12 L22 16 L26 16 L23 19 L24 23 L20 21 L16 23 L17 19 L14 16 L18 16 Z" fill="#f59e0b"/>
    </svg>
  `)}`;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(defaultTreasureImage);
      console.log('Treasure icon failed to load, using default SVG for:', treasureName);
    }
  };

  const handleLoad = () => {
    if (!hasError) {
      console.log('Treasure icon loaded successfully for:', treasureName);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={treasureName}
      className="treasure-image"
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

interface Treasure {
  id: number;
  icon: string;
  name: string;
  score: number;
  image?: string;
  foundAt?: string;
}

export interface Coupon {
  id: number;
  name: string;
  description?: string;
}

export interface TeamData {
  id: number;
  name: string;
  score: number;
  color?: string;
  players?: any[];
  has_finished?: boolean;
}

interface MobileScoreboardProps {
  gameStatus: 'in_progress' | 'finished' | 'not_started';
  treasures: Treasure[];
  coupons?: Coupon[];
  teamName?: string;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
  useTimer?: boolean;
  gameType?: string;
  allTeams?: TeamData[];
  gameInstanceId?: number;
  teamId?: number;
  appName?: string;
  gameProject?: number;
}

const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  gameStatus,
  treasures = [],
  coupons = [],
  teamName = 'Team',
  onEndGame,
  showEndGameButton = false,
  useTimer = false,
  gameType,
  allTeams = [],
  gameInstanceId,
  teamId,
  appName,
  gameProject
}) => {

  const { t, locale } = useTranslation();

  // State for image overlay
  const [overlayImage, setOverlayImage] = React.useState<{
    src: string;
    alt: string;
  } | null>(null);

  // State for challenge pictures
  const [challengePictures, setChallengePictures] = React.useState<ChallengePicture[]>([]);
  const [challengePicturesLoading, setChallengePicturesLoading] = React.useState(false);
  const [challengePicturesError, setChallengePicturesError] = React.useState<string | null>(null);

  // Debug: Log current locale
  React.useEffect(() => {
  }, [locale]);

  // Fetch challenge pictures when component mounts or when gameInstanceId/teamId changes
  React.useEffect(() => {
    console.log('gameInstanceId', gameInstanceId);

    const fetchChallengePictures = async () => {
      if (!gameInstanceId || !teamId) {
        return;
      }

      setChallengePicturesLoading(true);
      setChallengePicturesError(null);

      try {
        const response = await gameObserverService.getChallengePictures(gameInstanceId, teamId);

        if (response.success && response.data) {
          setChallengePictures(response.data);
        } else {
          setChallengePicturesError(response.error || 'Failed to fetch challenge pictures');
          setChallengePictures([]);
        }
      } catch (error) {
        setChallengePicturesError(error instanceof Error ? error.message : 'Unknown error occurred');
        setChallengePictures([]);
      } finally {
        setChallengePicturesLoading(false);
      }
    };

    fetchChallengePictures();
  }, [gameInstanceId, teamId]);

  // State for CMS team view toggle
  const [activeTab, setActiveTab] = React.useState<'myTeam' | 'allTeams'>('myTeam');

  // Check if this is a CMS app
  const isCMSGame = gameType === 'CMS';

  // Calculate total score from actual treasures data
  const totalScore = treasures.reduce((sum: number, treasure: Treasure) => sum + treasure.score, 0);



  // Handle coupon image click
  const handleCouponImageClick = (couponId: number, couponName: string) => {
    setOverlayImage({
      src: `https://cms.locatify.com/store/get_coupon_image/turf_hunt/${couponId}`,
      alt: couponName
    });
  };

  // Handle challenge picture image click
  const handleChallengePictureClick = (challengePicture: ChallengePicture) => {
    setOverlayImage({
      src: 'https://cms.locatify.com' + challengePicture.url,
      alt: `Challenge picture from ${challengePicture.upload_time}`
    });
  };

  // Close overlay
  const closeOverlay = () => {
    setOverlayImage(null);
  };

  // Team color combinations based on badge shapes
  // Each team gets a different background color using one of the shape colors
  // The shape that matches the background becomes white for contrast
  const getTeamColorCombination = (index: number) => {
    const combinations = [
      {
        background: 'var(--score-accent)', // Circle color as background
        shapes: { circle: '#ffffff', triangle: '#7189e3', square: '#ff7280' }
      },
      {
        background: '#7189e3', // Triangle color as background
        shapes: { circle: 'var(--score-accent)', triangle: '#ffffff', square: '#ff7280' }
      },
      {
        background: '#ff7280', // Square color as background
        shapes: { circle: 'var(--score-accent)', triangle: '#7189e3', square: '#ffffff' }
      },
      {
        background: '#22c55e', // Green as 4th option
        shapes: { circle: 'var(--score-accent)', triangle: '#7189e3', square: '#ff7280' }
      }
    ];

    return combinations[index % combinations.length];
  };

  return (
    <>
      <ImageOverlay
        isOpen={!!overlayImage}
        imageSrc={overlayImage?.src || ''}
        imageAlt={overlayImage?.alt || ''}
        onClose={closeOverlay}
      />
      <div className="game-over-container">
        <div className="game-over-content">
          {/* Game Status Header */}
          <div className="game-over-header">
            <div className="header-content">
              <h1 className="game-over-title">
                {gameStatus === 'finished' ? t('gameStatus.finished') :
                  gameStatus === 'in_progress' ? t('gameStatus.inProgress') :
                    t('gameStatus.notStarted')}
              </h1>
              <ThemeToggle className="header-theme-toggle" />
            </div>
          </div>

          {/* Main Content - Always shown */}
          <div className="treasures-container">
            {/* Score Display Section - Always shown */}
            <div className="treasures-list">
              <div className="score-section">
                {/* Left - Total Score Label and Circle */}
                <div className="score-item">
                  <h2 className="score-label">{t('scoreboard.totalScore')}</h2>
                  <div className="score-circle">
                    <span className="score-number">{totalScore}</span>
                  </div>
                </div>

                {/* Center - Badge and Score Box */}
                <div className="badge-container">
                  {/* Badge */}
                  <div className="badge">
                    {/* Shapes inside badge */}
                    <div className="badge-shapes">
                      <div className="badge-circle"></div>
                      <div className="badge-triangle"></div>
                      <div className="badge-square"></div>
                    </div>
                  </div>

                  {/* Large Score Box - Below Badge */}
                  <div className="score-box">
                    <span className="score-box-number">{teamName}</span>
                  </div>
                </div>

                {/* Right - Time Label and Circle */}
                {useTimer && (
                  <div className="score-item time">
                    <h2 className="score-label">{t('scoreboard.time')}</h2>
                    <div className="score-circle">
                      <span className="score-number">0</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rewards Section - Always shown */}
              {coupons.length > 0 && (
                <div className="rewards-section">
                  <div className="rewards-header">
                    <h3 className="rewards-title">
                      <span className="mobile-count">{t('scoreboard.rewards')} ({coupons.length})</span>
                    </h3>
                  </div>
                  <div className="rewards-list">
                    {coupons.map((coupon: Coupon) => (
                      <div key={coupon.id} >
                        <div className="reward-image">
                          <CouponImage
                            couponId={coupon.id}
                            couponName={coupon.name}
                            onClick={() => handleCouponImageClick(coupon.id, coupon.name)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenge Pictures Section - Only shown when pictures are available */}
              {challengePictures.length > 0 && (
                <div className="rewards-section">
                  <div className="rewards-header">
                    <h3 className="rewards-title">
                      <span className="mobile-count">{t('scoreboard.challengePictures')} ({challengePictures.length})</span>
                    </h3>
                  </div>
                  <div className="rewards-list">
                    {challengePictures.map((picture: ChallengePicture, index: number) => (
                      <div key={`${picture.file_path}-${index}`}>
                        <div className="reward-image">
                          <ChallengePictureImage
                            challengePicture={picture}
                            onClick={() => handleChallengePictureClick(picture)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CMS Team View Toggle - Only shown for CMS games, positioned between rewards and list */}
              {isCMSGame && (
                <TeamViewToggle
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              )}

              {/* Dynamic List Header and Content - Changes based on active tab */}
              <div className="treasures-header">
                <h3 className="treasures-title">
                  <span className="mobile-count">
                    {isCMSGame && activeTab === 'allTeams'
                      ? `${t('scoreboard.allTeams')} (${allTeams.length})`
                      : `${t('scoreboard.treasuresDiscovered')} (${treasures.length})`
                    }
                  </span>
                </h3>
                <h3 className="treasures-title desktop-dynamic-header">
                  <span className="mobile-header">{t('scoreboard.points')}</span>
                 
                </h3>
              </div>

              {/* Dynamic List Content - Changes based on active tab */}
              {isCMSGame && activeTab === 'allTeams' ? (
                /* All Teams List */
                allTeams.length > 0 ? (
                  allTeams
                    .sort((a, b) => b.score - a.score) // Sort by score descending
                    .map((team: TeamData, index: number) => {
                      const colorCombination = getTeamColorCombination(index);
                      return (
                        <div key={team.id} className="treasure-item">
                          <div className="treasure-content">
                            <div
                              className="treasure-icon team-badge"
                              style={{
                                '--team-bg-color': colorCombination.background,
                                '--team-circle-color': colorCombination.shapes.circle,
                                '--team-triangle-color': colorCombination.shapes.triangle,
                                '--team-square-color': colorCombination.shapes.square
                              } as React.CSSProperties}
                            >
                              {/* Team badge shapes with custom colors */}
                              <div className="badge-shapes">
                                <div className="badge-circle"></div>
                                <div className="badge-triangle"></div>
                                <div className="badge-square"></div>
                              </div>
                            </div>
                            <span className="treasure-name">{team.name}</span>
                          </div>
                          <div className="treasure-score">{team.score}</div>
                        </div>
                      );
                    })
                ) : (
                  <div className="treasure-item">
                    <div className="treasure-content">
                      <div
                        className="treasure-icon team-badge"
                        style={{ '--team-bg-color': 'var(--bg-secondary)' } as React.CSSProperties}
                      >
                        {/* Empty state badge shapes */}
                        <div className="badge-shapes">
                          <div className="badge-circle"></div>
                          <div className="badge-triangle"></div>
                          <div className="badge-square"></div>
                        </div>
                      </div>
                      <span className="treasure-name">{t('scoreboard.noTeams')}</span>
                    </div>
                    <div className="treasure-score">0</div>
                  </div>
                )
              ) : (
                /* My Team Treasures List */
                treasures.length > 0 ? (
                  treasures.map((treasure: Treasure) => (
                    <div key={treasure.id} className="treasure-item">
                      <div className="treasure-content">
                        <div className="treasure-icon">
                          <TreasureImage
                            waypointId={treasure.id}
                            treasureName={treasure.name}
                            fallbackIcon={treasure.icon}
                            appName={appName}
                            gameProject={gameProject}
                          />
                        </div>
                        <span className="treasure-name">{treasure.name}</span>
                      </div>
                      <div className="treasure-score">{treasure.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="treasure-item">
                    <div className="treasure-content">
                      <div className="treasure-icon">🏴‍☠️</div>
                      <span className="treasure-name">{t('scoreboard.noTreasures')}</span>
                    </div>
                    <div className="treasure-score">0</div>
                  </div>
                )
              )}
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default MobileScoreboard;