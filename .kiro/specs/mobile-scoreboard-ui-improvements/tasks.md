# Implementation Plan

- [x] 1. Update CSS styling for title capitalization and typography on desktop screens
  - Remove `text-transform: uppercase` from `.treasures-title`, `.rewards-title`, and `.team-tab` classes specifically in desktop media queries (@media min-width: 768px and above)
  - Update font-weight properties to remove bold formatting from table titles on desktop
  - Preserve existing mobile/tablet styling which is working correctly
  - _Requirements: 1.1, 1.2, 1.3, 3.3, 3.4_

- [x] 2. Standardize icon alignment and sizing on desktop screens
  - [x] 2.1 Update reward icon styling for consistent sizing on desktop
    - Modify `.reward-image` CSS within desktop media queries to match dimensions of points earned elements
    - Implement left alignment using flexbox properties for desktop breakpoints only
    - Preserve existing mobile/tablet icon styling which is working correctly
    - _Requirements: 2.1, 2.3, 2.5_

  - [x] 2.2 Update treasure and media icon styling for desktop
    - Modify `.treasure-icon` and `.treasure-icon.team-badge` CSS within desktop media queries for uniform sizing
    - Implement left alignment to match reward icons on desktop screens only
    - Keep mobile/tablet icon positioning unchanged
    - _Requirements: 2.2, 2.4, 2.5_

- [x] 3. Enhance table structure and styling for desktop screens
  - [x] 3.1 Update table header rendering logic for desktop display
    - Modify JSX in MobileScoreboard.tsx to display dynamic treasure/team names instead of "Points earned" on desktop
    - Update header text logic based on active view (treasures vs teams) for desktop breakpoints
    - Remove bold formatting from table title elements in desktop media queries only
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Optimize table row dimensions and visual separators on desktop
    - Reduce `.treasure-item` padding and height for more compact layout in desktop media queries
    - Increase height and prominence of `.treasure-score` border-left property for desktop screens
    - Preserve mobile/tablet row styling which is working correctly
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [-] 4. Clean up section headers and remove decorative elements on desktop
  - Remove count indicators from section title rendering logic in MobileScoreboard.tsx for desktop display
  - Remove CSS pseudo-elements (::before) that create vertical bars in section headers within desktop media queries
  - Simplify header structure for cleaner appearance on desktop screens only
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 5. Enhance game status and score display for desktop screens
  - [ ] 5.1 Update game status positioning and formatting on desktop
    - Add center alignment for "Game Finished" text in `.game-over-title` CSS within desktop media queries
    - Apply bold font-weight to "Total Score" label in `.score-label` for desktop breakpoints
    - Preserve existing mobile/tablet game status styling
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 5.2 Improve player name box styling on desktop
    - Remove horizontal line elements from `.score-box` CSS styling in desktop media queries
    - Adjust `.badge` positioning for elevated appearance on desktop screens only
    - Update `.score-box-number` color to blue matching score styling for desktop
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 6. Implement challenge pictures functionality
  - [ ] 6.1 Add API integration for challenge pictures
    - Create API call to `/observer/get_challenge_pictures?game_instance_id={gameInstanceId}&team_id={teamId}` endpoint
    - Add challenge pictures state management to MobileScoreboard component
    - Implement proper error handling and loading states for API calls
    - _Requirements: 8.1, 8.5_

  - [ ] 6.2 Create challenge pictures UI section
    - Add challenge pictures section JSX structure matching rewards section layout
    - Implement challenge picture image component with fallback handling
    - Reuse existing rewards section CSS classes for consistent styling
    - Add appropriate section title and empty state handling
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Update translation files for proper capitalization on desktop
  - Update `public/locales/en/common.json` to use proper title case for section headers displayed on desktop
  - Ensure "Rewards" and "Treasures Discovered" use sentence case formatting for desktop display
  - Add translation key for challenge pictures section title
  - Consider conditional text rendering based on screen size if needed
  - _Requirements: 1.1, 1.2, 1.3, 8.4_

- [ ]\* 8. Validate desktop responsive behavior and cross-browser compatibility
  - Test improvements specifically on desktop screen sizes (768px and above)
  - Verify CSS custom property support in major desktop browsers
  - Ensure mobile/tablet functionality remains unchanged
  - Test challenge pictures API integration and display functionality
  - _Requirements: All requirements_

- [ ]\* 9. Conduct visual regression testing for desktop screens
  - Compare before/after screenshots of desktop UI elements specifically
  - Test theme switching maintains visual consistency on desktop
  - Verify that mobile/tablet views remain unaffected by changes
  - Test challenge pictures section displays correctly across different screen sizes
  - _Requirements: All requirements_
