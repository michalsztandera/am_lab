import { View, Text, StyleSheet, Alert } from 'react-native';
import Header from '../../../../components/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-native-paper';
import { Entry } from '../../../../types/Entry';
import { entryApi } from '../../../../services/entryApi';
import { useEntriesStore } from '../../../../store/useEntriesStore';

export default function ActivityDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { fetchEntries } = useEntriesStore();

    const [entry, setEntry] = useState<Entry | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await entryApi.getOne(Number(id));
                if (!data) throw new Error();
                setEntry(data);
            } catch {
                Alert.alert('Błąd ładowania wpisu');
                router.replace('/(drawer)/activities');
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert('Potwierdzenie', 'Czy na pewno chcesz usunąć ten wpis?', [
            { text: 'Anuluj', style: 'cancel' },
            {
                text: 'Usuń', style: 'destructive', onPress: async () => {
                    try {
                        await entryApi.delete(Number(id));
                        await fetchEntries();
                        router.replace('/(drawer)/activities');
                    } catch {
                        Alert.alert('Błąd podczas usuwania');
                    }
                }
            }
        ]);
    };

    const getMoodEmoji = (mood: string) => {
        if (mood?.includes('zadowolony')) return '😀';
        if (mood?.includes('niezadowolony')) return '😐';
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

    if (!entry) return <View style={styles.container}><Text>Wczytywanie...</Text></View>;

    return (
        <View style={styles.container}>
            <Header title="Szczegóły aktywności" />

            <Card style={styles.card}>
                <Card.Title
                    title={`${entry.activity} ${getEffortEmoji(entry.effort)}`}
                    titleStyle={styles.title}
                />
                <Card.Content>
                    {entry.description ? (
                        <Text style={styles.description}>{entry.description}</Text>
                    ) : null}

                    <View style={styles.section}>
                        <Text style={styles.label}>Samopoczucie:</Text>
                        <Text style={styles.value}>{getMoodEmoji(entry.mood)} {entry.mood}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Wysiłek:</Text>
                        <Text style={styles.value}>{getEffortEmoji(entry.effort)} {entry.effort}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Typ:</Text>
                        <Text style={styles.value}>{entry.type}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Czas trwania:</Text>
                        <Text style={styles.value}>{entry.duration} minut</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Liczba kroków:</Text>
                        <Text style={styles.value}>{entry.steps}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Data:</Text>
                        <Text style={styles.value}>{new Date(entry.date).toLocaleString()}</Text>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.buttons}>
                <Button
                    mode="outlined"
                    onPress={() =>
                        router.push({
                            pathname: '/(drawer)/activity/[id]/edit',
                            params: { id: String(id) },
                        })
                    }
                >
                    ✏️ Edytuj wpis
                </Button>
                <Button
                    mode="contained"
                    buttonColor="#e53935"
                    textColor="#fff"
                    onPress={handleDelete}
                >
                    🗑 Usuń wpis
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    card: {
        marginBottom: 24,
        paddingBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
        color: '#555',
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#777',
    },
    value: {
        fontSize: 16,
        color: '#222',
        marginTop: 2,
    },
    buttons: {
        gap: 12,
    },
});

export const options = {
    drawerItemStyle: { display: 'none' },
    drawerLabel: () => null,
};
