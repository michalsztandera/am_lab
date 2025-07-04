// Dodano: usuwanie i edycja aktywności
// UWAGA: dodaj nowy plik: app/(drawer)/activity/[id]/edit.tsx

import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import Header from '../../components/Header';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Button, Menu, Divider, IconButton } from 'react-native-paper';

export default function ActivitiesScreen() {
    const [entries, setEntries] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [sortDesc, setSortDesc] = useState(true);
    const [filterMood, setFilterMood] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const fetchEntries = async () => {
                const stored = await AsyncStorage.getItem('entries');
                if (stored) {
                    const data = JSON.parse(stored);
                    setEntries(data);
                    applyFilter(data, filterMood, sortDesc);
                } else {
                    setEntries([]);
                    setFiltered([]);
                }
            };
            fetchEntries();
        }, [sortDesc, filterMood])
    );

    const applyFilter = (list: any[], mood: string, desc: boolean) => {
        let result = [...list];
        if (mood) {
            result = result.filter((entry) =>
                entry.mood.toLowerCase().includes(mood.toLowerCase())
            );
        }
        result.sort((a, b) =>
            desc
                ? new Date(b.date).getTime() - new Date(a.date).getTime()
                : new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setFiltered(result);
    };

    const getMoodEmoji = (mood: string) => {
        if (mood.includes('zadowolony')) return '😀';
        if (mood.includes('niezadowolony')) return '😐';
        return '😶';
    };

    const getEffortEmoji = (effort: string) => {
        switch (effort) {
            case 'lekki': return '🧘';
            case 'średni': return '🚶';
            case 'ciężki': return '🏋️';
            default: return '❔';
        }
    };

    const handleDelete = async (index: number) => {
        Alert.alert('Usuń wpis', 'Czy na pewno chcesz usunąć ten wpis?', [
            { text: 'Anuluj', style: 'cancel' },
            {
                text: 'Usuń', style: 'destructive', onPress: async () => {
                    const updated = [...entries];
                    updated.splice(index, 1);
                    await AsyncStorage.setItem('entries', JSON.stringify(updated));
                    setEntries(updated);
                    applyFilter(updated, filterMood, sortDesc);
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <Header title="Aktywności" />

            <View style={styles.controls}>
                <Button
                    mode="outlined"
                    onPress={() => setSortDesc((prev) => !prev)}
                    style={styles.controlButton}
                >
                    Sortuj: {sortDesc ? 'Najnowsze' : 'Najstarsze'}
                </Button>

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                            Filtrowanie
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setFilterMood(''); setMenuVisible(false); }} title="Wszystkie" />
                    <Divider />
                    <Menu.Item onPress={() => { setFilterMood('zadowolony'); setMenuVisible(false); }} title="Zadowolony" />
                    <Menu.Item onPress={() => { setFilterMood('niezadowolony'); setMenuVisible(false); }} title="Niezadowolony" />
                </Menu>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => router.push(`/(drawer)/activity/${index}` as any)}>
                        <View style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.activity}>{item.activity} {getEffortEmoji(item.effort)}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <IconButton icon="pencil" size={18} onPress={() => router.push(`/(drawer)/activity/${index}/edit` as any)} />
                                    <IconButton icon="delete" size={18} onPress={() => handleDelete(index)} />
                                </View>
                            </View>
                            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                            <Text style={styles.mood}>{getMoodEmoji(item.mood)} {item.mood}</Text>
                            <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Brak zapisanych aktywności</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    controls: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    controlButton: {
        flex: 1,
        marginRight: 8,
    },
    item: {
        marginBottom: 12,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activity: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 15,
        color: '#444',
        marginBottom: 4,
    },
    mood: {
        fontSize: 15,
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    empty: {
        textAlign: 'center',
        fontSize: 16,
        color: '#aaa',
        marginTop: 40,
    },
});