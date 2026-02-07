import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Crown,
  Globe,
  DollarSign
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
  const [customAmount, setCustomAmount] = useState('');
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

      const isAdminUser = data?.is_admin || data?.username?.toLowerCase() === 'albiza';
      setIsAdmin(isAdminUser);

      if (isAdminUser) {
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
      const { data: playersData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

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

  const giveCoins = async (player: PlayerData, amount: number) => {
    if (!user || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    // Optimistic update
    const newBalance = player.balance + amount;
    setPlayers(prev => prev.map(p => 
      p.id === player.id ? { ...p, balance: newBalance } : p
    ));
    setStats(prev => ({
      ...prev,
      totalBalance: prev.totalBalance + amount
    }));
    if (selectedPlayer?.id === player.id) {
      setSelectedPlayer({ ...player, balance: newBalance });
    }

    try {
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', player.user_id);

      await supabase.from('transactions').insert({
        user_id: player.user_id,
        type: 'admin_grant',
        amount: amount,
        admin_id: user.id,
      });

      toast.success(`Gave ${amount} coins to ${player.username}`);
      setCustomAmount('');
    } catch (error) {
      console.error('Error giving coins:', error);
      toast.error('Failed to give coins');
      // Revert on error
      await loadData();
    }
  };

  const giveItem = async (player: PlayerData) => {
    if (!user) return;

    // Optimistic update
    setPlayers(prev => prev.map(p => 
      p.id === player.id ? { ...p, item_count: p.item_count + 1 } : p
    ));

    try {
      const { data: insertedItem } = await supabase.from('inventory').insert({
        user_id: player.user_id,
        item_name: selectedItem.name,
        item_rarity: selectedItem.rarity,
        item_value: selectedItem.value,
        item_texture: selectedItem.texture,
        item_type: selectedItem.type,
      }).select('id').single();

      await supabase.from('transactions').insert({
        user_id: player.user_id,
        type: 'admin_item_grant',
        item_id: insertedItem?.id || null,
        item_name: selectedItem.name,
        admin_id: user.id,
      });

      toast.success(`Gave ${selectedItem.name} to ${player.username}`);
    } catch (error) {
      console.error('Error giving item:', error);
      toast.error('Failed to give item');
      await loadData();
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
              <div className="p-2 bg-primary/20 rounded">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">PLAYERS</p>
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
              <div className="p-2 bg-[hsl(var(--gold))]/20 rounded">
                <DollarSign className="w-6 h-6 text-[hsl(var(--gold))]" />
              </div>
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
              <div className="p-2 bg-[hsl(var(--emerald))]/20 rounded">
                <TrendingUp className="w-6 h-6 text-[hsl(var(--emerald))]" />
              </div>
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
              <div className="p-2 bg-destructive/20 rounded">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-minecraft text-muted-foreground text-xs">WITHDRAWN</p>
                <p className="font-pixel text-xl text-destructive">{stats.totalWithdrawn.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Players List */}
        <div className="game-card p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-pixel text-lg text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              PLAYERS ({filteredPlayers.length})
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full sm:w-48 pl-10 pr-4 py-2 bg-secondary border-4 border-border font-minecraft text-foreground focus:border-primary outline-none text-sm"
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
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-4 border-border">
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">USER</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">BALANCE</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">ITEMS</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">
                    <Globe className="w-3 h-3 inline mr-1" />COUNTRY
                  </th>
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">DEP/WITH</th>
                  <th className="text-left font-minecraft text-muted-foreground p-2 text-xs">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {player.is_admin && <Crown className="w-4 h-4 text-[hsl(var(--gold))]" />}
                        <span className="font-minecraft text-foreground text-sm">{player.username}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="font-pixel text-[hsl(var(--gold))] text-sm">{player.balance.toLocaleString()}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-muted-foreground text-sm">{player.item_count}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-muted-foreground text-sm">{player.country || '—'}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-minecraft text-[hsl(var(--emerald))] text-xs">+{(player.total_deposited || 0).toLocaleString()}</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="font-minecraft text-destructive text-xs">-{(player.total_withdrawn || 0).toLocaleString()}</span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
                        className={`px-3 py-1 border-4 font-minecraft text-xs transition-all ${
                          selectedPlayer?.id === player.id 
                            ? 'border-destructive bg-destructive/20 text-destructive' 
                            : 'border-primary bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
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
          <AnimatePresence>
            {selectedPlayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="p-4 border-4 border-primary bg-primary/5">
                  <h3 className="font-pixel text-lg text-foreground mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    Managing: {selectedPlayer.username}
                    <span className="text-muted-foreground font-minecraft text-sm ml-2">
                      (Balance: <span className="text-[hsl(var(--gold))]">{selectedPlayer.balance.toLocaleString()}</span>)
                    </span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Give Coins */}
                    <div className="space-y-3">
                      <h4 className="font-minecraft text-muted-foreground flex items-center gap-2 text-sm">
                        <Coins className="w-4 h-4" /> GIVE COINS
                      </h4>
                      
                      {/* Quick amounts */}
                      <div className="flex gap-2 flex-wrap">
                        {[100, 500, 1000, 5000, 10000].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => giveCoins(selectedPlayer, amount)}
                            className="px-3 py-1 border-4 border-border bg-secondary font-pixel text-xs text-muted-foreground hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] transition-all"
                          >
                            +{amount}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom amount */}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Custom amount..."
                          className="flex-1 px-3 py-2 bg-secondary border-4 border-border font-minecraft text-foreground focus:border-[hsl(var(--gold))] outline-none text-sm"
                        />
                        <button
                          onClick={() => giveCoins(selectedPlayer, parseInt(customAmount) || 0)}
                          disabled={!customAmount || parseInt(customAmount) <= 0}
                          className="px-4 py-2 border-4 border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))] font-minecraft text-sm hover:bg-[hsl(var(--gold))] hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          GIVE
                        </button>
                      </div>
                    </div>

                    {/* Give Item */}
                    <div className="space-y-3">
                      <h4 className="font-minecraft text-muted-foreground flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4" /> GIVE ITEM
                      </h4>
                      <div className="grid grid-cols-6 gap-2 max-h-28 overflow-y-auto">
                        {ITEM_POOL.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedItem(item)}
                            className={`aspect-square border-4 p-1 transition-all ${
                              selectedItem.name === item.name
                                ? 'border-primary ring-2 ring-primary'
                                : RARITY_COLORS[item.rarity].className
                            } bg-secondary hover:scale-105`}
                            title={`${item.name} (${item.value} coins)`}
                          >
                            <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                              {getTexture(item.texture)}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`font-minecraft ${RARITY_COLORS[selectedItem.rarity].text} text-sm`}>
                            {selectedItem.name}
                          </span>
                          <span className="font-minecraft text-muted-foreground text-xs ml-2">
                            ({selectedItem.value} coins)
                          </span>
                        </div>
                        <button
                          onClick={() => giveItem(selectedPlayer)}
                          className="px-4 py-2 border-4 border-primary bg-primary/20 text-primary font-minecraft text-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          GIVE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}