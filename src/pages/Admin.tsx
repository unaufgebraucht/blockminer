import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ITEM_POOL, RARITY_COLORS } from '@/data/items';
import { getTexture } from '@/components/MinecraftTextures';
import { 
  Shield, 
  Users, 
  Coins, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Search,
  Gift,
  RefreshCw,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface PlayerData {
  id: string;
  user_id: string;
  username: string;
  balance: number;
  total_deposited: number;
  total_withdrawn: number;
  country: string | null;
  is_admin: boolean;
  created_at: string;
  item_count: number;
}

interface CasinoStats {
  totalPlayers: number;
  totalBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [stats, setStats] = useState<CasinoStats>({
    totalPlayers: 0,
    totalBalance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [giveAmount, setGiveAmount] = useState(100);
  const [selectedItem, setSelectedItem] = useState(ITEM_POOL[0]);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin, username')
        .eq('user_id', user.id)
        .single();

      // Check if user is admin or is Albiza
      const isAdminUser = data?.is_admin || data?.username?.toLowerCase() === 'albiza';
      setIsAdmin(isAdminUser);

      if (isAdminUser) {
        // If user is Albiza but not marked as admin, update their status
        if (data?.username?.toLowerCase() === 'albiza' && !data?.is_admin) {
          await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('user_id', user.id);
        }
        await loadData();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load all players
      const { data: playersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get item counts for each player
      const playersWithItems = await Promise.all(
        (playersData || []).map(async (player) => {
          const { count } = await supabase
            .from('inventory')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', player.user_id);

          return {
            ...player,
            item_count: count || 0,
          };
        })
      );

      setPlayers(playersWithItems);

      // Calculate stats
      const totalBalance = playersWithItems.reduce((sum, p) => sum + (p.balance || 0), 0);
      const totalDeposited = playersWithItems.reduce((sum, p) => sum + (p.total_deposited || 0), 0);
      const totalWithdrawn = playersWithItems.reduce((sum, p) => sum + (p.total_withdrawn || 0), 0);

      setStats({
        totalPlayers: playersWithItems.length,
        totalBalance,
        totalDeposited,
        totalWithdrawn,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const giveCoins = async (player: PlayerData) => {
    if (!user) return;

    try {
      const newBalance = player.balance + giveAmount;
      
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', player.user_id);

      // Log the transaction
      await supabase.from('transactions').insert({
        user_id: player.user_id,
        type: 'admin_grant',
        amount: giveAmount,
        admin_id: user.id,
      });

      toast.success(`Gave ${giveAmount} coins to ${player.username}`);
      await loadData();
    } catch (error) {
      console.error('Error giving coins:', error);
      toast.error('Failed to give coins');
    }
  };

  const giveItem = async (player: PlayerData) => {
    if (!user) return;

    try {
      const itemId = `admin-${Date.now()}`;
      
      await supabase.from('inventory').insert({
        id: itemId,
        user_id: player.user_id,
        item_name: selectedItem.name,
        item_rarity: selectedItem.rarity,
        item_value: selectedItem.value,
        item_texture: selectedItem.texture,
        item_type: selectedItem.type,
      });

      // Log the transaction
      await supabase.from('transactions').insert({
        user_id: player.user_id,
        type: 'admin_item_grant',
        item_id: itemId,
        item_name: selectedItem.name,
        admin_id: user.id,
      });

      toast.success(`Gave ${selectedItem.name} to ${player.username}`);
      await loadData();
    } catch (error) {
      console.error('Error giving item:', error);
      toast.error('Failed to give item');
    }
  };

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="font-pixel text-primary animate-pulse">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-pixel text-2xl text-destructive mb-2">ACCESS DENIED</h1>
            <p className="font-minecraft text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
          <Crown className="text-[hsl(var(--gold))]" />
          ADMIN PANEL
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-card p-4"
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">TOTAL PLAYERS</p>
                <p className="font-pixel text-xl text-foreground">{stats.totalPlayers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="game-card p-4"
          >
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-[hsl(var(--gold))]" />
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">TOTAL BALANCE</p>
                <p className="font-pixel text-xl text-[hsl(var(--gold))]">{stats.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="game-card p-4"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[hsl(var(--emerald))]" />
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">DEPOSITED</p>
                <p className="font-pixel text-xl text-[hsl(var(--emerald))]">{stats.totalDeposited.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="game-card p-4"
          >
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-destructive" />
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">WITHDRAWN</p>
                <p className="font-pixel text-xl text-destructive">{stats.totalWithdrawn.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Players List */}
        <div className="game-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-pixel text-lg text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              PLAYERS
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search players..."
                  className="pl-10 pr-4 py-2 bg-secondary border-4 border-border font-minecraft text-foreground focus:border-primary outline-none"
                />
              </div>
              <button
                onClick={loadData}
                className="p-2 border-4 border-border bg-secondary hover:border-primary transition-all"
              >
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-border">
                  <th className="text-left font-minecraft text-muted-foreground p-2">USERNAME</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">BALANCE</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">ITEMS</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">COUNTRY</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">DEPOSITED</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">WITHDRAWN</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {player.is_admin && <Crown className="w-4 h-4 text-[hsl(var(--gold))]" />}
                        <span className="font-minecraft text-foreground">{player.username}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="font-pixel text-[hsl(var(--gold))]">{player.balance.toLocaleString()}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-muted-foreground">{player.item_count}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-muted-foreground">{player.country || 'Unknown'}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-[hsl(var(--emerald))]">{(player.total_deposited || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-destructive">{(player.total_withdrawn || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                        className="px-3 py-1 border-4 border-primary bg-primary/20 text-primary font-minecraft text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {selectedPlayer?.id === player.id ? 'CLOSE' : 'MANAGE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Player Panel */}
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 border-4 border-primary bg-primary/10"
            >
              <h3 className="font-pixel text-lg text-foreground mb-4">
                Managing: {selectedPlayer.username}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Give Coins */}
                <div className="space-y-3">
                  <h4 className="font-minecraft text-muted-foreground flex items-center gap-2">
                    <Coins className="w-4 h-4" /> GIVE COINS
                  </h4>
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setGiveAmount(amount)}
                        className={`px-3 py-1 border-4 font-pixel text-xs transition-all ${
                          giveAmount === amount
                            ? 'border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))]'
                            : 'border-border text-muted-foreground hover:border-[hsl(var(--gold))]/50'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => giveCoins(selectedPlayer)}
                    className="w-full py-2 border-4 border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] font-minecraft hover:bg-[hsl(var(--gold))] hover:text-background transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    GIVE {giveAmount} COINS
                  </button>
                </div>

                {/* Give Item */}
                <div className="space-y-3">
                  <h4 className="font-minecraft text-muted-foreground flex items-center gap-2">
                    <Package className="w-4 h-4" /> GIVE ITEM
                  </h4>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {ITEM_POOL.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItem(item)}
                        className={`aspect-square border-4 p-1 ${
                          selectedItem.name === item.name
                            ? 'border-primary'
                            : RARITY_COLORS[item.rarity].className
                        } bg-secondary`}
                        title={item.name}
                      >
                        <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                          {getTexture(item.texture)}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <span className={`font-minecraft ${RARITY_COLORS[selectedItem.rarity].text}`}>
                      {selectedItem.name}
                    </span>
                    <span className="font-minecraft text-muted-foreground ml-2">
                      ({selectedItem.value} coins)
                    </span>
                  </div>
                  <button
                    onClick={() => giveItem(selectedPlayer)}
                    className="w-full py-2 border-4 border-primary bg-primary/20 text-primary font-minecraft hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    GIVE ITEM
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
