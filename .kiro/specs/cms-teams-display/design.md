# Design Document

## Overview

The CMS teams display feature enhances the MobileScoreboard component by adding conditional team viewing functionality. When the game type is 'CMS', users can toggle between viewing their own team's data and viewing all teams' data through a tab-based interface.

## Architecture

### Component Structure
```
MobileScoreboard
├── Existing components (unchanged)
├── TeamViewToggle (new, conditional)
│   ├── "Mein Team" tab
│   └── "Alle Teams" tab
└── TeamsList (new, conditional)
    └── TeamItem (multiple instances)
        ├── Team icon
        ├── Team name
        └── Team score
```

### Conditional Rendering Logic
The feature uses conditional rendering based on the `game_type` property from `GameByCodeResponse`:
- If `game_type === 'CMS'`: Show toggle and conditional content
- Otherwise: Show existing single-team view

### State Management
- `activeTab`: Tracks which tab is selected ('myTeam' | 'allTeams')
- `teamsData`: Array of team information from scoreboard API
- `currentTeam`: Existing team data for the current user's team

## Components and Interfaces

### TeamViewToggle Component
```typescript
interface TeamViewToggleProps {
  activeTab: 'myTeam' | 'allTeams';
  onTabChange: (tab: 'myTeam' | 'allTeams') => void;
  translations: {
    myTeam: string;
    allTeams: string;
  };
}
```

**Responsibilities:**
- Render two clickable tabs
- Handle tab selection events
- Apply active/inactive styling
- Support internationalization

### TeamsList Component
```typescript
interface TeamsListProps {
  teams: TeamData[];
  translations: {
    allTeams: string;
    points: string;
    noTeams: string;
  };
}

interface TeamData {
  id: number;
  name: string;
  score: number;
  color?: string;
}
```

**Responsibilities:**
- Display list of all teams
- Sort teams by score (descending)
- Render team icons with colors
- Handle empty state

### Enhanced MobileScoreboard Props
```typescript
interface MobileScoreboardProps {
  // Existing props...
  gameType?: string; // New prop from GameByCodeResponse
  allTeams?: TeamData[]; // New prop for all teams data
}
```

## Data Models

### Team Data Structure
```typescript
interface TeamData {
  id: number;
  name: string;
  score: number;
  color?: string;
  players?: Player[];
  has_finished?: boolean;
}
```

### Game Type Detection
The component will receive the `game_type` from the parent component, which extracts it from `GameByCodeResponse.game_type`.

## Error Handling

### Missing Game Type
- If `game_type` is undefined/null: Default to non-CMS behavior
- If `game_type` is invalid: Log warning and default to non-CMS behavior

### Missing Teams Data
- If `allTeams` is empty: Show "No teams found" message
- If `allTeams` is undefined: Hide teams list, show error state
- If API fails: Graceful degradation to single-team view

### Tab State Management
- Default to "My Team" tab on component mount
- Persist tab selection during component re-renders
- Reset to "My Team" when switching between games

## Testing Strategy

### Unit Tests
- TeamViewToggle component rendering and interaction
- TeamsList component with various team data scenarios
- Conditional rendering logic based on game_type
- Tab state management and switching

### Integration Tests
- MobileScoreboard with CMS game type
- MobileScoreboard with non-CMS game type
- Data flow from parent component to child components
- Translation integration with existing i18n system

### Edge Cases
- Empty teams array
- Single team in teams array
- Teams with identical scores
- Very long team names
- Missing team colors

## Implementation Notes

### CSS Classes
New CSS classes will be added to `MobileScoreboard.css`:
- `.team-view-toggle`: Container for tab buttons
- `.team-tab`: Individual tab styling
- `.team-tab-active`: Active tab styling
- `.teams-list`: Container for all teams
- `.team-item`: Individual team row
- `.team-icon`: Team icon styling

### Internationalization
New translation keys will be added to locale files:
- `scoreboard.myTeam`: "Mein Team" / "My Team"
- `scoreboard.allTeams`: "Alle Teams" / "All Teams"
- `scoreboard.noTeams`: "Keine Teams gefunden" / "No teams found"

### Performance Considerations
- Teams list will only render when "All Teams" tab is active
- Team data will be memoized to prevent unnecessary re-renders
- Icon colors will be cached to avoid recalculation

### Accessibility
- Tab navigation will support keyboard navigation
- ARIA labels will be added for screen readers
- Focus management between tabs
- Semantic HTML structure for team list