import React from 'react';
import './MobileScoreboard.css'
import ThemeToggle from './ThemeToggle';
import { useTranslation } from '../hooks/useTranslation';

// Component for coupon image with fallback
const CouponImage: React.FC<{ couponId: number; couponName: string }> = ({ couponId, couponName }) => {
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
      className="coupon-image"
      onError={handleError}
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

interface MobileScoreboardProps {
  gameStatus: 'in_progress' | 'finished' | 'not_started';
  treasures: Treasure[];
  coupons?: Coupon[];
  teamName?: string;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
  useTimer?: boolean;
}

const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  gameStatus,
  treasures = [],
  coupons = [],
  teamName = 'Team',
  onEndGame,
  showEndGameButton = false,
  useTimer = false
}) => {
  console.log('MobileScoreboard treasures:', treasures);
  console.log('MobileScoreboard coupons:', coupons);

  const { t, locale } = useTranslation();

  // Debug: Log current locale
  React.useEffect(() => {
    console.log('MobileScoreboard - Current locale:', locale);
  }, [locale]);

  // Calculate total score from actual treasures data
  const totalScore = treasures.reduce((sum: number, treasure: Treasure) => sum + treasure.score, 0);

  return (
    <>
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

          {/* Treasures Section Container - With relative positioning */}
          <div className="treasures-container">
            {/* Score Display Section - Absolute positioned */}


            {/* Treasures List - with padding for absolute content above */}
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
              {/* Rewards Section */}
              {coupons.length > 0 && (
                <div className="rewards-section">
                  <div className="rewards-header">
                    <h3 className="rewards-title">{t('scoreboard.rewards')} ({coupons.length})</h3>
                  </div>
                  <div className="rewards-list">
                    {coupons.map((coupon: Coupon) => (
                      <div key={coupon.id} >
                        <div className="reward-image">
                          <CouponImage couponId={coupon.id} couponName={coupon.name} />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="treasures-header">
                <h3 className="treasures-title">{t('scoreboard.treasuresDiscovered')} ({treasures.length})</h3>
                <h3 className="treasures-title">{t('scoreboard.totalScore')}</h3>
              </div>

              {/* Treasure Items */}
              {treasures.length > 0 ? (
                treasures.map((treasure: Treasure) => (
                  <div key={treasure.id} className="treasure-item">
                    <div className="treasure-content">
                      <div className="treasure-icon">
                        {treasure.image ? (
                          <img
                            src={treasure.image}
                            alt={treasure.name}
                            className="treasure-image"
                          />
                        ) : (
                          treasure.icon
                        )}
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
              )}
            </div>


          </div>

          {/* End Game Button */}
          {showEndGameButton && onEndGame && (
            <div className="end-game-section">
              <button
                onClick={onEndGame}
                className="end-game-button"
              >
                {t('scoreboard.endGame')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileScoreboard;