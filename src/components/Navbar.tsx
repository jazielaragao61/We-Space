import React from 'react';
import { 
  Flame, 
  Video, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  PlusCircle, 
  Gamepad2,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  Palette
} from 'lucide-react';
import { 
  useAtmosphere, 
  PRESET_PALETTES, 
  getRgba, 
  isLightColor 
} from '../context/ThemeAtmosphereContext';
import { soundFx } from '../utils/soundEngine';

interface NavbarProps {
  activeTab: 'feed' | 'clipper' | 'duos' | 'profiles' | 'trust';
  setActiveTab: (tab: 'feed' | 'clipper' | 'duos' | 'profiles' | 'trust') => void;
  onOpenCreateModal: () => void;
  onSelectPlayer: (playerId: string) => void;
  currentUser: {
    id: string;
    username: string;
    avatar: string;
    reputationScore: number;
  };
}

interface NavItem {
  id: 'feed' | 'clipper' | 'duos' | 'profiles' | 'trust';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onSelectPlayer,
  currentUser
}) => {
  const { 
    customColor, 
    selectPreset, 
    activePresetId,
    isAudioMuted, 
    toggleAudioMute, 
    themeConfig,
    setIsPaletteModalOpen
  } = useAtmosphere();

  const navItems: NavItem[] = [
    { id: 'feed', label: 'Feed de Clipes', icon: Flame },
    { id: 'clipper', label: 'Clipper de Partida', icon: Video, badge: 'Auto-Log' },
    { id: 'duos', label: 'Recrutar & Duos', icon: Users },
    { id: 'profiles', label: 'Perfis & DNA', icon: UserCheck },
    { id: 'trust', label: 'Sistema de Reputação', icon: ShieldCheck },
  ];

  const handleNavClick = (tabId: NavItem['id']) => {
    soundFx.playTactileClick();
    setActiveTab(tabId);
  };

  const isLight = isLightColor(customColor);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Zone - Single text element */}
        <div 
          onClick={() => handleNavClick('feed')}
          className="flex cursor-pointer items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border transition-colors"
            style={{
              borderColor: getRgba(customColor, 0.4),
              color: customColor
            }}
          >
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
            We Space
            <span 
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide font-mono border"
              style={{
                backgroundColor: getRgba(customColor, 0.12),
                color: customColor,
                borderColor: getRgba(customColor, 0.35)
              }}
            >
              Verificado
            </span>
          </span>
        </div>

        {/* Nav Links Zone (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-zinc-900 shadow-sm border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon 
                  className="h-4 w-4" 
                  style={{ color: isActive ? customColor : undefined }}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span 
                    className="text-[10px] px-1.5 py-0.2 rounded border font-mono font-bold"
                    style={{
                      backgroundColor: getRgba(customColor, 0.15),
                      color: customColor,
                      borderColor: getRgba(customColor, 0.3)
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-2.5">
          
          {/* Tactical Sound FX Master Switch */}
          <button
            onClick={toggleAudioMute}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-mono ${
              !isAudioMuted 
                ? 'bg-zinc-900 border-zinc-700 shadow-sm' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            style={{
              color: !isAudioMuted ? customColor : undefined
            }}
            title={isAudioMuted ? 'Ativar Efeitos Sonoros Táticos' : 'Mutar Efeitos Sonoros'}
          >
            {!isAudioMuted ? (
              <>
                <Volume2 className="h-4 w-4" />
                <span className="hidden xl:inline text-[10px]">ÁUDIO FX</span>
              </>
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Color Palette Customizer Trigger & Quick Swatches */}
          <div className="flex items-center rounded-lg bg-zinc-900 p-1 border border-zinc-800 gap-1.5">
            {/* 3 Quick primary presets */}
            <div className="hidden sm:flex items-center gap-1">
              {PRESET_PALETTES.slice(0, 4).map((preset) => {
                const isSelected = customColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset.id)}
                    className={`h-5 w-5 rounded-md transition-all ${
                      isSelected ? 'ring-2 ring-white scale-110 shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={`Tema: ${preset.label} (${preset.hex})`}
                  />
                );
              })}
            </div>

            {/* Custom Color Wheel / Modal Opener Button */}
            <button
              onClick={() => {
                soundFx.playTactileClick();
                setIsPaletteModalOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-zinc-950 text-zinc-200 border border-zinc-700 hover:border-zinc-500 transition-all hover:text-white"
              title="Personalizar paleta de cores (qualquer cor)"
            >
              <div 
                className="h-3.5 w-3.5 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: customColor }}
              />
              <Palette className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden lg:inline text-[10px]">CORES</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playTactileClick();
              onOpenCreateModal();
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all shadow-md whitespace-nowrap active:scale-95"
            style={{
              backgroundColor: customColor,
              color: isLight ? '#09090b' : '#09090b',
              boxShadow: `0 2px 10px ${getRgba(customColor, 0.25)}`
            }}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Publicar Highlight</span>
            <span className="sm:hidden">Clipe</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTactileClick();
              onSelectPlayer(currentUser.id);
              setActiveTab('profiles');
            }}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 p-1.5 pr-2.5 hover:border-zinc-700 transition-colors"
            title="Meu Perfil"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="h-7 w-7 rounded-md object-cover border border-zinc-700"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-200 truncate max-w-[80px]">{currentUser.username}</span>
              <span 
                className="text-[10px] font-mono font-medium"
                style={{ color: customColor }}
              >
                {currentUser.reputationScore}% Rep
              </span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Submenu Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-zinc-800/80 bg-zinc-950 px-3 py-2 gap-1.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-white bg-zinc-800 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50'
              }`}
            >
              <Icon 
                className="h-3.5 w-3.5" 
                style={{ color: isActive ? customColor : undefined }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
