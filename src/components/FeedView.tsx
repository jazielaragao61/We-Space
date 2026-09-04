import React, { useState } from 'react';
import { 
  Flame, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Radio, 
  Users, 
  TrendingUp, 
  Award,
  Video,
  CheckCircle2,
  Eye,
  Crosshair,
  Sliders,
  Palette
} from 'lucide-react';
import { Clip, GameType } from '../types';
import { ClipCard } from './ClipCard';
import { useAtmosphere, getRgba, isLightColor } from '../context/ThemeAtmosphereContext';
import { soundFx } from '../utils/soundEngine';

interface FeedViewProps {
  clips: Clip[];
  onSelectPlayer: (playerId: string) => void;
  onOpenDuoModal: (clip: Clip) => void;
  onToggleEndorse: (clipId: string) => void;
  endorsedClips: Set<string>;
  onOpenMatchLog: (clip: Clip) => void;
  onOpenCreateModal: () => void;
  onOpenClipper: () => void;
  onOpenArenaTheater: (clip: Clip) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  clips,
  onSelectPlayer,
  onOpenDuoModal,
  onToggleEndorse,
  endorsedClips,
  onOpenMatchLog,
  onOpenCreateModal,
  onOpenClipper,
  onOpenArenaTheater
}) => {
  const { themeConfig, customColor, setIsPaletteModalOpen } = useAtmosphere();
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clutches' | 'igl_calls' | 'high_rep'>('all');
  const [dislikedClips, setDislikedClips] = useState<Set<string>>(new Set());

  const handleToggleDislike = (clipId: string) => {
    setDislikedClips((prev) => {
      const next = new Set(prev);
      if (next.has(clipId)) next.delete(clipId);
      else next.add(clipId);
      return next;
    });
  };

  const filteredClips = clips.filter((clip) => {
    if (selectedGameFilter !== 'all' && clip.game !== selectedGameFilter) {
      return false;
    }
    if (selectedCategory === 'clutches' && !clip.tags.some(t => t.toLowerCase().includes('clutch'))) {
      return false;
    }
    if (selectedCategory === 'igl_calls' && clip.voiceComms.callClarityScore < 95) {
      return false;
    }
    if (selectedCategory === 'high_rep' && clip.author.reputationScore < 96) {
      return false;
    }
    return true;
  });

  const handleFilterGame = (gameId: string) => {
    soundFx.playTactileClick();
    setSelectedGameFilter(gameId);
  };

  const handleCategoryFilter = (cat: 'all' | 'clutches' | 'igl_calls' | 'high_rep') => {
    soundFx.playTactileClick();
    setSelectedCategory(cat);
  };

  const isLight = isLightColor(customColor);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Artistic & Immersive Hero Stage */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-zinc-950/95 to-black p-6 md:p-10 shadow-2xl">
        
        {/* Subtle Ambient Radial Backlight */}
        <div 
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: customColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-mono"
              style={{ color: customColor }}
            >
              <span 
                className="h-2 w-2 rounded-full animate-ping"
                style={{ backgroundColor: customColor }}
              />
              <span>We Space • Hub de Reputação Visual Gamer</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-sans">
              "Jogue com quem presta, mostre como você joga."
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
              Highlights curtos de jogadas reais autenticados por logs oficiais de telemetria e áudio de comunicação limpa. Encontre duos e times sérios com base em evidências reais de jogo.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-zinc-300 font-mono">
              <span className="flex items-center gap-1.5 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: customColor }} />
                Telemetria Criptografada
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                <Radio className="h-3.5 w-3.5" style={{ color: customColor }} />
                Comms em Áudio Verificado
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                <Eye className="h-3.5 w-3.5" style={{ color: customColor }} />
                Modo Arena Theater 2D
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {clips[0] && (
              <button
                onClick={() => {
                  soundFx.playRadarPing();
                  onOpenArenaTheater(clips[0]);
                }}
                className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-lg font-mono"
                style={{
                  backgroundColor: customColor,
                  color: isLight ? '#09090b' : '#09090b',
                  boxShadow: `0 4px 20px ${getRgba(customColor, 0.3)}`
                }}
              >
                <Eye className="h-4 w-4" />
                <span>Abrir Destaque no Modo Arena</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playTactileClick();
                onOpenClipper();
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-6 py-3 text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all font-mono"
            >
              <Video className="h-4 w-4" style={{ color: customColor }} />
              <span>Clipper de Partida (Auto-Log)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Categorization Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-4">
        
        {/* Game Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 font-mono">
          {[
            { id: 'all', label: 'Todos os Jogos' },
            { id: 'Valorant', label: 'Valorant' },
            { id: 'CS2', label: 'CS2' },
            { id: 'League of Legends', label: 'League of Legends' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleFilterGame(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGameFilter === item.id
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono">
          <button
            onClick={() => handleCategoryFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'shadow-sm font-semibold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'all' ? getRgba(customColor, 0.15) : undefined,
              borderColor: selectedCategory === 'all' ? getRgba(customColor, 0.4) : undefined,
              color: selectedCategory === 'all' ? customColor : undefined
            }}
          >
            <Flame className="h-3 w-3" />
            <span>Mais Recentes</span>
          </button>

          <button
            onClick={() => handleCategoryFilter('clutches')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
              selectedCategory === 'clutches'
                ? 'shadow-sm font-semibold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'clutches' ? getRgba(customColor, 0.15) : undefined,
              borderColor: selectedCategory === 'clutches' ? getRgba(customColor, 0.4) : undefined,
              color: selectedCategory === 'clutches' ? customColor : undefined
            }}
          >
            <Zap className="h-3 w-3" />
            <span>Clutches Decisivos</span>
          </button>

          <button
            onClick={() => handleCategoryFilter('igl_calls')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
              selectedCategory === 'igl_calls'
                ? 'shadow-sm font-semibold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'igl_calls' ? getRgba(customColor, 0.15) : undefined,
              borderColor: selectedCategory === 'igl_calls' ? getRgba(customColor, 0.4) : undefined,
              color: selectedCategory === 'igl_calls' ? customColor : undefined
            }}
          >
            <Radio className="h-3 w-3" />
            <span>Call Limpa / IGL</span>
          </button>

          <button
            onClick={() => handleCategoryFilter('high_rep')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
              selectedCategory === 'high_rep'
                ? 'shadow-sm font-semibold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'high_rep' ? getRgba(customColor, 0.15) : undefined,
              borderColor: selectedCategory === 'high_rep' ? getRgba(customColor, 0.4) : undefined,
              color: selectedCategory === 'high_rep' ? customColor : undefined
            }}
          >
            <ShieldCheck className="h-3 w-3" />
            <span>Reputação 96%+</span>
          </button>
        </div>

      </div>

      {/* Vertical Snap Feed (TikTok Style) */}
      <div 
        className="flex flex-col h-[calc(100vh-140px)] w-full max-w-lg mx-auto overflow-y-scroll snap-y snap-mandatory bg-black rounded-3xl border border-zinc-800/80 shadow-2xl relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredClips.map((clip) => (
          <div key={clip.id} className="snap-start snap-always w-full h-full shrink-0 flex items-center justify-center p-0">
            <ClipCard
              clip={clip}
              onSelectPlayer={onSelectPlayer}
              onOpenDuoModal={onOpenDuoModal}
              onToggleEndorse={onToggleEndorse}
              hasEndorsed={endorsedClips.has(clip.id)}
              onToggleDislike={handleToggleDislike}
              hasDisliked={dislikedClips.has(clip.id)}
              onOpenMatchLog={onOpenMatchLog}
              onOpenArenaTheater={onOpenArenaTheater}
            />
          </div>
        ))}
      </div>

    </div>
  );
};
