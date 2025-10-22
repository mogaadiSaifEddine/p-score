# Implementation Plan

- [x] 1. Update MobileScoreboard component interface and props
  - Add gameType and allTeams props to MobileScoreboardProps interface
  - Update component to accept and handle new props
  - Add conditional rendering logic based on gameType === 'CMS'
  - _Requirements: 1.1, 3.1, 3.4_

- [x] 2. Create TeamViewToggle component
  - [x] 2.1 Implement TeamViewToggle component with tab functionality
    - Create new component file with TypeScript interface
    - Implement tab rendering and click handlers
    - Add proper ARIA labels and keyboard navigation support
    - _Requirements: 1.2, 1.5_

  - [x] 2.2 Add CSS styling for team view toggle
    - Create CSS classes for tab container and individual tabs
    - Implement active/inactive tab styling
    - Ensure responsive design and mobile-friendly touch targets
    - _Requirements: 1.2, 1.5_

- [-] 3. Create TeamsList component
  - [x] 3.1 Implement TeamsList component structure
    - Create component with TypeScript interface for team data
    - Implement team sorting by score (descending order)
    - Add empty state handling for no teams scenario
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 3.2 Implement team item rendering with icons and scores
    - Create individual team item display with icon, name, and score
    - Implement team icon color system using existing team configurations
    - Ensure consistent styling with existing scoreboard design
    - _Requirements: 2.2, 2.3_

  - [x] 3.3 Add CSS styling for teams list
    - Create CSS classes for teams list container and team items
    - Implement team icon styling with color support
    - Ensure visual consistency with existing MobileScoreboard design
    - _Requirements: 2.2, 2.3_

- [x] 4. Integrate components into MobileScoreboard
  - [x] 4.1 Add state management for active tab
    - Implement useState hook for tracking active tab ('myTeam' | 'allTeams')
    - Add tab change handler function
    - Set default tab to 'myTeam' on component mount
    - _Requirements: 1.3, 1.4_

  - [x] 4.2 Implement conditional content rendering
    - Add conditional rendering for TeamViewToggle when gameType is 'CMS'
    - Implement content switching between current team view and all teams view
    - Ensure existing functionality remains unchanged for non-CMS games
    - _Requirements: 1.1, 1.3, 1.4, 3.1, 3.2_

- [x] 5. Update parent component to pass game type and teams data
  - [x] 5.1 Modify page component to extract game_type from GameByCodeResponse
    - Update the main page component to read game_type from game observer data
    - Pass gameType prop to MobileScoreboard component
    - Handle cases where game_type is undefined or null
    - _Requirements: 1.1, 3.4, 3.5_

  - [x] 5.2 Pass teams data from scoreboard API to MobileScoreboard
    - Extract teams array from scoreboard data
    - Format team data to match TeamData interface
    - Pass allTeams prop to MobileScoreboard component
    - _Requirements: 2.1, 2.5_

- [ ] 6. Add internationalization support
  - [ ] 6.1 Add new translation keys to locale files
    - Add 'myTeam', 'allTeams', and 'noTeams' keys to all locale JSON files
    - Provide translations in English, German, French, Spanish, and Icelandic
    - Ensure consistent terminology with existing translations
    - _Requirements: 1.2, 2.4_

  - [ ] 6.2 Update components to use translation hooks
    - Integrate useTranslation hook in TeamViewToggle component
    - Integrate useTranslation hook in TeamsList component
    - Pass translated strings to child components as needed
    - _Requirements: 1.2, 2.4_

- [ ]\* 7. Add comprehensive testing
  - [ ]\* 7.1 Write unit tests for TeamViewToggle component
    - Test tab rendering and click interactions
    - Test keyboard navigation and accessibility features
    - Test translation integration
    - _Requirements: 1.2, 1.5_

  - [ ]\* 7.2 Write unit tests for TeamsList component
    - Test team list rendering with various data scenarios
    - Test sorting functionality and empty state handling
    - Test team icon and color rendering
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [ ]\* 7.3 Write integration tests for MobileScoreboard
    - Test conditional rendering based on game type
    - Test data flow between parent and child components
    - Test tab switching and content updates
    - _Requirements: 1.1, 1.3, 1.4, 3.1, 3.2_
