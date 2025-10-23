# Design Document

## Overview

This design document outlines the implementation approach for improving the mobile scoreboard UI to enhance visual consistency, alignment, and typography, plus adding challenge pictures functionality. The improvements focus on eight key areas: title capitalization, icon alignment, table styling, section headers, game status display, player name box styling, and challenge pictures integration.

## Architecture

The improvements will be implemented through targeted modifications to the existing `MobileScoreboard.tsx` component and its associated `MobileScoreboard.css` stylesheet. The changes maintain the current component structure while enhancing visual presentation and user experience.

### Component Structure
- **MobileScoreboard.tsx**: Main React component containing the scoreboard logic and JSX structure
- **MobileScoreboard.css**: Stylesheet containing all visual styling rules
- **Translation files**: JSON files containing localized text strings

## Components and Interfaces

### 1. Title Capitalization System

**Current State**: Section titles use uppercase formatting via CSS `text-transform: uppercase`
**Target State**: Remove uppercase transformation to allow proper capitalization

**Implementation Approach**:
- Remove `text-transform: uppercase` from CSS classes affecting section titles
- Update translation strings to use proper title case formatting
- Ensure consistent capitalization across all section headers

**Affected CSS Classes**:
- `.treasures-title`
- `.rewards-title` 
- `.team-tab` (for team view toggle buttons)

### 2. Icon Alignment and Sizing System

**Current State**: Icons have inconsistent sizing and alignment
**Target State**: Uniform left alignment and consistent sizing matching the points earned image

**Implementation Approach**:
- Standardize icon container dimensions across reward and media icons
- Implement consistent left-alignment using flexbox properties
- Ensure all icons match the size of the points earned display elements

**Affected Elements**:
- Reward images (`.reward-image`)
- Treasure icons (`.treasure-icon`)
- Team badge icons (`.treasure-icon.team-badge`)

### 3. Table Title Enhancement System

**Current State**: Generic "Points earned" labels with bold formatting
**Target State**: Descriptive names (treasure/team names) with regular font weight

**Implementation Approach**:
- Modify the table header structure to display dynamic content
- Remove bold font-weight from table title elements
- Update the header rendering logic to show contextual names

**Component Changes**:
- Update `.treasures-header` rendering logic
- Modify `.treasures-title` styling to remove bold formatting
- Implement dynamic header text based on active view (treasures vs teams)

### 4. Table Row Optimization System

**Current State**: Standard row height with basic vertical separators
**Target State**: Reduced row height with taller, more prominent vertical bars

**Implementation Approach**:
- Reduce padding and height of `.treasure-item` elements
- Increase height and visual prominence of `.treasure-score` border-left property
- Maintain readability while creating more compact layout

**CSS Modifications**:
- Adjust `.treasure-item` padding values
- Enhance `.treasure-score` border styling
- Optimize spacing for better visual hierarchy

### 5. Section Header Cleanup System

**Current State**: Section titles include count indicators and vertical bar decorations
**Target State**: Clean titles without counts or decorative elements

**Implementation Approach**:
- Remove count display logic from section headers
- Remove CSS pseudo-elements (::before) that create vertical bars
- Simplify header structure for cleaner appearance

**Affected Areas**:
- Rewards section header
- Treasures section header
- Team view section headers

### 6. Game Status Enhancement System

**Current State**: Standard text alignment and formatting for game status
**Target State**: Centered "Game Finished" text with bold "Total Score" label

**Implementation Approach**:
- Add center alignment for game finished status
- Apply bold font-weight to total score label
- Enhance visual hierarchy for important status information

**CSS Updates**:
- Modify `.game-over-title` for center alignment when game is finished
- Update `.score-label` for total score to use bold font-weight
- Ensure proper responsive behavior across screen sizes

### 7. Player Name Box Styling System

**Current State**: Player name box with horizontal lines and standard icon positioning
**Target State**: Removed horizontal lines, elevated icon position, blue text color matching score

**Implementation Approach**:
- Remove horizontal line elements from player name display
- Adjust icon positioning within the badge container
- Apply blue color styling to match score text color
- Ensure visual consistency with score display elements

**Component Updates**:
- Modify `.score-box` styling to remove border elements
- Adjust `.badge` positioning for elevated appearance
- Update `.score-box-number` color to match score styling

### 8. Challenge Pictures Integration System

**Current State**: No challenge pictures display functionality
**Target State**: Challenge pictures section matching rewards styling and layout

**Implementation Approach**:
- Create API integration to fetch challenge pictures from `/observer/get_challenge_pictures` endpoint
- Implement new challenge pictures section with styling identical to rewards section
- Add proper error handling and loading states for API calls
- Ensure responsive behavior matches existing sections

**API Integration**:
- Add challenge pictures state management to MobileScoreboard component
- Implement API call using game instance ID and team ID parameters
- Handle loading, success, and error states appropriately

**Component Updates**:
- Create challenge pictures section JSX structure matching rewards section
- Reuse existing `.rewards-section`, `.rewards-header`, `.rewards-list` CSS classes
- Implement challenge picture image component with fallback handling
- Add appropriate section title and empty state handling

## Data Models

### Theme Integration
The improvements will respect the existing theme system:
- Use CSS custom properties (variables) for colors
- Maintain compatibility with light/dark theme switching
- Preserve responsive design patterns

### Translation Support
Text changes will be implemented through the translation system:
- Update `common.json` files for proper capitalization
- Maintain multi-language support
- Ensure consistent formatting across locales

## Error Handling

### CSS Fallbacks
- Provide fallback values for CSS custom properties
- Ensure graceful degradation on older browsers
- Maintain accessibility standards

### Responsive Behavior
- Preserve existing responsive breakpoints
- Ensure improvements work across all screen sizes
- Maintain touch-friendly interface on mobile devices

## Testing Strategy

### Visual Regression Testing
- Compare before/after screenshots of key UI elements
- Test across different screen sizes and orientations
- Verify theme switching maintains visual consistency

### Cross-Browser Compatibility
- Test improvements in major browsers (Chrome, Firefox, Safari, Edge)
- Verify CSS custom property support
- Ensure responsive behavior works consistently

### Accessibility Testing
- Verify color contrast ratios meet WCAG guidelines
- Test keyboard navigation functionality
- Ensure screen reader compatibility

### User Experience Testing
- Validate improved visual hierarchy
- Confirm enhanced readability
- Test touch interaction on mobile devices

## Implementation Phases

### Phase 1: CSS Styling Updates
1. Remove uppercase text transformations
2. Standardize icon sizing and alignment
3. Update table row dimensions and borders
4. Clean up section headers

### Phase 2: Component Logic Updates
1. Modify header rendering for dynamic titles
2. Update game status display logic
3. Enhance player name box styling
4. Remove count indicators from sections

### Phase 3: Translation Updates
1. Update text strings for proper capitalization
2. Ensure consistency across all supported languages
3. Test localization with new formatting

### Phase 4: Testing and Refinement
1. Conduct visual regression testing
2. Perform cross-browser compatibility testing
3. Validate accessibility compliance
4. Fine-tune responsive behavior

## Design Decisions and Rationales

### Typography Hierarchy
- **Decision**: Remove all-caps formatting for better readability
- **Rationale**: Sentence case is more professional and easier to read, especially for non-English languages

### Visual Consistency
- **Decision**: Standardize icon sizes to match points display
- **Rationale**: Creates visual harmony and professional appearance throughout the interface

### Information Architecture
- **Decision**: Show descriptive names instead of generic labels
- **Rationale**: Provides more meaningful context to users about what they're viewing

### Visual Density
- **Decision**: Reduce row height while enhancing separators
- **Rationale**: Allows more content to be visible while maintaining clear visual separation

### Interface Simplification
- **Decision**: Remove decorative elements and counts from headers
- **Rationale**: Creates cleaner, more focused interface that emphasizes content over decoration

### Status Prominence
- **Decision**: Center and bold important status information
- **Rationale**: Ensures critical game state information is immediately visible and prominent

### Color Consistency
- **Decision**: Match player name color to score color (blue)
- **Rationale**: Creates visual connection between related elements and improves overall cohesion