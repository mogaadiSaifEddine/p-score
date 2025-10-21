# Implementation Plan

- [x] 1. Refine visual styling to match screenshot specifications
  - Update color values to match exact design (blue tones, gray shades, coral button)
  - Adjust spacing, padding, and margins for pixel-perfect alignment
  - Fix typography sizing and weights to match screenshots
  - _Requirements: 1.3, 1.4, 2.2, 2.3, 2.4, 9.3, 9.4, 9.5_

- [x] 2. Enhance team icon component with precise geometric shapes
  - [x] 2.1 Update TeamIcon component with exact shape positioning and colors
    - Implement precise corner positioning for geometric shapes
    - Use exact colors: teal circle (#14B8A6), dark triangle (#1F2937), pink square (#F472B6)
    - Adjust shape sizes for both large and small variants
    - _Requirements: 3.2, 3.3, 3.5_

  - [x] 2.2 Fix team icon sizing and layout in different contexts
    - Ensure 64x64px for main display, 48x48px for team list
    - Proper centering and spacing around team icons
    - _Requirements: 3.1, 3.4, 8.4_

- [x] 3. Implement exact score display styling
  - [x] 3.1 Refine circular score container design
    - Update border color to light blue (#BFDBFE)
    - Ensure 80x80px size with 4px border width
    - Center score number with proper font sizing (32px, bold)
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.2 Style "Total Score" label positioning and color
    - Position label above score circle
    - Use blue color (#2563EB) and proper font weight
    - _Requirements: 2.3_

- [x] 4. Enhance treasure and team list card styling
  - [x] 4.1 Update treasure item cards to match screenshot design
    - Refine white background, border radius, and shadow
    - Adjust internal padding and spacing
    - Ensure proper image/icon container styling (48x48px, gray background)
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 4.2 Implement team row cards with consistent styling
    - Apply same card design as treasure items

    - Ensure proper team icon sizing (48x48px) in list context
    - Align team name and score with proper typography
    - _Requirements: 8.2, 8.3, 8.4_

- [x] 5. Refine section headers and layout structure
  - Update section headers ("Treasures Discovered", "Score", "Teams in the Game")

  - Ensure proper spacing between sections and consistent typography
  - Implement exact layout matching screenshot spacing
  - _Requirements: 4.5, 8.5_

- [ ] 6. Enhance game finished state components
  - [ ] 6.1 Implement reward section with circular red containers
    - Create reward icons in 48x48px red circular containers (#DC2626)
    - Position rewards in horizontal layout with proper spacing
    - _Requirements: 6.1, 6.3_

  - [ ] 6.2 Implement media section with thumbnail grid
    - Create 48x48px rounded square containers for media thumbnails
    - Handle image loading and placeholder states
    - _Requirements: 6.2, 6.4_

  - [ ] 6.3 Implement tab navigation with exact styling
    - Create "My Team" and "All teams" buttons with proper styling
    - Active state: blue background (#3B82F6), white text
    - Inactive state: white background, gray text, gray border
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 7. Refine End Game button styling and behavior
  - Update button to coral/red background color matching screenshot
  - Ensure full width with proper border radius (16px)
  - Implement loading state with spinner and "Ending Game..." text
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Fix navigation header to match exact design
  - [ ] 8.1 Update header styling and layout
    - Ensure white background with bottom border
    - Proper height (64px) and padding (16px horizontal)
    - _Requirements: 9.5_

  - [ ] 8.2 Style back arrow and title positioning
    - Blue back arrow (#3B82F6) on left side
    - Centered "Scoreboard" title with proper typography
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 9. Implement proper state management and transitions
  - [ ] 9.1 Enhance game state transitions
    - Smooth transitions between in_progress and finished states
    - Proper content showing/hiding based on game state
    - _Requirements: 6.5, 7.4_

  - [ ] 9.2 Implement tab state management
    - Handle tab switching with proper state updates
    - Maintain tab selection during session
    - _Requirements: 7.4, 7.5_

- [ ]\* 10. Add comprehensive testing
  - [ ]\* 10.1 Write unit tests for component rendering
    - Test different game states and prop combinations
    - Verify proper styling application
    - _Requirements: All requirements_

  - [ ]\* 10.2 Add visual regression tests
    - Screenshot comparisons against design mockups
    - Cross-browser compatibility testing
    - _Requirements: All requirements_

- [ ] 11. Integrate dynamic API data using existing hooks
  - [ ] 11.1 Replace static data with useGameObserver hook
    - Integrate useGameObserver hook for real-time game data
    - Handle loading states and error conditions
    - Support both team-specific and general scoreboard views
    - _Requirements: All requirements_

  - [ ] 11.2 Implement useTreasureData hook for treasure display
    - Use useTreasureData hook to format treasure/checkpoint data
    - Display proper treasure icons and scores from API
    - Handle empty states when no treasures are found
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.3 Add useRouteParams for dynamic route handling
    - Extract gameCode and teamId from URL parameters
    - Validate route parameters and handle invalid states
    - Support different user types (player, observer, admin)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 11.4 Implement End Game API functionality
    - Add API call to end game when button is clicked
    - Handle loading states during game termination
    - Update game state after successful end game operation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 12. Update demo page with refined component
  - Update ScoreboardDemo page to showcase all refined features
  - Ensure proper data structure matches new component requirements
  - Test state transitions and interactive elements
  - _Requirements: All requirements_
