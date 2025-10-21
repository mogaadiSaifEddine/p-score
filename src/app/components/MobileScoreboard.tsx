import React from 'react';
import './MobileScoreboard.css'
const MobileScoreboard = ({
  gameStatus,
  treasures,
  onEndGame,
  showEndGameButton
}: {
  gameStatus: any;
  treasures: any;
  onEndGame: any;
  showEndGameButton: any;
}) => {
  console.log(treasures);
  
   treasures = [
    { id: 1, icon: '🪙', name: 'Point 1', score: 1 }
  ];

  const totalScore = treasures.reduce((sum, treasure) => sum + treasure.score, 0) + 1; // Total is 2

  return (
    <>
      <div className="game-over-container">
        <div className="game-over-content">
          {/* Game Over Header */}
          <div className="game-over-header">
            <h1 className="game-over-title">Game over</h1>
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
                  <span className="score-box-number">{totalScore}</span>
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
                <h3 className="treasures-title">Treasures Discovered</h3>
                <h3 className="treasures-title">Score</h3>
              </div>

              {/* Treasure Items */}
              {treasures.map((treasure) => (
                <div key={treasure.id} className="treasure-item">
                  <div className="treasure-content">
                    <div className="treasure-icon">{treasure.icon}</div>
                    <span className="treasure-name">{treasure.name}</span>
                  </div>
                  <div className="treasure-score">{treasure.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileScoreboard;