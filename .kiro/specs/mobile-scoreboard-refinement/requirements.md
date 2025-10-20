# Requirements Document

## Introduction

This feature refines the existing mobile scoreboard component to match the exact visual design and functionality shown in the provided mobile app screenshots. The scoreboard displays game progress, team information, discovered treasures, and final game results with a clean, modern mobile interface.

## Glossary

- **Scoreboard_System**: The mobile scoreboard component that displays game state and team information
- **Team_Icon**: Circular colored icon with geometric shapes representing a team
- **Treasure_Item**: Individual discovered item with image/icon and score value
- **Game_State**: Current status of the game (in progress, finished, not started)
- **Score_Display**: Circular element showing numerical score values
- **Navigation_Header**: Top bar with back button and title
- **Action_Button**: Interactive button for game actions (End Game)

## Requirements

### Requirement 1

**User Story:** As a player, I want to see the current game status clearly displayed, so that I understand whether the game is active or completed

#### Acceptance Criteria

1. WHEN the game is in progress, THE Scoreboard_System SHALL display "Game in progress" text
2. WHEN the game is finished, THE Scoreboard_System SHALL display "Game over" text  
3. THE Scoreboard_System SHALL position the game status text centered below the navigation header
4. THE Scoreboard_System SHALL use light gray text color for the game status

### Requirement 2

**User Story:** As a player, I want to see my team's current score prominently displayed, so that I can quickly understand my performance

#### Acceptance Criteria

1. THE Scoreboard_System SHALL display the total score in a circular bordered element on the left side
2. THE Scoreboard_System SHALL show the score number in large, bold blue text
3. THE Scoreboard_System SHALL display "Total Score" label above the score circle in blue text
4. THE Scoreboard_System SHALL use a light blue border for the score circle
5. THE Scoreboard_System SHALL center the team icon and name on the right side of the score

### Requirement 3

**User Story:** As a player, I want to see my team represented by a distinctive colored icon with geometric shapes, so that I can easily identify my team

#### Acceptance Criteria

1. THE Scoreboard_System SHALL display a circular team icon with the team's assigned color
2. THE Scoreboard_System SHALL overlay small geometric shapes (circle, triangle, square) on the team icon
3. THE Scoreboard_System SHALL position geometric shapes in the corners of the team icon
4. THE Scoreboard_System SHALL display the team name below the team icon
5. THE Scoreboard_System SHALL use consistent colors for geometric shapes (teal circle, dark triangle, pink square)

### Requirement 4

**User Story:** As a player, I want to see discovered treasures with their associated scores during gameplay, so that I can track my progress

#### Acceptance Criteria

1. WHILE the game is in progress, THE Scoreboard_System SHALL display a "Treasures Discovered" section
2. THE Scoreboard_System SHALL show each treasure item in a white rounded card
3. THE Scoreboard_System SHALL display treasure image or icon on the left side of each card
4. THE Scoreboard_System SHALL show the treasure score in large bold text on the right side
5. THE Scoreboard_System SHALL include section headers "Treasures Discovered" and "Score"

### Requirement 5

**User Story:** As a player, I want to end the current game when ready, so that I can proceed to view final results

#### Acceptance Criteria

1. WHILE the game is in progress, THE Scoreboard_System SHALL display an "End Game" button
2. THE Scoreboard_System SHALL position the End Game button at the bottom of the screen
3. THE Scoreboard_System SHALL use coral/red background color for the End Game button
4. THE Scoreboard_System SHALL make the button full width with rounded corners
5. THE Scoreboard_System SHALL show loading state when ending game is in progress

### Requirement 6

**User Story:** As a player, I want to see final game results including rewards and media when the game ends, so that I can review my achievements

#### Acceptance Criteria

1. WHEN the game is finished, THE Scoreboard_System SHALL display a "Reward" section with earned rewards
2. WHEN the game is finished, THE Scoreboard_System SHALL display a "Media" section with captured images
3. THE Scoreboard_System SHALL show reward icons in circular red containers
4. THE Scoreboard_System SHALL display media thumbnails in rounded square containers
5. THE Scoreboard_System SHALL hide the treasures section when game is finished

### Requirement 7

**User Story:** As a player, I want to switch between viewing my team and all teams in the final results, so that I can compare performance

#### Acceptance Criteria

1. WHEN the game is finished, THE Scoreboard_System SHALL display "My Team" and "All teams" tab buttons
2. THE Scoreboard_System SHALL highlight the active tab with blue background and white text
3. THE Scoreboard_System SHALL show inactive tabs with white background and gray text
4. WHEN a tab is selected, THE Scoreboard_System SHALL update the displayed content accordingly
5. THE Scoreboard_System SHALL maintain tab state during the session

### Requirement 8

**User Story:** As a player, I want to see all teams' final scores and rankings, so that I can understand the complete game results

#### Acceptance Criteria

1. WHEN viewing all teams, THE Scoreboard_System SHALL display a "Teams in the Game" section
2. THE Scoreboard_System SHALL show each team in a white rounded card with team icon and name
3. THE Scoreboard_System SHALL display each team's final score on the right side of their card
4. THE Scoreboard_System SHALL use smaller team icons in the team list
5. THE Scoreboard_System SHALL include section headers "Teams in the Game" and "Score"

### Requirement 9

**User Story:** As a player, I want intuitive navigation controls, so that I can easily return to previous screens

#### Acceptance Criteria

1. THE Scoreboard_System SHALL display a navigation header with back arrow and "Scoreboard" title
2. THE Scoreboard_System SHALL position the back arrow on the left side of the header
3. THE Scoreboard_System SHALL use blue color for the back arrow icon
4. THE Scoreboard_System SHALL center the "Scoreboard" title in the header
5. THE Scoreboard_System SHALL use white background for the header with bottom border