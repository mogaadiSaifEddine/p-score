import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export interface TeamViewToggleProps {
  activeTab: 'myTeam' | 'allTeams';
  onTabChange: (tab: 'myTeam' | 'allTeams') => void;
}

const TeamViewToggle: React.FC<TeamViewToggleProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation();

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, tab: 'myTeam' | 'allTeams') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTabChange(tab);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const newTab = tab === 'myTeam' ? 'allTeams' : 'myTeam';
      onTabChange(newTab);
    }
  };

  return (
    <div className="team-view-toggle" role="tablist" aria-label={t('scoreboard.teamViewToggle')}>
      <button
        role="tab"
        aria-selected={activeTab === 'myTeam'}
        aria-controls="myteam-panel"
        id="myteam-tab"
        className={`team-tab ${activeTab === 'myTeam' ? '' : 'team-tab-active'}`}
        onClick={() => onTabChange('myTeam')}
        onKeyDown={(e) => handleKeyDown(e, 'myTeam')}
        tabIndex={activeTab === 'myTeam' ? 0 : -1}
      >
        {t('scoreboard.myTeam')}
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'allTeams'}
        aria-controls="allteams-panel"
        id="allteams-tab"
        className={`team-tab ${activeTab === 'allTeams' ? '' : 'team-tab-active'}`}
        onClick={() => onTabChange('allTeams')}
        onKeyDown={(e) => handleKeyDown(e, 'allTeams')}
        tabIndex={activeTab === 'allTeams' ? 0 : -1}
      >
        {t('scoreboard.allTeams')}
      </button>
    </div>
  );
};

export default TeamViewToggle;