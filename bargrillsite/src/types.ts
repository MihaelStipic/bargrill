export interface MenuItem {
  id: number;
  ime: string;
  sastojci: string;
  cijena: number;
  slika_url: string;
  kategorija: string;
  created_at?: string;
}

export type Category = 'Predjela' | 'Glavna jela' | 'Desert' | 'Pića' | 'Specijaliteti';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 1,
    ime: 'Goveđi Odrezak Orient',
    sastojci: 'Vrhunski komad govedine sa začinskim biljem i pečenim povrćem.',
    cijena: 24.50,
    slika_url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=800',
    kategorija: 'Glavna jela'
  },
  {
    id: 2,
    ime: 'Željeznički Gulaš',
    sastojci: 'Tradicionalni mađarski gulaš kuhan polako na vatri.',
    cijena: 12.00,
    slika_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    kategorija: 'Glavna jela'
  },
  {
    id: 3,
    ime: 'Kraljevska Juha',
    sastojci: 'Bistra juha s domaćim rezancima i korjenastim povrćem.',
    cijena: 4.50,
    slika_url: 'https://images.unsplash.com/photo-1547592116-45579997f748?auto=format&fit=crop&q=80&w=800',
    kategorija: 'Predjela'
  }
];
