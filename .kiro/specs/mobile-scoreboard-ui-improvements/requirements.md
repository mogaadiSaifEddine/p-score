# Requirements Document

## Introduction

This specification defines UI improvements for the mobile scoreboard interface to enhance visual consistency, alignment, and typography, as well as adding challenge pictures functionality. The improvements focus on title formatting, icon alignment, table styling, section headers, player information display, and integration of challenge pictures to create a more polished and comprehensive user experience.

## Glossary

- **Mobile_Scoreboard**: The React component that displays game scores, treasures, rewards, and team information on mobile devices
- **Section_Title**: Headers that categorize different areas of the scoreboard (e.g., "Rewards", "Treasures Discovered")
- **Table_Row**: Individual items in the treasures/teams list displaying name and score
- **Player_Name_Box**: The UI element displaying the team/player name with associated styling
- **Rewards_Icon**: Visual elements representing earned rewards/coupons
- **Media_Icon**: Visual elements representing treasures or team badges
- **Points_Earned_Image**: The visual indicator showing score values
- **Vertical_Bar**: Visual separator elements used in section headers
- **Challenge_Pictures**: Images captured during gameplay that are fetched from the observer API
- **Challenge_Pictures_API**: The `/observer/get_challenge_pictures` endpoint that returns challenge images for a specific game and team
- **Media_Section**: A new UI section that displays challenge pictures similar to the rewards section

## Requirements

### Requirement 1

**User Story:** As a game player, I want section titles to use proper capitalization instead of all uppercase, so that the interface appears more professional and readable.

#### Acceptance Criteria

1. WHEN the Mobile_Scoreboard renders section titles, THE Mobile_Scoreboard SHALL display titles using sentence case or title case formatting
2. THE Mobile_Scoreboard SHALL NOT display any section titles in all uppercase letters
3. WHEN displaying "REWARDS" or "TREASURES DISCOVERED" headers, THE Mobile_Scoreboard SHALL use proper capitalization

### Requirement 2

**User Story:** As a game player, I want the Rewards and Media icons to be properly aligned and sized consistently, so that the visual layout appears organized and professional.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL align Rewards_Icon elements to the left side of their container
2. THE Mobile_Scoreboard SHALL align Media_Icon elements to the left side of their container
3. THE Mobile_Scoreboard SHALL size Rewards_Icon elements to match the dimensions of the Points_Earned_Image
4. THE Mobile_Scoreboard SHALL size Media_Icon elements to match the dimensions of the Points_Earned_Image
5. THE Mobile_Scoreboard SHALL align Rewards_Icon and Media_Icon elements with the same positioning as the Points_Earned_Image

### Requirement 3

**User Story:** As a game player, I want table titles to display descriptive names instead of generic labels, so that I can easily understand what information is being shown.

#### Acceptance Criteria

1. WHEN displaying treasure information, THE Mobile_Scoreboard SHALL show the treasure name instead of "Points earned"
2. WHEN displaying team information, THE Mobile_Scoreboard SHALL show the team name instead of "Points earned"
3. THE Mobile_Scoreboard SHALL NOT apply bold formatting to table title text
4. THE Mobile_Scoreboard SHALL display table titles in regular font weight

### Requirement 4

**User Story:** As a game player, I want table rows to be appropriately sized with proper visual separators, so that the information is easy to scan and read.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL reduce the height of Table_Row elements while maintaining readability
2. THE Mobile_Scoreboard SHALL increase the height of Vertical_Bar elements in table rows
3. THE Mobile_Scoreboard SHALL maintain proper spacing between table row elements
4. THE Mobile_Scoreboard SHALL ensure Vertical_Bar elements provide clear visual separation

### Requirement 5

**User Story:** As a game player, I want section titles to be clean and uncluttered, so that the interface appears modern and focused.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL remove count indicators from Section_Title elements
2. WHERE Section_Title elements contain Vertical_Bar separators, THE Mobile_Scoreboard SHALL remove the Vertical_Bar elements
3. THE Mobile_Scoreboard SHALL display Section_Title text without additional visual decorations

### Requirement 6

**User Story:** As a game player, I want the game status to be prominently displayed, so that I can quickly understand the current state of the game.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL center-align "Game Finished" text when the game status is finished
2. THE Mobile_Scoreboard SHALL apply bold formatting to "Total Score" text
3. THE Mobile_Scoreboard SHALL ensure game status text is prominently visible

### Requirement 7

**User Story:** As a game player, I want the player name display to be visually appealing and consistent with the score styling, so that the interface maintains visual harmony.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL remove horizontal line elements from the Player_Name_Box
2. THE Mobile_Scoreboard SHALL position the circular icon higher within the Player_Name_Box
3. THE Mobile_Scoreboard SHALL apply blue color styling to player name text matching the score color
4. THE Mobile_Scoreboard SHALL ensure Player_Name_Box styling is consistent with score display elements

### Requirement 8

**User Story:** As a game player, I want to view challenge pictures captured during gameplay, so that I can see visual memories and achievements from the game experience.

#### Acceptance Criteria

1. THE Mobile_Scoreboard SHALL fetch challenge pictures from the Challenge_Pictures_API endpoint using the current game instance ID and team ID
2. THE Mobile_Scoreboard SHALL display challenge pictures in a Media_Section that visually matches the rewards section styling
3. THE Mobile_Scoreboard SHALL render challenge pictures with the same alignment, sizing, and visual treatment as Rewards_Icon elements
4. WHEN challenge pictures are available, THE Mobile_Scoreboard SHALL display them in a dedicated section with appropriate section title
5. WHEN no challenge pictures are available, THE Mobile_Scoreboard SHALL handle the empty state gracefully without displaying the Media_Section
6. Use to handle typing of the API  interface ChallengePicture {
  file_path: string;
  upload_time: string;
  url: string;
}