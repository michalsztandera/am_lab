import { create, StateCreator } from 'zustand';
import { Entry } from '../types/Entry';
import { entryApi } from '../services/entryApi';

interface EntriesState {
    entries: Entry[];
    fetchEntries: () => Promise<void>;
    addEntry: (entry: Omit<Entry, 'id'>) => Promise<void>;
    updateEntry: (id: number, entry: Omit<Entry, 'id'>) => Promise<void>;
    deleteEntry: (id: number) => Promise<void>;
}

const creator: StateCreator<EntriesState> = (set) => ({
    entries: [],

    fetchEntries: async () => {
        try {
            const data = await entryApi.getAll();
            set({ entries: data });
        } catch (e) {
            console.error('Błąd pobierania wpisów:', e);
        }
    },

    addEntry: async (entry) => {
        try {
            await entryApi.add(entry);
            const updated = await entryApi.getAll();
            set({ entries: updated });
        } catch (e) {
            console.error('Błąd dodawania wpisu:', e);
        }
    },

    updateEntry: async (id, entry) => {
        try {
            await entryApi.update(id, entry);
            const updated = await entryApi.getAll();
            set({ entries: updated });
        } catch (e) {
            console.error('Błąd aktualizacji wpisu:', e);
        }
    },

    deleteEntry: async (id) => {
        try {
            await entryApi.delete(id);
            const updated = await entryApi.getAll();
            set({ entries: updated });
        } catch (e) {
            console.error('Błąd usuwania wpisu:', e);
        }
    },
});

export const useEntriesStore = create(creator);
