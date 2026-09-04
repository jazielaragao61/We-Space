import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Flame, 
  Radio, 
  CheckCircle2, 
  UserPlus, 
  SlidersHorizontal, 
  Gamepad2, 
  Volume2, 
  Sparkles,
  Zap,
  Plus
} from 'lucide-react';
import { Player, GameType, Clip } from '../types';
import { useAtmosphere, getRgba, isLightColor } from '../context/ThemeAtmosphereContext';
import { soundFx } from '../utils/soundEngine';

interface MatchmakingDuoFinderProps {
  players: Player[];
  onSelectPlayer: (playerId: string) => void;
  onOpenDuoModal: (clip?: Clip, player?: Player) => void;
}

export const MatchmakingDuoFinder: React.FC<MatchmakingDuoFinderProps> = ({
  players,
  onSelectPlayer,
  onOpenDuoModal
}) => {
  const { customColor } = useAtmosphere();
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [minReputation, setMinReputation] = useState<number>(90);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [onlyMicRequired, setOnlyMicRequired] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 5-Stack Squad Builder state
  const [squad, setSquad] = useState<Array<{ slot: string; player: Player | null }>>([
    { slot: 'IGL / Capitão', player: players[0] },
    { slot: 'Entry / Duelista', player: players[1] },
    { slot: 'Suporte / Iniciador', player: players[3] },
    { slot: 'Flex / Controlador', player: null },
    { slot: 'Âncora / Sentinela', player: null }
  ]);

  const filteredPlayers = players.filter((p) => {
    if (selectedGame !== 'all' && p.primaryGame !== selectedGame && p.secondaryGame !== selectedGame) {
      return false;
    }
    if (p.reputationScore < minReputation) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.username.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q);
      const matchRole = p.mainRoles.some(r => r.toLowerCase().includes(q));
      const matchBio = p.bio.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchBio) return false;
    }
    return true;
  });

  const handleAddPlayerToSquad = (player: Player) => {
    soundFx.playTactileClick();
    setSquad((prev) => {
      const emptySlotIndex = prev.findIndex(s => s.player === null);
      if (emptySlotIndex !== -1) {
        const next = [...prev];
        next[emptySlotIndex] = { ...next[emptySlotIndex], player };
        return next;
      }
      return prev;
    });
  };

  const handleRemoveFromSquad = (index: number) => {
    soundFx.playTactileClick();
    setSquad((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], player: null };
      return next;
    });
  };

  const isLight = isLightColor(customColor);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 md:p-8">
        <div className="max-w-3xl space-y-2">
          <div 
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono"
            style={{ color: customColor }}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Matchmaking com Reputação Comprovada</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Encontre Duos e Monte seu 5-Stack sem Tilt
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Esqueça filas aleatórias com jogadores tóxicos ou que não passam call. No We Space, você recruta duos avaliados por telemetria e com histórico limpo verificado.
          </p>
        </div>
      </div>

      {/* Interactive 5-Stack Squad Builder */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: customColor }} />
              Montador de Squad & Time Competitivo
            </h2>
            <p className="text-xs text-zinc-400">
              Monte uma equipe equilibrada com funções táticas complementares e reputação 95%+
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-mono border px-3 py-1 rounded-full font-bold"
              style={{
                backgroundColor: getRgba(customColor, 0.12),
                borderColor: getRgba(customColor, 0.35),
                color: customColor
              }}
            >
              Média do Squad: 97.6% Reputação
            </span>
          </div>
        </div>

        {/* Squad Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {squad.map((slotItem, index) => {
            const hasPlayer = !!slotItem.player;
            return (
              <div
                key={index}
                className={`rounded-xl border p-3 flex flex-col justify-between transition-all ${
                  hasPlayer
                    ? 'border-zinc-700 bg-zinc-950/80 text-white'
                    : 'border-dashed border-zinc-800 bg-zinc-950/30 text-zinc-500'
                }`}
              >
                <div>
                  <span 
                    className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-2"
                    style={{ color: customColor }}
                  >
                    Slot {index + 1}: {slotItem.slot}
                  </span>

                  {hasPlayer && slotItem.player ? (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={slotItem.player.avatar}
                        alt={slotItem.player.username}
                        className="h-9 w-9 rounded-lg object-cover border border-zinc-700"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-zinc-100 block truncate">{slotItem.player.username}</span>
                        <span className="text-[10px] font-mono" style={{ color: customColor }}>{slotItem.player.reputationScore}% Reputação</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-10 flex items-center justify-center text-xs text-zinc-500">
                      Vaga Aberta
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-zinc-800/60 flex justify-end">
                  {hasPlayer ? (
                    <button
                      onClick={() => handleRemoveFromSquad(index)}
                      className="text-[10px] text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      Remover
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono" style={{ color: customColor }}>Pronto p/ Adicionar</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nick, função ou elo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {/* Game Filter */}
          <div>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-white focus:outline-none"
            >
              <option value="all">Todos os Jogos</option>
              <option value="Valorant">Valorant</option>
              <option value="CS2">Counter-Strike 2</option>
              <option value="League of Legends">League of Legends</option>
            </select>
          </div>

          {/* Minimum Reputation Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Reputação Mínima:</span>
              <span className="font-bold" style={{ color: customColor }}>{minReputation}%+</span>
            </div>
            <input
              type="range"
              min="70"
              max="98"
              value={minReputation}
              onChange={(e) => setMinReputation(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: customColor }}
            />
          </div>

          {/* Voice Mic Requirement Checkbox */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2 border border-zinc-800">
            <span className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5" style={{ color: customColor }} />
              Call Limpa Obrigatória
            </span>
            <input
              type="checkbox"
              checked={onlyMicRequired}
              onChange={(e) => setOnlyMicRequired(e.target.checked)}
              className="h-4 w-4 rounded"
              style={{ accentColor: customColor }}
            />
          </div>

        </div>
      </div>

      {/* Players Directory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              {/* Header: Player Avatar, Name & Reputation */}
              <div className="flex items-start justify-between">
                <div 
                  onClick={() => {
                    soundFx.playTactileClick();
                    onSelectPlayer(player.id);
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="h-12 w-12 rounded-xl object-cover border border-zinc-700 group-hover:border-zinc-500 transition-colors"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-zinc-950"
                      style={{ backgroundColor: customColor }}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">
                        {player.username}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">@{player.handle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="font-semibold" style={{ color: customColor }}>{player.ranks[0]?.rankName}</span>
                      <span>•</span>
                      <span>{player.ranks[0]?.eloOrLevel}</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-bold font-mono"
                  style={{
                    backgroundColor: getRgba(customColor, 0.12),
                    borderColor: getRgba(customColor, 0.35),
                    color: customColor
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{player.reputationScore}%</span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-zinc-300 mt-3 line-clamp-2 leading-relaxed">
                "{player.bio}"
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {player.verifiedBadges.slice(0, 3).map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-zinc-950 px-2 py-0.5 rounded border font-medium"
                    style={{
                      borderColor: getRgba(customColor, 0.25),
                      color: customColor
                    }}
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>

              {/* Quick highlight snippet */}
              {player.clips[0] && (
                <div 
                  onClick={() => {
                    soundFx.playTactileClick();
                    onSelectPlayer(player.id);
                  }}
                  className="mt-3 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-zinc-200 truncate max-w-[220px]">
                      {player.clips[0].title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: customColor }}>Ver Clipe</span>
                </div>
              )}
            </div>

            {/* Actions Row */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => handleAddPlayerToSquad(player)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" style={{ color: customColor }} />
                <span>Adicionar ao Squad</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.playTactileClick();
                    onSelectPlayer(player.id);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  Ver DNA
                </button>
                <button
                  onClick={() => {
                    soundFx.playTactileClick();
                    onOpenDuoModal(player.clips[0], player);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  style={{
                    backgroundColor: customColor,
                    color: isLight ? '#09090b' : '#09090b'
                  }}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Chamar Duo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
