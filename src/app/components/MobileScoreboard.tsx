import React from 'react';
import './MobileScoreboard.css'
import ThemeToggle from './ThemeToggle';
import { useTranslation } from '../hooks/useTranslation';

interface Treasure {
  id: number;
  icon: string;
  name: string;
  score: number;
  image?: string;
  foundAt?: string;
}

interface Coupon {
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
}

const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  gameStatus,
  treasures = [],
  coupons = [],
  teamName = 'Team',
  onEndGame,
  showEndGameButton = false
}) => {
  console.log('MobileScoreboard treasures:', treasures);

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
                <div className="score-item time">
                  <h2 className="score-label">{t('scoreboard.time')}</h2>
                  <div className="score-circle">
                    <span className="score-number">0</span>
                  </div>
                </div>
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
                          <img
                            src={`/store/get_coupon_image/turf_hunt/${coupon.id}`}
                            alt={coupon.name}
                            className="coupon-image"
                            onError={(e) => {
                              // Hide image if it fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
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