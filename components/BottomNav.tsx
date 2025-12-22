import React from 'react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { icon: 'home', label: 'Início', screen: ScreenName.DASHBOARD },
    { icon: 'history', label: 'Viagens', screen: ScreenName.HISTORY },
    { icon: 'leaderboard', label: 'Rankings', screen: ScreenName.RANKINGS },
    { icon: 'person', label: 'Perfil', screen: ScreenName.PROFILE },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-dark/95 backdrop-blur-md border-t border-border-dark pt-3 pb-3 safe-area-bottom px-6 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = currentScreen === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-current' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};