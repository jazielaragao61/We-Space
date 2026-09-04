import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Flame, 
  Volume2, 
  MessageSquare, 
  Calendar, 
  Radio, 
  UserPlus, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Star, 
  Zap, 
  Award,
  Activity,
  Heart,
  TrendingUp,
  MapPin,
  Globe,
  Eye,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player, Clip } from '../types';
import { ClipCard } from './ClipCard';
import { RadarChart } from './RadarChart';
import { useAtmosphere, getRgba, isLightColor } from '../context/ThemeAtmosphereContext';
import { soundFx } from '../utils/soundEngine';

interface PlayerProfileViewProps {
  player: Player;
  onOpenDuoModal: (clip?: Clip, player?: Player) => void;
  onSelectPlayer: (playerId: string) => void;
  onToggleEndorse: (clipId: string) => void;
  endorsedClips: Set<string>;
  onOpenMatchLog: (clip: Clip) => void;
  onOpenReviewModal: (player: Player) => void;
  onOpenArenaTheater: (clip: Clip) => void;
}

export const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({
  player,
  onOpenDuoModal,
  onSelectPlayer,
  onToggleEndorse,
  endorsedClips,
  onOpenMatchLog,
  onOpenReviewModal,
  onOpenArenaTheater
}) => {
  const { customColor, themeConfig, setIsPaletteModalOpen } = useAtmosphere();
  const [activeTab, setActiveTab] = useState<'highlights' | 'radar' | 'voice' | 'reviews'>('highlights');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isPlayingVoiceSample, setIsPlayingVoiceSample] = useState(false);

  const handleCopy = (text: string, label: string) => {
    soundFx.playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleVoicePlayback = () => {
    soundFx.playVoiceSquelch();
    setIsPlayingVoiceSample(!isPlayingVoiceSample);
  };

  const isLight = isLightColor(customColor);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Profile Banner & Header Card */}
      <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/80 overflow-hidden shadow-2xl">
        {/* Banner Image */}
        <div className="relative h-44 sm:h-60 w-full bg-zinc-950 overflow-hidden">
          <img
            src={player.banner}
            alt={player.username}
            className="h-full w-full object-cover opacity-35 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span 
              className="px-3 py-1 rounded-full text-xs font-bold border font-mono"
              style={{
                backgroundColor: getRgba(customColor, 0.15),
                borderColor: getRgba(customColor, 0.4),
                color: customColor
              }}
            >
              Reputação: {player.reputationTier} ({player.reputationScore}/100)
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover border-4 border-zinc-900 bg-zinc-900 shadow-2xl"
                />
                <div 
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg font-bold shadow-md"
                  style={{
                    backgroundColor: customColor,
                    color: '#09090b'
                  }}
                  title="Jogador Verificado por Logs de Partida"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {player.username}
                  </h1>
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                    @{player.handle}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                  {player.ranks.map((r, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 bg-zinc-950/80 px-2.5 py-1 rounded-md border border-zinc-800 font-medium font-mono">
                      <span>{r.tierIcon}</span>
                      <span className="text-zinc-200">{r.game}:</span>
                      <span className="font-semibold" style={{ color: customColor }}>{r.rankName} ({r.eloOrLevel})</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                    {player.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-zinc-500" />
                    {player.languages.join(' • ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  soundFx.playTactileClick();
                  onOpenReviewModal(player);
                }}
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all font-mono"
              >
                <Star className="h-4 w-4 text-amber-400" />
                <span>Avaliar Jogador</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playTactileClick();
                  onOpenDuoModal(player.clips[0], player);
                }}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-md font-mono"
                style={{
                  backgroundColor: customColor,
                  color: isLight ? '#09090b' : '#09090b',
                  boxShadow: `0 4px 14px ${getRgba(customColor, 0.25)}`
                }}
              >
                <UserPlus className="h-4 w-4" />
                <span>Convidar para Duo</span>
              </button>
            </div>

          </div>

          {/* Verified Badges Bar */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-zinc-800/80">
            {player.verifiedBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-950/80 border px-3 py-1 text-xs font-semibold font-mono"
                style={{
                  borderColor: getRgba(customColor, 0.35),
                  color: customColor
                }}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>{badge}</span>
              </div>
            ))}
          </div>

          {/* Player Bio & Playstyle */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 p-4 space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Filosofia & Funções no Jogo
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                "{player.bio}"
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {player.mainRoles.map((role, idx) => (
                  <span key={idx} className="text-xs bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-md font-medium">
                    {role}
                  </span>
                ))}
                {player.mainAgentsOrHeroes.map((agent, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-0.5 rounded-md font-mono border"
                    style={{
                      backgroundColor: getRgba(customColor, 0.12),
                      borderColor: getRgba(customColor, 0.3),
                      color: customColor
                    }}
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-950/50 border border-zinc-800/80 p-4 space-y-2 text-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Disponibilidade & IDs
              </span>
              <div className="space-y-1.5 text-zinc-300">
                <div>
                  <span className="text-zinc-500">Status:</span> 
                  <span className="font-semibold ml-1" style={{ color: customColor }}>{player.availability.status}</span>
                </div>
                <div><span className="text-zinc-500">Horário:</span> {player.availability.schedule}</div>
                <div><span className="text-zinc-500">Regra:</span> <span className="text-amber-400">{player.availability.micRequirement}</span></div>
              </div>

              {/* Social IDs Copy */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => handleCopy(player.socials.discord, 'Discord')}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[11px] font-mono border border-zinc-700"
                >
                  {copiedText === 'Discord' ? <Check className="h-3 w-3" style={{ color: customColor }} /> : <Copy className="h-3 w-3" />}
                  <span>{player.socials.discord}</span>
                </button>
                <button
                  onClick={() => handleCopy(player.socials.riotOrSteam, 'Riot')}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-[11px] font-mono border border-zinc-700"
                >
                  {copiedText === 'Riot' ? <Check className="h-3 w-3" style={{ color: customColor }} /> : <Copy className="h-3 w-3" />}
                  <span>{player.socials.riotOrSteam}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2 overflow-x-auto no-scrollbar font-mono">
        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('highlights');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors whitespace-nowrap border ${
            activeTab === 'highlights'
              ? 'shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
          }`}
          style={{
            backgroundColor: activeTab === 'highlights' ? customColor : undefined,
            color: activeTab === 'highlights' ? '#09090b' : undefined,
            borderColor: activeTab === 'highlights' ? customColor : 'transparent'
          }}
        >
          <Flame className="h-4 w-4" />
          <span>Highlights Reais ({player.clips.length})</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('radar');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors whitespace-nowrap border ${
            activeTab === 'radar'
              ? 'shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
          }`}
          style={{
            backgroundColor: activeTab === 'radar' ? customColor : undefined,
            color: activeTab === 'radar' ? '#09090b' : undefined,
            borderColor: activeTab === 'radar' ? customColor : 'transparent'
          }}
        >
          <Activity className="h-4 w-4" />
          <span>Radar DNA & Stats</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('voice');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors whitespace-nowrap border ${
            activeTab === 'voice'
              ? 'shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
          }`}
          style={{
            backgroundColor: activeTab === 'voice' ? customColor : undefined,
            color: activeTab === 'voice' ? '#09090b' : undefined,
            borderColor: activeTab === 'voice' ? customColor : 'transparent'
          }}
        >
          <Volume2 className="h-4 w-4" />
          <span>Comunicação em Jogo</span>
        </button>

        <button
          onClick={() => {
            soundFx.playTactileClick();
            setActiveTab('reviews');
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors whitespace-nowrap border ${
            activeTab === 'reviews'
              ? 'shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
          }`}
          style={{
            backgroundColor: activeTab === 'reviews' ? customColor : undefined,
            color: activeTab === 'reviews' ? '#09090b' : undefined,
            borderColor: activeTab === 'reviews' ? customColor : 'transparent'
          }}
        >
          <Star className="h-4 w-4" />
          <span>Avaliações de Duos ({player.reviews.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: Highlights Reais */}
      {activeTab === 'highlights' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Clipes Autenticados por Logs de Partida</h2>
              <p className="text-xs text-zinc-400">
                Mostra como o jogador atua em momentos de pressão extrema, clutches e tomadas de decisão tática.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {player.clips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onSelectPlayer={onSelectPlayer}
                onOpenDuoModal={onOpenDuoModal}
                onToggleEndorse={onToggleEndorse}
                hasEndorsed={endorsedClips.has(clip.id)}
                onOpenMatchLog={onOpenMatchLog}
                onOpenArenaTheater={onOpenArenaTheater}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DNA & Estatísticas com RADAR SVG ARTÍSTICO */}
      {activeTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interactive SVG Radar Hexagon */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <RadarChart data={player.radarScores} size={300} showComparison={true} />
          </div>

          {/* Hard Stats & Trust Index */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">K/D Verificado</span>
                <span className="text-2xl font-extrabold text-white font-mono">{player.stats.kd}</span>
                <span className="text-[11px] block font-mono" style={{ color: customColor }}>Top 2% no servidor</span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Taxa de Vitória</span>
                <span className="text-2xl font-extrabold text-white font-mono">{player.stats.winRate}%</span>
                <span className="text-[11px] block font-mono" style={{ color: customColor }}>Em {player.stats.matchesLogged} partidas</span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Partidas 100% Zero Tilt</span>
                <span className="text-2xl font-extrabold font-mono" style={{ color: customColor }}>{player.stats.tiltFreeMatches}</span>
                <span className="text-[11px] text-zinc-400 block font-mono">Zero denúncias</span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Endossos Recebidos</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">{player.stats.endorsementsReceived}</span>
                <span className="text-[11px] text-zinc-400 block font-mono">Por companheiros</span>
              </div>
            </div>

            <div 
              className="rounded-2xl border p-5 space-y-2"
              style={{
                backgroundColor: getRgba(customColor, 0.08),
                borderColor: getRgba(customColor, 0.3)
              }}
            >
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: customColor }}>
                <Shield className="h-4 w-4" />
                <span>Certificado de Telemetria We Space</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Este perfil possui telemetria ativa. Cada estatística é correlacionada a identificadores de partida no servidor, garantindo ausência de smurfing nocivo, toxicidade ou dados fabricados.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: Comunicação em Jogo */}
      {activeTab === 'voice' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="h-4 w-4" style={{ color: customColor }} />
              Amostra de Comunicação em Round Decisivo
            </h3>
            <p className="text-xs text-zinc-400">
              Escute como o jogador se comunica sob pressão, passando posições limpas e sem poluição na chamada.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleVoicePlayback}
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
                  style={{
                    backgroundColor: customColor,
                    color: isLight ? '#09090b' : '#09090b',
                    boxShadow: `0 4px 14px ${getRgba(customColor, 0.3)}`
                  }}
                >
                  {isPlayingVoiceSample ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5 fill-current" />}
                </button>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{player.voiceCommsSnippet.title}</h4>
                  <span className="text-xs font-mono text-zinc-400">Duração: {player.voiceCommsSnippet.duration} • Clareza: {player.voiceCommsSnippet.clarityScore}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span 
                  className="text-xs font-mono border px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: getRgba(customColor, 0.12),
                    borderColor: getRgba(customColor, 0.3),
                    color: customColor
                  }}
                >
                  Taxa de Ruído: Baixa (Filtro Ativo)
                </span>
              </div>
            </div>

            {/* Audio waveform mockup */}
            <div className="flex items-center gap-1 h-8 px-2 bg-zinc-900/60 rounded-lg">
              {[20, 45, 60, 85, 95, 70, 40, 80, 100, 90, 75, 50, 30, 60, 85, 90, 60, 35, 20, 10, 30, 60, 80, 95, 70, 40, 20, 10, 5, 2].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: isPlayingVoiceSample ? customColor : '#3f3f46',
                    height: `${isPlayingVoiceSample ? Math.max(15, h * (0.5 + Math.random() * 0.5)) : h * 0.4}%` 
                  }}
                />
              ))}
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-200 italic leading-relaxed">
              {player.voiceCommsSnippet.transcript}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Avaliações de Duos */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Avaliações Verificadas por Partidas Reais</h3>
              <p className="text-xs text-zinc-400">
                Apenas jogadores que realmente disputaram uma partida com {player.username} podem emitir avaliações.
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playTactileClick();
                onOpenReviewModal(player);
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors font-mono"
              style={{
                backgroundColor: customColor,
                color: isLight ? '#09090b' : '#09090b'
              }}
            >
              <Star className="h-3.5 w-3.5" />
              <span>Avaliar</span>
            </button>
          </div>

          <div className="space-y-4">
            {player.reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.authorAvatar}
                      alt={rev.authorName}
                      className="h-10 w-10 rounded-lg object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-100">{rev.authorName}</span>
                        <span className="text-xs font-mono" style={{ color: customColor }}>{rev.authorRank}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span>{rev.matchContext}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-zinc-500">Match #{rev.verifiedMatchId.slice(-5)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                  {rev.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 font-medium"
                      style={{ color: customColor }}
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
