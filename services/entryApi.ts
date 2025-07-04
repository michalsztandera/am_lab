import { Entry } from '../types/Entry';

const API_URL = 'https://api.mskk.pl/am_lab/entries.php';

export const entryApi = {
    async getAll(): Promise<Entry[]> {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Błąd pobierania danych');
        return await res.json();
    },

    async getOne(id: number): Promise<Entry | null> {
        const res = await fetch(`${API_URL}?id=${id}`);
        if (!res.ok) throw new Error('Nie znaleziono wpisu');
        return await res.json();
    },

    async add(entry: Omit<Entry, 'id'>): Promise<void> {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error('Błąd dodawania wpisu');
    },

    async update(id: number, entry: Omit<Entry, 'id'>): Promise<void> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
        if (!res.ok) throw new Error('Błąd aktualizacji wpisu');
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Błąd usuwania wpisu');
    },
};
