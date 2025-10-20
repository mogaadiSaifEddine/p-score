# Design Document

## Overview

The mobile scoreboard refinement focuses on achieving pixel-perfect alignment with the provided mobile app screenshots. The design emphasizes clean visual hierarchy, consistent spacing, and smooth state transitions between game progress and completion views.

## Architecture

### Component Structure
```
MobileScoreboard
├── NavigationHeader
├── GameStatusIndicator  
├── ScoreAndTeamSection
├── ContentSection
│   ├── TreasuresSection (game in progress)
│   ├── RewardsSection (game finished)
│   ├── MediaSection (game finished)
│   └── TeamsSection (game finished)
├── TabNavigation (game finished only)
└── ActionButton (game in progress only)
```

### State Management
- Game state: `'in_progress' | 'finished' | 'not_started'`
- Active tab: `'my_team' | 'all_teams'` (for finished games)
- Loading states for async operations
- Team and treasure data management

## Components and Interfaces

### NavigationHeader Component
```typescript
interface NavigationHeaderProps {
  onBackClick?: () => void;
  title: string;
}
```

**Visual Specifications:**
- Height: 64px
- Background: White (#FFFFFF)
- Border bottom: 1px solid #E5E7EB
- Back arrow: Blue (#3B82F6), 24x24px
- Title: 20px font, semibold, centered
- Padding: 16px horizontal

### GameStatusIndicator Component
```typescript
interface GameStatusIndicatorProps {
  status: 'in_progress' | 'finished' | 'not_started';
}
```

**Visual Specifications:**
- Text color: #9CA3AF (gray-400)
- Font size: 14px
- Text alignment: Center
- Padding: 16px vertical
- Status messages: "Game in progress", "Game over", "Game not started"

### ScoreAndTeamSection Component
```typescript
interface ScoreAndTeamSectionProps {
  team: {
    name: string;
    score: number;
    color: string;
    shapes: ('circle' | 'triangle' | 'square')[];
  };
}
```

**Visual Specifications:**
- Layout: Flexbox, space-between alignment
- Total Score Circle:
  - Size: 80x80px
  - Border: 4px solid #BFDBFE (blue-200)
  - Background: White
  - Score text: 32px, bold, blue (#2563EB)
  - Label: "Total Score", 14px, medium, blue (#2563EB)
- Team Icon:
  - Size: 64x64px
  - Border radius: 50%
  - Geometric shapes: 12x12px positioned in corners
  - Team name: 18px, medium, below icon

### TeamIcon Component
```typescript
interface TeamIconProps {
  color: string;
  shapes: ('circle' | 'triangle' | 'square')[];
  size: 'small' | 'large';
}
```

**Shape Specifications:**
- Circle: #14B8A6 (teal-500), 12x12px (large) / 8x8px (small)
- Triangle: #1F2937 (gray-800), CSS borders for triangle shape
- Square: #F472B6 (pink-400), 12x12px (large) / 8x8px (small)
- Positions: top-left, top-right, bottom-left, bottom-right corners

### TreasureItem Component
```typescript
interface TreasureItemProps {
  image?: string;
  icon: string;
  score: number;
}
```

**Visual Specifications:**
- Container: White background, 16px border radius, subtle shadow
- Padding: 16px
- Image/Icon container: 48x48px, gray background (#F3F4F6)
- Score text: 24px, bold, right-aligned
- Margin bottom: 12px between items

### RewardIcon Component
```typescript
interface RewardIconProps {
  icon: string;
}
```

**Visual Specifications:**
- Size: 48x48px
- Background: #DC2626 (red-600)
- Border radius: 50%
- Icon color: White
- Font size: 20px

### MediaThumbnail Component
```typescript
interface MediaThumbnailProps {
  image: string;
  type: 'image' | 'video';
}
```

**Visual Specifications:**
- Size: 48x48px
- Border radius: 8px
- Background: #D1D5DB (gray-300) for placeholders
- Object fit: Cover

### TabNavigation Component
```typescript
interface TabNavigationProps {
  activeTab: 'my_team' | 'all_teams';
  onTabChange: (tab: 'my_team' | 'all_teams') => void;
}
```

**Visual Specifications:**
- Button height: 48px
- Border radius: 16px
- Active state: Blue background (#3B82F6), white text
- Inactive state: White background, gray text (#6B7280), gray border
- Font: 16px, medium weight
- Spacing: 12px between buttons

### TeamRow Component
```typescript
interface TeamRowProps {
  team: {
    name: string;
    score: number;
    color: string;
    shapes: ('circle' | 'triangle' | 'square')[];
  };
}
```

**Visual Specifications:**
- Same card styling as TreasureItem
- Small team icon: 48x48px
- Team name: 18px, medium
- Score: 24px, bold, right-aligned

## Data Models

### Team Model
```typescript
interface Team {
  id: string;
  name: string;
  score: number;
  color: string; // Hex color code
  shapes: ('circle' | 'triangle' | 'square')[];
}
```

### Treasure Model
```typescript
interface Treasure {
  id: number;
  image?: string;
  icon: string;
  score: number;
  discoveredAt?: Date;
}
```

### Reward Model
```typescript
interface Reward {
  id: number;
  icon: string;
  name?: string;
  description?: string;
}
```

### Media Model
```typescript
interface Media {
  id: number;
  image: string;
  type: 'image' | 'video';
  capturedAt?: Date;
}
```

### Game State Model
```typescript
interface GameState {
  status: 'in_progress' | 'finished' | 'not_started';
  currentTeam: Team;
  allTeams: Team[];
  treasures: Treasure[];
  rewards: Reward[];
  media: Media[];
  startedAt?: Date;
  finishedAt?: Date;
}
```

## Error Handling

### Loading States
- Show spinner in End Game button during game termination
- Disable interactions during state transitions
- Graceful fallbacks for missing images

### Data Validation
- Validate team data structure before rendering
- Handle missing or invalid treasure/reward data
- Provide default values for optional properties

### Network Errors
- Retry mechanism for failed game end requests
- Offline state handling
- Error messages for failed operations

## Testing Strategy

### Unit Tests
- Component rendering with different props
- State transitions between game phases
- Event handler functionality
- Data model validation

### Integration Tests
- Complete user flows (game progress → end game → results)
- Tab switching functionality
- Image loading and fallbacks

### Visual Regression Tests
- Screenshot comparisons against design mockups
- Responsive behavior testing
- Cross-browser compatibility

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Touch target sizing (minimum 44px)

## Performance Considerations

### Optimization Strategies
- Lazy loading for media thumbnails
- Memoization of expensive calculations
- Efficient re-rendering with React.memo
- Image optimization and caching

### Memory Management
- Cleanup of event listeners
- Proper component unmounting
- Efficient data structures for large team lists

## Responsive Design

### Breakpoints
- Mobile: 320px - 768px (primary target)
- Tablet: 768px - 1024px (secondary support)
- Desktop: 1024px+ (minimal adaptation)

### Layout Adaptations
- Maintain mobile-first approach
- Adjust spacing and sizing for larger screens
- Preserve visual hierarchy across devices

## Animation and Transitions

### State Transitions
- Smooth fade between game progress and finished states
- Tab switching with subtle slide animation
- Button press feedback with scale transform

### Loading Animations
- Spinner for async operations
- Skeleton loading for data-dependent content
- Progressive image loading

## Accessibility

### WCAG Compliance
- Level AA color contrast ratios
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support

### Screen Reader Support
- Descriptive alt text for images
- Meaningful heading hierarchy
- Status announcements for state changes
- Focus management for dynamic content