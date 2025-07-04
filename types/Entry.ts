export interface Entry {
    id: number;
    activity: string;
    description?: string;
    mood: 'zadowolony' | 'niezadowolony';
    effort: 'lekki' | 'średni' | 'ciężki';
    type: string;
    duration: string; // jeśli chcesz jako liczba, zmień na `number`
    steps: string;    // jeśli chcesz jako liczba, zmień na `number`
    date: string;
}
