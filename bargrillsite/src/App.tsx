import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  LogIn,
  X,
  UtensilsCrossed,
  Save,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';

// Supabase povezivanje
const supabase = createClient(
  'https://yzhvnnirhvufjhzlzbgp.supabase.co',
  'sb_publishable_YRG0iPqa4Hz3yzjhezkW8g_dQwddST2'
);

// Tipovi
interface MenuItem {
  id: number;
  ime: string;
  sastojci: string;
  cijena: number;
  slika_url: string;
  kategorija: string;
}

const categories = ['Sve', 'Salate', 'Burgeri', 'Beef Burgeri','Tortilja/Kebab', 'Roštilj','Piletina', 'Prilozi', 'Desert', 'Specijaliteti'];

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | 'Sve'>('Sve');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loginModal, setLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState(''); // Za login formu

  // Učitaj podatke iz Supabase baze
  useEffect(() => {
  // Provjeri je li korisnik prijavljen
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setIsAdmin(!!session);
  });

  // Slušaj promjene auth statusa
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    setIsAdmin(!!session);
  });

  fetchMenuItems();

  return () => subscription.unsubscribe();
}, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('jela')
        .select('*')
        .order('pozicija', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error('Greška pri dohvacanju:', err);
      setError('Ne mogu se spojiti na bazu. Provjerite konekciju.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem = {
      ime: formData.get('name') as string,
      sastojci: formData.get('description') as string,
      cijena: parseFloat(formData.get('price') as string),
      slika_url: formData.get('image') as string || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      kategorija: formData.get('category') as string,
    };

    try {
      if (editingItem) {
        // Uredi postojeće
        const { error } = await supabase
          .from('jela')
          .update(newItem)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Dodaj novo
        const { error } = await supabase
          .from('jela')
          .insert([newItem]);

        if (error) throw error;
      }

      await fetchMenuItems();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      alert('Greška pri spremanju: ' + err.message);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovo jelo?')) return;
    
    try {
      const { error } = await supabase
        .from('jela')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMenuItems();
    } catch (err: any) {
      alert('Greška pri brisanju: ' + err.message);
    }
  };

  const filteredItems = activeCategory === 'Sve' 
    ? items 
    : items.filter(i => i.kategorija === activeCategory);

  const handleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    
    setLoginModal(false);
    setPassword('');
    setEmail('');
  } catch (error: any) {
    alert('Pogrešni podaci: ' + error.message);
  }
  };

  const handleLogout = async () => {
  await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 size={48} className="text-[#c4a484] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e5d3b3] font-serif selection:bg-[#c4a484] selection:text-[#1a1a1a]" style={{ zoom: '0.85' }}>
      {error && (
        <div className="bg-red-900 text-white p-4 text-center">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b-4 border-[#c4a484]">
        <img 
          src="https://images.unsplash.com/photo-1474487585847-9d8acc3021f8?auto=format&fit=crop&q=80&w=2000"
          alt="Train station background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center px-4"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Bar & Grill Strizivojna Logo"
              className="h-32 md:h-40 object-contain drop-shadow-[0_0_15px_rgba(196,164,132,0.5)] bg-white/10 rounded-lg p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 uppercase italic">grill bar kolodvor</h1>
          <div className="h-1 w-48 bg-[#c4a484] mx-auto mb-4" />
          <p className="text-xl md:text-2xl text-[#c4a484] italic tracking-widest">grill bar kolodvor Strizivojna</p>
        </motion.div>

        {!isAdmin ? (
          <button 
            onClick={() => setLoginModal(true)}
            className="absolute top-6 right-6 p-2 rounded-full border border-[#c4a484] hover:bg-[#c4a484] hover:text-[#1a1a1a] transition-all"
          >
            <LogIn size={20} />
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="absolute top-6 right-6 p-2 rounded-full border border-[#c4a484] hover:bg-red-800 hover:border-red-800 transition-all"
          >
            <LogOut size={20} />
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Navigation / Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveCategory('Sve')}
            className={`px-6 py-2 border border-[#c4a484] transition-all uppercase tracking-widest text-sm ${activeCategory === 'Sve' ? 'bg-[#c4a484] text-[#1a1a1a]' : 'hover:bg-[#c4a484]/10'}`}
          >
            Sve
          </button>
          {categories.filter(cat => cat !== 'Sve').map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 border border-[#c4a484] transition-all uppercase tracking-widest text-sm ${activeCategory === cat ? 'bg-[#c4a484] text-[#1a1a1a]' : 'hover:bg-[#c4a484]/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Admin - Dodaj novo jelo */}
        {isAdmin && (
          <div className="mb-12 flex justify-center">
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-8 py-3 bg-[#c4a484] text-[#1a1a1a] font-bold rounded-sm hover:scale-105 transition-transform"
            >
              <Plus size={20} /> DODAJ NOVO JELO
            </button>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group relative bg-[#2a2a2a] border border-[#c4a484]/30 overflow-hidden shadow-2xl"
              >
                <div className="aspect-video overflow-hidden bg-[#1a1a1a]">
                  <img 
                    src={item.slika_url} 
                    alt={item.ime}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold italic text-[#c4a484] leading-tight">{item.ime}</h3>
                    <span className="text-xl font-mono text-[#c4a484] border-b border-[#c4a484]">
                      {item.cijena.toFixed(2)}€
                    </span>
                  </div>
                  <p className="text-[#a89c84] mb-6 italic leading-relaxed">{item.sastojci}</p>
                  
                  <div className="flex items-center gap-2 text-xs uppercase tracking-tighter opacity-50">
                    <UtensilsCrossed size={12} />
                    {item.kategorija}
                  </div>
                </div>

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="p-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 border-8 border-transparent group-hover:border-[#c4a484]/10 pointer-events-none transition-all duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-[#a89c84]">
            <p className="text-xl">Nema jela u ovoj kategoriji.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] py-12 border-t-4 border-[#c4a484] mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img 
            src="/logo.png" 
            alt="Logo"
            className="h-16 mx-auto mb-4 object-contain bg-white/10 rounded-lg p-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <p className="text-[#c4a484] italic mb-2 tracking-widest">GRILL BAR KOLODVOR STRIZIVOJNA</p>
          <p className="text-[#a89c84] text-sm">Kolodvorska 17, Strizivojna• Kontakt: 097 727 8605</p>
          <div className="mt-8 text-[10px] opacity-30 uppercase tracking-[0.5em]">grill bar kolodvor Strizivojna</div>
        </div>
      </footer>

      {/* Admin Modal - Dodaj/Uredi jelo */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2a2a2a] border-2 border-[#c4a484] p-8 w-full max-w-md relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#c4a484]"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-[#c4a484] uppercase tracking-widest">
                {editingItem ? 'Uredi Jelo' : 'Novo Jelo'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase mb-1">Ime Jela</label>
                  <input 
                    name="name" 
                    defaultValue={editingItem?.ime} 
                    required 
                    className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-2 focus:border-[#c4a484] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase mb-1">Opis / Sastojci</label>
                  <textarea 
                    name="description" 
                    defaultValue={editingItem?.sastojci} 
                    required 
                    className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-2 h-24 focus:border-[#c4a484] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase mb-1">Cijena (€)</label>
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      defaultValue={editingItem?.cijena} 
                      required 
                      className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-2 focus:border-[#c4a484] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase mb-1"> Kategorija</label>
                    <select 
                      name="category" 
                      defaultValue={editingItem?.kategorija || 'Glavna jela'}
                      className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-2 h-[42px] focus:border-[#c4a484] outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase mb-1">URL Slike</label>
                  <input 
                    name="image" 
                    defaultValue={editingItem?.slika_url} 
                    className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-2 focus:border-[#c4a484] outline-none"
                    placeholder="https://..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#c4a484] text-[#1a1a1a] font-bold uppercase tracking-widest hover:bg-[#b39373] transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Spremi Izmjene
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {loginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#2a2a2a] border border-[#c4a484] p-8 max-w-sm w-full"
            >
              <h3 className="text-xl mb-6 text-center text-[#c4a484] uppercase tracking-[0.2em]">Administracija</h3>
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-3 mb-3 focus:border-[#c4a484] outline-none text-center"
                autoFocus
               />
              <input 
                type="password"
                placeholder="Lozinka"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#1a1a1a] border border-[#c4a484]/50 p-3 mb-4 focus:border-[#c4a484] outline-none text-center"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setLoginModal(false)}
                  className="flex-1 py-2 border border-[#c4a484] hover:bg-[#c4a484]/10"
                >
                  Odustani
                </button>
                <button 
                  onClick={handleLogin}
                  className="flex-1 py-2 bg-[#c4a484] text-[#1a1a1a] font-bold"
                >
                  Prijava
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
