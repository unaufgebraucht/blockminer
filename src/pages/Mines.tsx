import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame } from '@/context/GameContext';
import { Bomb, RotateCcw, Coins, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const GRID_SIZE = 5;
const BET_PRESETS = [10, 25, 50, 100, 250, 500];
const MINE_OPTIONS = [1, 3, 5, 10, 15, 20];

interface Tile {
  revealed: boolean;
  isMine: boolean;
  isGem: 'diamond' | 'emerald';
}

export default function Mines() {
  const { balance, addBalance, removeBalance } = useGame();
  const [betAmount, setBetAmount] = useState(50);
  const [customBet, setCustomBet] = useState('');
  const [mineCount, setMineCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const { playClick } = useSoundEffects();

  const calculateMultiplier = useCallback((revealed: number, mines: number) => {
    const totalSpots = GRID_SIZE * GRID_SIZE;
    const safeSpots = totalSpots - mines;
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= (totalSpots - i) / (safeSpots - i);
    }
    return Math.min(multiplier * 0.97, 1000);
  }, []);

  const handleCustomBetChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setCustomBet(num);
    const parsed = parseInt(num);
    if (parsed > 0) {
      setBetAmount(Math.min(parsed, balance));
    }
  };

  const adjustBet = (direction: 'half' | 'double' | 'max') => {
    playClick();
    if (direction === 'half') setBetAmount(Math.max(1, Math.floor(betAmount / 2)));
    else if (direction === 'double') setBetAmount(Math.min(balance, betAmount * 2));
    else setBetAmount(balance);
  };

  const startGame = () => {
    if (balance < betAmount) {
      toast.error("Not enough coins!");
      return;
    }

    if (!removeBalance(betAmount)) return;

    const newGrid: Tile[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        revealed: false,
        isMine: false,
        isGem: Math.random() > 0.5 ? 'diamond' : 'emerald',
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    setGrid(newGrid);
    setIsPlaying(true);
    setRevealedCount(0);
    setCurrentMultiplier(1);
    setGameOver(false);
    setWon(false);
  };

  const revealTile = (row: number, col: number) => {
    if (!isPlaying || gameOver || grid[row][col].revealed) return;

    const newGrid = [...grid.map(r => [...r])];
    newGrid[row][col].revealed = true;
    setGrid(newGrid);

    if (newGrid[row][col].isMine) {
      setGameOver(true);
      setIsPlaying(false);
      const revealedGrid = newGrid.map(r => r.map(t => ({
        ...t,
        revealed: t.isMine ? true : t.revealed,
      })));
      setGrid(revealedGrid);
      toast.error("BOOM! You hit a bomb!");
    } else {
      const newRevealed = revealedCount + 1;
      setRevealedCount(newRevealed);
      const newMultiplier = calculateMultiplier(newRevealed, mineCount);
      setCurrentMultiplier(newMultiplier);

      const safeSpots = GRID_SIZE * GRID_SIZE - mineCount;
      if (newRevealed >= safeSpots) {
        cashOut();
      }
    }
  };

  const cashOut = () => {
    if (!isPlaying || revealedCount === 0) return;

    const winnings = Math.floor(betAmount * currentMultiplier);
    addBalance(winnings);
    setIsPlaying(false);
    setWon(true);
    toast.success(`Cashed out ${winnings} coins!`);
  };

  const resetGame = () => {
    setGrid([]);
    setIsPlaying(false);
    setRevealedCount(0);
    setCurrentMultiplier(1);
    setGameOver(false);
    setWon(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-pixel text-xl md:text-2xl text-foreground mb-6 flex items-center gap-3"
        >
          <Bomb className="text-destructive" />
          MINES
        </motion.h1>

        <div className="grid md:grid-cols-[1fr,280px] gap-4">
          {/* Game Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="game-card p-4"
          >
            {!isPlaying && grid.length === 0 ? (
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ imageRendering: 'pixelated' }}
                  >
                    {getTexture('tnt')}
                  </motion.div>
                  <p className="font-minecraft text-muted-foreground text-sm">
                    Set your bet and mines,<br />then click START
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1.5">
                {grid.map((row, rowIndex) =>
                  row.map((tile, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => revealTile(rowIndex, colIndex)}
                      disabled={!isPlaying || tile.revealed || gameOver}
                      whileHover={!tile.revealed && isPlaying ? { scale: 1.08, y: -2 } : {}}
                      whileTap={!tile.revealed && isPlaying ? { scale: 0.92 } : {}}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (rowIndex * 5 + colIndex) * 0.02 }}
                      className={`aspect-square border-2 transition-all ${
                        tile.revealed
                          ? tile.isMine
                            ? 'border-destructive bg-destructive/20 glow-red'
                            : 'border-emerald bg-emerald/10'
                          : 'border-border bg-muted hover:border-accent/50 hover:bg-muted/80 cursor-pointer'
                      }`}
                    >
                      <AnimatePresence>
                        {tile.revealed && (
                          <motion.div
                            initial={{ scale: 0, rotateY: 180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="w-full h-full p-1"
                            style={{ imageRendering: 'pixelated' }}
                          >
                            {tile.isMine ? getTexture('tnt') : getTexture(tile.isGem)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!tile.revealed && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-muted-foreground/20 rounded-sm" />
                        </div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            )}

            {(gameOver || won) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <motion.p 
                  className={`font-pixel text-xl ${gameOver ? 'text-destructive' : 'text-emerald'}`}
                  animate={gameOver ? { x: [0, -5, 5, -3, 3, 0] } : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {gameOver ? 'GAME OVER!' : 'YOU WON!'}
                </motion.p>
                {won && (
                  <motion.p 
                    className="font-minecraft text-gold mt-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    +{Math.floor(betAmount * currentMultiplier)} coins
                  </motion.p>
                )}
                <button
                  onClick={resetGame}
                  className="mt-3 px-5 py-2 border-2 border-accent text-accent font-minecraft hover:bg-accent/10 transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  PLAY AGAIN
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="game-card p-4 space-y-4"
          >
            {/* Bet Amount */}
            <div>
              <label className="font-minecraft text-muted-foreground text-xs block mb-2">BET AMOUNT</label>
              
              {/* Custom input */}
              <div className="flex items-center gap-1 mb-2">
                <button
                  onClick={() => { playClick(); setBetAmount(Math.max(1, betAmount - 10)); }}
                  disabled={isPlaying}
                  className="p-1.5 border-2 border-border hover:border-accent transition-all disabled:opacity-40"
                >
                  <Minus className="w-3 h-3 text-muted-foreground" />
                </button>
                <div className="flex-1 relative">
                  <Coins className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gold" />
                  <input
                    type="text"
                    value={customBet || betAmount}
                    onChange={(e) => handleCustomBetChange(e.target.value)}
                    onBlur={() => {
                      const parsed = parseInt(customBet);
                      if (parsed > 0) setBetAmount(Math.min(parsed, balance));
                      setCustomBet('');
                    }}
                    onFocus={() => setCustomBet(String(betAmount))}
                    disabled={isPlaying}
                    className="w-full bg-muted border-2 border-border text-center font-pixel text-sm text-gold py-1.5 pl-6 focus:border-accent outline-none transition-all disabled:opacity-40"
                  />
                </div>
                <button
                  onClick={() => { playClick(); setBetAmount(Math.min(balance, betAmount + 10)); }}
                  disabled={isPlaying}
                  className="p-1.5 border-2 border-border hover:border-accent transition-all disabled:opacity-40"
                >
                  <Plus className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>

              {/* Quick adjust */}
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => adjustBet('half')}
                  disabled={isPlaying}
                  className="flex-1 py-1 border border-border font-minecraft text-[10px] text-muted-foreground hover:border-accent hover:text-accent transition-all disabled:opacity-40"
                >
                  ½
                </button>
                <button
                  onClick={() => adjustBet('double')}
                  disabled={isPlaying}
                  className="flex-1 py-1 border border-border font-minecraft text-[10px] text-muted-foreground hover:border-accent hover:text-accent transition-all disabled:opacity-40"
                >
                  2×
                </button>
                <button
                  onClick={() => adjustBet('max')}
                  disabled={isPlaying}
                  className="flex-1 py-1 border border-border font-minecraft text-[10px] text-muted-foreground hover:border-gold hover:text-gold transition-all disabled:opacity-40"
                >
                  MAX
                </button>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-1">
                {BET_PRESETS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { playClick(); setBetAmount(amount); }}
                    disabled={isPlaying}
                    className={`p-1.5 border font-minecraft text-xs transition-all ${
                      betAmount === amount
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-border text-muted-foreground hover:border-gold/50'
                    } ${isPlaying ? 'opacity-40' : ''}`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Bombs */}
            <div>
              <label className="font-minecraft text-muted-foreground text-xs block mb-2">
                BOMBS <span className="text-destructive">({mineCount})</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {MINE_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() => { playClick(); setMineCount(count); }}
                    disabled={isPlaying}
                    className={`p-1.5 border font-minecraft text-xs transition-all ${
                      mineCount === count
                        ? 'border-destructive bg-destructive/15 text-destructive'
                        : 'border-border text-muted-foreground hover:border-destructive/50'
                    } ${isPlaying ? 'opacity-40' : ''}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier display */}
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-3 border-2 border-accent bg-accent/5"
              >
                <p className="font-minecraft text-muted-foreground text-[10px]">MULTIPLIER</p>
                <p className="font-pixel text-xl text-accent">{currentMultiplier.toFixed(2)}x</p>
                <p className="font-minecraft text-gold text-xs mt-0.5">
                  {Math.floor(betAmount * currentMultiplier)} coins
                </p>
              </motion.div>
            )}

            {/* Action Button */}
            {!isPlaying ? (
              <motion.button
                onClick={startGame}
                disabled={balance < betAmount}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 border-2 font-pixel text-sm transition-all ${
                  balance >= betAmount
                    ? 'bg-accent/20 border-accent text-accent hover:bg-accent/30 glow-diamond'
                    : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                }`}
              >
                START ({betAmount} <Coins className="inline w-3 h-3" />)
              </motion.button>
            ) : (
              <motion.button
                onClick={cashOut}
                disabled={revealedCount === 0}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 border-2 font-pixel text-sm transition-all ${
                  revealedCount > 0
                    ? 'bg-gold/20 border-gold text-gold hover:bg-gold/30 glow-gold'
                    : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                }`}
              >
                CASH OUT ({Math.floor(betAmount * currentMultiplier)})
              </motion.button>
            )}

            <p className="font-minecraft text-muted-foreground/50 text-[9px] text-center">
              Avoid the bombs • Find the gems
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
