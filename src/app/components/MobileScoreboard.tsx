import React from 'react';
import './MobileScoreboard.css'
import ThemeToggle from './ThemeToggle';
import TeamViewToggle from './TeamViewToggle';
import { useTranslation } from '../hooks/useTranslation';
import { gameObserverService, ChallengePicture } from '../lib/game-observer-service';

// Image overlay component with navigation and download
const ImageOverlay: React.FC<{
  isOpen: boolean;
  images: Array<{ src: string; alt: string; filename?: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}> = ({ isOpen, images, currentIndex, onClose, onNavigate }) => {
  const currentImage = images[currentIndex];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate, currentIndex, images.length]);

  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = currentImage.filename || `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Header with counter and close button */}
        <div className="image-overlay-header">
          <div className="image-overlay-counter">
            {currentIndex + 1} / {images.length}
          </div>
          <button className="image-overlay-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Download button positioned at bottom left of image */}
        <button
          className="image-overlay-download"
          onClick={handleDownload}
          title="Download image"
        >
          ⬇
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`image-overlay-nav image-overlay-nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              title="Previous image"
            >
              ‹
            </button>
            <button
              className={`image-overlay-nav image-overlay-nav-next ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
              onClick={goToNext}
              disabled={currentIndex === images.length - 1}
              title="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Main image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="image-overlay-image"
        />

        {/* Thumbnail navigation for multiple images */}
        {images.length > 1 && (
          <div className="image-overlay-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`image-overlay-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => onNavigate(index)}
              >
                <img src={image.src} alt={image.alt} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const DynamicText: React.FC<any> = (text) => {
  console.log(text);

  const textLength: number = text.text.length;
  const style = { '--text-length': textLength } as React.CSSProperties;

  return <p className="dynamic-text" style={style}>{text.text}</p>;
}


// Component for challenge picture image with fallback
const ChallengePictureImage: React.FC<{
  challengePicture: ChallengePicture;
  onClick?: () => void;
}> = ({ challengePicture, onClick }) => {
  const [imageSrc, setImageSrc] = React.useState('https://cms.locatify.com' + challengePicture.url);
  const [hasError, setHasError] = React.useState(false);

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
  appName?: string;
  gameProject?: number;
  onClick?: () => void;

}> = ({ waypointId, treasureName, appName, gameProject, onClick }) => {
  // Build the treasure icon URL using the provided pattern

  const treasureIconUrl = React.useMemo(() => {
    if (appName && gameProject) {
      const url = `https://cms.locatify.com/store/point_image/${appName}/${gameProject}/${waypointId}/ld/`;
      return url;
    }
    // Fallback to the old pattern if we don't have the required parameters
    const fallbackUrl = `https://cms.locatify.com/store/point_image/turf_hunt/${waypointId}`;
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
    }
  };

  const handleLoad = () => {
    // Image loaded successfully
  };

  return (
    <img
      src={imageSrc}
      alt={treasureName}
      className="treasure-image"
      onError={handleError}
      onLoad={handleLoad}
      onClick={onClick}
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
  gameName?: string;
  useTimer?: boolean;
  gameType?: string;
  allTeams?: TeamData[];
  gameInstanceId?: number;
  teamId?: number;
  appName?: string;
  gameProject?: number;
  discoveredScore?: number;
  treasuresFoundData?: any[];
}

const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  gameStatus,
  treasures = [],
  coupons = [],
  teamName = 'Team',
  gameName,
  useTimer = false,
  gameType,
  allTeams = [],
  gameInstanceId,
  teamId,
  appName,
  gameProject,
  discoveredScore = 0,
  treasuresFoundData = []
}) => {

  const { t, locale } = useTranslation();
  // State for image overlay with navigation
  const [overlayState, setOverlayState] = React.useState<{
    isOpen: boolean;
    images: Array<{ src: string; alt: string; filename?: string }>;
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  // State for challenge pictures
  const [challengePictures, setChallengePictures] = React.useState<ChallengePicture[]>([]);



  // Fetch challenge pictures when component mounts or when gameInstanceId/teamId changes
  React.useEffect(() => {

    const fetchChallengePictures = async () => {
      if (!gameInstanceId || !teamId) {
        return;
      }

      try {
        const response = await gameObserverService.getChallengePictures(gameInstanceId, teamId);

        if (response.success && response.data) {
          setChallengePictures(response.data);
        } else {
          setChallengePictures([]);
        }
      } catch (error) {
        setChallengePictures([]);
      }
    };

    fetchChallengePictures();
  }, [gameInstanceId, teamId]);

  // State for CMS team view toggle
  const [activeTab, setActiveTab] = React.useState<'myTeam' | 'allTeams'>('myTeam');

  // Check if this is a CMS app
  const isCMSGame = gameType === 'CMS';

  // Calculate total score - use discovered score if available, otherwise fall back to treasures data
  const totalScore = discoveredScore > 0
    ? discoveredScore
    : treasures.reduce((sum: number, treasure: Treasure) => sum + treasure.score, 0);



  // Handle coupon image click
  const handleCouponImageClick = (couponId: number, couponName: string) => {
    const couponImages = coupons.map(coupon => ({
      src: `https://cms.locatify.com/store/get_coupon_image/turf_hunt/${coupon.id}`,
      alt: coupon.name,
      filename: `coupon-${coupon.name.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`
    }));

    const currentIndex = coupons.findIndex(coupon => coupon.id === couponId);

    setOverlayState({
      isOpen: true,
      images: couponImages,
      currentIndex: Math.max(0, currentIndex)
    });
  };

  // Handle challenge picture image click
  const handleChallengePictureClick = (challengePicture: ChallengePicture) => {
    const challengeImages = challengePictures.map((picture, index) => ({
      src: 'https://cms.locatify.com' + picture.url,
      alt: `Challenge picture from ${picture.upload_time}`,
      filename: `challenge-picture-${index + 1}.jpg`
    }));

    const currentIndex = challengePictures.findIndex(picture => picture.url === challengePicture.url);

    setOverlayState({
      isOpen: true,
      images: challengeImages,
      currentIndex: Math.max(0, currentIndex)
    });
  };

  // Handle treasure picture image click
  const handleTreasurePictureClick = (waypointId: any) => {
    const treasureImages = treasures.map(treasure => ({
      src: `https://cms.locatify.com/store/point_image/${appName}/${gameProject}/${treasure.id}/ld/`,
      alt: `Treasure: ${treasure.name}`,
      filename: `treasure-${treasure.name.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`
    }));

    const currentIndex = treasures.findIndex(treasure => treasure.id === waypointId);

    setOverlayState({
      isOpen: true,
      images: treasureImages,
      currentIndex: Math.max(0, currentIndex)
    });
  };

  // Close overlay
  const closeOverlay = () => {
    setOverlayState(prev => ({ ...prev, isOpen: false }));
  };

  // Navigate between images
  const handleImageNavigation = (index: number) => {
    setOverlayState(prev => ({ ...prev, currentIndex: index }));
  };
  // components/DynamicText.js



  return (
    <>
      <ImageOverlay
        isOpen={overlayState.isOpen}
        images={overlayState.images}
        currentIndex={overlayState.currentIndex}
        onClose={closeOverlay}
        onNavigate={handleImageNavigation}
      />
      <div className="game-over-container">
        <div className="game-over-content">
          {/* Game Name Header */}
          {gameName && (
            <div className="game-name-header">
              <DynamicText text={gameName} />
            </div>
          )}

          {/* Game Status Header */}
          <div className="game-over-header">
            <div className="header-content">
              <h1 className="game-over-title">
                {gameStatus === 'finished' ? t('gameStatus.finished') :
                  gameStatus === 'in_progress' ? t('gameStatus.inProgress') :
                    t('gameStatus.notStarted')}
              </h1>
              {/* <ThemeToggle className="header-theme-toggle" /> */}
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
                  {/* Badge with Player Icon */}
                  <div className="badge">
                    <img
                      src="/images/player_icons/player_icon_0.imageset/player_icon_0.png"
                      alt="Player icon"
                      className="badge-player-icon"
                      onError={(e) => {
                        // Fallback to a simple circle if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.badge-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'badge-fallback badge-circle';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
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

              {/* CMS Team View Toggle - Only shown for CMS games, positioned at the top */}
              {isCMSGame && (
                <TeamViewToggle
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              )}

              {/* Rewards Section - Hidden when All Teams is selected */}
              {coupons.length > 0 && (!isCMSGame || activeTab === 'myTeam') && (
                <div id='first' className="rewards-section">
                  <div className="rewards-header">
                    <h3 className="rewards-title">
                      <span className="mobile-count">{t('scoreboard.rewards')} </span>
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

              {/* Challenge Pictures Section - Hidden when All Teams is selected */}
              {challengePictures.length > 0 && (!isCMSGame || activeTab === 'myTeam') && (
                <div className="rewards-section">
                  <div className="rewards-header">
                    <h3 className="rewards-title">
                      <span className="mobile-count">{t('scoreboard.challengePictures')}</span>
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

              {/* Dynamic List Header and Content - Changes based on active tab */}
              <div className="treasures-header">
                <h3 className="treasures-title">
                  <span className="mobile-count">
                    {isCMSGame && activeTab === 'allTeams'
                      ? `${t('scoreboard.allTeams')}`
                      : `${t('scoreboard.treasuresDiscovered')}`
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
                      const playerIconIndex = index % 126; // Cycle through available player icons (0-125)
                      const playerIconPath = `/images/player_icons/player_icon_${playerIconIndex}.imageset/player_icon_${playerIconIndex}.png`;

                      return (
                        <div key={team.id} className="treasure-item">
                          <div className="treasure-content">
                            <div className="treasure-icon">
                              <img
                                src={playerIconPath}
                                alt={`${team.name} icon`}
                                className="team-player-icon"
                                onError={(e) => {
                                  // Fallback to default player icon if specific icon fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/player_icons/player_icon_0.imageset/player_icon_0.png';
                                }}
                              />
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
                      <div className="treasure-icon">
                        <img
                          src="/images/player_icons/player_icon_0.imageset/player_icon_0.png"
                          alt="No teams icon"
                          className="team-player-icon"
                        />
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
                            appName={appName}
                            gameProject={gameProject}
                            onClick={() => handleTreasurePictureClick(treasure.id)}

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