import { View, Text, StyleSheet, Alert } from 'react-native';
import Header from '../../../../components/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';

export default function ActivityDetails() {
    const { id } = useLocalSearchParams();
    const [entry, setEntry] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const loadEntry = async () => {
            const stored = await AsyncStorage.getItem('entries');
            if (stored) {
                const parsed = JSON.parse(stored);
                setEntry(parsed[Number(id)]);
            }
        };
        loadEntry();
    }, [id]);

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

    const handleDelete = async () => {
        Alert.alert('Potwierdzenie', 'Czy na pewno chcesz usunąć ten wpis?', [
            {
                text: 'Anuluj',
                style: 'cancel',
            },
            {
                text: 'Usuń',
                style: 'destructive',
                onPress: async () => {
                    const stored = await AsyncStorage.getItem('entries');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        parsed.splice(Number(id), 1);
                        await AsyncStorage.setItem('entries', JSON.stringify(parsed));
                        router.replace('/(drawer)/activities');
                    }
                },
            },
        ]);
    };

    if (!entry) return <View style={styles.container}><Text>Wczytywanie...</Text></View>;

    return (
        <View style={styles.container}>
            <Header title="Szczegóły aktywności" />
            <Text style={styles.title}>{entry.activity} {getEffortEmoji(entry.effort)}</Text>
            {entry.description ? <Text style={styles.description}>{entry.description}</Text> : null}
            <Text style={styles.label}>Samopoczucie: {getMoodEmoji(entry.mood)} {entry.mood}</Text>
            <Text style={styles.label}>Wysiłek: {getEffortEmoji(entry.effort)} {entry.effort}</Text>
            <Text style={styles.date}>Data: {new Date(entry.date).toLocaleString()}</Text>

            <View style={{ marginTop: 24, gap: 12 }}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        router.push({
                            pathname: '/(drawer)/activity/[id]/edit',
                            params: { id: String(id) },
                        });
                    }}
                >
                    ✏️ Edytuj wpis
                </Button>
                <Button
                    mode="contained"
                    buttonColor="red"
                    textColor="white"
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        marginBottom: 12,
        color: '#555',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginTop: 12,
    },
});
export const options = {
    drawerItemStyle: { display: 'none' },
    drawerLabel: () => null,
};
