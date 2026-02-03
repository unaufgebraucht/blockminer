import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame } from '@/context/GameContext';
import { Bomb, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const GRID_SIZE = 5;
const BET_OPTIONS = [10, 25, 50, 100, 250, 500];
const MINE_OPTIONS = [1, 3, 5, 10, 15, 20];

interface Tile {
  revealed: boolean;
  isMine: boolean;
  isGem: 'diamond' | 'emerald';
}

export default function Mines() {
  const { balance, addBalance, removeBalance } = useGame();
  const [betAmount, setBetAmount] = useState(50);
  const [mineCount, setMineCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const calculateMultiplier = useCallback((revealed: number, mines: number) => {
    const safeSpots = GRID_SIZE * GRID_SIZE - mines;
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= safeSpots / (safeSpots - i);
    }
    return Math.min(multiplier * 0.97, 1000);
  }, []);

  const startGame = () => {
    if (balance < betAmount) {
      toast.error("Not enough coins!");
      return;
    }

    if (!removeBalance(betAmount)) {
      return;
    }

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
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
          <Bomb className="text-destructive" />
          MINES
        </h1>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Game Grid */}
          <div className="bg-card border-4 border-border p-4">
            {!isPlaying && grid.length === 0 ? (
              <div className="aspect-square flex items-center justify-center">
                <p className="font-minecraft text-muted-foreground text-center">
                  Set your bet and mines,<br />then click START
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {grid.map((row, rowIndex) =>
                  row.map((tile, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => revealTile(rowIndex, colIndex)}
                      disabled={!isPlaying || tile.revealed || gameOver}
                      whileHover={!tile.revealed && isPlaying ? { scale: 1.05 } : {}}
                      whileTap={!tile.revealed && isPlaying ? { scale: 0.95 } : {}}
                      className={`aspect-square border-4 transition-all ${
                        tile.revealed
                          ? tile.isMine
                            ? 'border-destructive bg-destructive/20'
                            : 'border-primary bg-primary/20'
                          : 'border-border bg-muted hover:border-primary/50 cursor-pointer'
                      }`}
                    >
                      <AnimatePresence>
                        {tile.revealed && (
                          <motion.div
                            initial={{ scale: 0, rotateY: 180 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            className="w-full h-full p-1"
                            style={{ imageRendering: 'pixelated' }}
                          >
                            {tile.isMine ? getTexture('tnt') : getTexture(tile.isGem)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!tile.revealed && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">❓</span>
                        </div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            )}

            {(gameOver || won) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center"
              >
                <p className={`font-pixel text-2xl ${gameOver ? 'text-destructive' : 'text-primary'}`}>
                  {gameOver ? 'GAME OVER!' : 'YOU WON!'}
                </p>
                {won && (
                  <p className="font-minecraft text-[hsl(var(--gold))] mt-2">
                    +{Math.floor(betAmount * currentMultiplier)} coins
                  </p>
                )}
                <button
                  onClick={resetGame}
                  className="mt-4 px-6 py-2 bg-muted border-4 border-primary text-foreground font-minecraft hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <RotateCcw className="inline-block mr-2 w-4 h-4" />
                  PLAY AGAIN
                </button>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-card border-4 border-border p-4 space-y-6">
            <div>
              <label className="font-minecraft text-muted-foreground text-sm block mb-2">BET AMOUNT</label>
              <div className="grid grid-cols-3 gap-2">
                {BET_OPTIONS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isPlaying}
                    className={`p-2 border-4 font-minecraft text-sm transition-all ${
                      betAmount === amount
                        ? 'border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))]'
                        : 'border-border text-muted-foreground hover:border-[hsl(var(--gold))]/50'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-minecraft text-muted-foreground text-sm block mb-2">BOMBS</label>
              <div className="grid grid-cols-3 gap-2">
                {MINE_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setMineCount(count)}
                    disabled={isPlaying}
                    className={`p-2 border-4 font-minecraft text-sm transition-all ${
                      mineCount === count
                        ? 'border-destructive bg-destructive/20 text-destructive'
                        : 'border-border text-muted-foreground hover:border-destructive/50'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {isPlaying && (
              <div className="text-center p-4 border-4 border-primary bg-primary/10">
                <p className="font-minecraft text-muted-foreground text-sm">MULTIPLIER</p>
                <p className="font-pixel text-2xl text-primary">{currentMultiplier.toFixed(2)}x</p>
                <p className="font-minecraft text-[hsl(var(--gold))] text-sm mt-1">
                  {Math.floor(betAmount * currentMultiplier)} coins
                </p>
              </div>
            )}

            {!isPlaying ? (
              <motion.button
                onClick={startGame}
                disabled={balance < betAmount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 border-4 font-pixel text-lg transition-all ${
                  balance >= betAmount
                    ? 'bg-primary border-primary text-primary-foreground hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                }`}
              >
                START GAME
              </motion.button>
            ) : (
              <motion.button
                onClick={cashOut}
                disabled={revealedCount === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 border-4 font-pixel text-lg transition-all ${
                  revealedCount > 0
                    ? 'bg-[hsl(var(--gold))] border-[hsl(var(--gold))] text-background hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                }`}
              >
                CASH OUT
              </motion.button>
            )}

            <div className="text-center font-minecraft text-muted-foreground text-xs">
              <p>Avoid the bombs!</p>
              <p>Diamonds & Emeralds = Safe</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
