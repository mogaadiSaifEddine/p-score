# Requirements Document

## Introduction

This feature adds a teams display functionality to the mobile scoreboard that allows users to toggle between viewing their own team's data and viewing all teams' data when the game type is 'CMS'. The feature includes tab navigation and displays team information with icons and scores.

## Glossary

- **MobileScoreboard**: The main scoreboard component that displays game information
- **GameByCodeResponse**: API response object containing game information including game_type
- **CMS**: A specific game type that supports team viewing functionality
- **Team_View_Toggle**: UI component allowing users to switch between "My Team" and "All Teams" views
- **Team_List**: Display component showing multiple teams with their scores and icons

## Requirements

### Requirement 1

**User Story:** As a player in a CMS game, I want to see a toggle between "My Team" and "All Teams" views, so that I can choose what team information to display.

#### Acceptance Criteria

1. WHEN the GameByCodeResponse.game_type equals 'CMS', THE MobileScoreboard SHALL display a Team_View_Toggle component
2. THE Team_View_Toggle SHALL contain two selectable tabs labeled "My Team" and "All Teams"
3. WHEN a user selects the "My Team" tab, THE MobileScoreboard SHALL display only the current team's information
4. WHEN a user selects the "All Teams" tab, THE MobileScoreboard SHALL display the Team_List component
5. THE Team_View_Toggle SHALL highlight the currently selected tab with visual styling

### Requirement 2

**User Story:** As a player viewing all teams, I want to see each team's name, icon, and score, so that I can compare team performance.

#### Acceptance Criteria

1. WHEN the "All Teams" tab is selected, THE Team_List SHALL display all teams from the scoreboard data
2. THE Team_List SHALL show each team's name, colored icon, and current score
3. THE Team_List SHALL use consistent visual styling with the existing scoreboard design
4. WHEN no teams are available, THE Team_List SHALL display a message indicating no teams found
5. THE Team_List SHALL sort teams by score in descending order

### Requirement 3

**User Story:** As a player in a non-CMS game, I want the scoreboard to work as before, so that existing functionality is not affected.

#### Acceptance Criteria

1. WHEN the GameByCodeResponse.game_type is not 'CMS', THE MobileScoreboard SHALL not display the Team_View_Toggle
2. WHEN the GameByCodeResponse.game_type is not 'CMS', THE MobileScoreboard SHALL display only the current team's information
3. THE MobileScoreboard SHALL maintain all existing functionality for non-CMS games
4. WHEN the game_type is undefined or null, THE MobileScoreboard SHALL behave as a non-CMS game
5. THE MobileScoreboard SHALL not break existing API calls or data processing for non-CMS games