import React from 'react';
import './MobileScoreboard.css'

interface Treasure {
  id: number;
  icon: string;
  name: string;
  score: number;
  image?: string;
  foundAt?: string;
}

interface MobileScoreboardProps {
  gameStatus: 'in_progress' | 'finished' | 'not_started';
  treasures: Treasure[];
  teamName?: string;
  onEndGame?: () => void;
  showEndGameButton?: boolean;
}

const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  gameStatus,
  treasures = [],
  teamName = 'Team',
  onEndGame,
  showEndGameButton = false
}) => {
  console.log('MobileScoreboard treasures:', treasures);
  
  // Calculate total score from actual treasures data
  const totalScore = treasures.reduce((sum: number, treasure: Treasure) => sum + treasure.score, 0);

  return (
    <>
      <div className="game-over-container">
        <div className="game-over-content">
          {/* Game Status Header */}
          <div className="game-over-header">
            <h1 className="game-over-title">
              {gameStatus === 'finished' ? 'Game over' : 
               gameStatus === 'in_progress' ? 'Game in progress' : 
               'Game not started'}
            </h1>
          </div>

          {/* Treasures Section Container - With relative positioning */}
          <div className="treasures-container">
            {/* Score Display Section - Absolute positioned */}
          

            {/* Treasures List - with padding for absolute content above */}
            <div className="treasures-list">
                <div className="score-section">
              {/* Left - Total Score Label and Circle */}
              <div className="score-item">
                <h2 className="score-label">Total Score</h2>
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
                <h2 className="score-label">Time</h2>
                <div className="score-circle">
                  <span className="score-number">0</span>
                </div>
              </div>
            </div>
              <div className="treasures-header">
                <h3 className="treasures-title">Treasures Discovered ({treasures.length})</h3>
                <h3 className="treasures-title">Score</h3>
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
                    <span className="treasure-name">No treasures discovered yet</span>
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
                End Game
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileScoreboard;