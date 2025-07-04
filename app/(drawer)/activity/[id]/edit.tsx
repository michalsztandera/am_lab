import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../../../../components/Header';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditEntryScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [activity, setActivity] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState<'zadowolony' | 'niezadowolony' | ''>('');
    const [effort, setEffort] = useState<'lekki' | 'średni' | 'ciężki' | ''>('');

    useEffect(() => {
        const loadEntry = async () => {
            const stored = await AsyncStorage.getItem('entries');
            if (stored) {
                const parsed = JSON.parse(stored);
                const entry = parsed[Number(id)];
                if (entry) {
                    setActivity(entry.activity);
                    setDescription(entry.description || '');
                    setMood(entry.mood);
                    setEffort(entry.effort);
                }
            }
        };
        loadEntry();
    }, [id]);

    const handleSave = async () => {
        if (!activity || !mood || !effort) {
            Alert.alert('Uzupełnij wymagane pola!');
            return;
        }

        try {
            const stored = await AsyncStorage.getItem('entries');
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed[Number(id)] = {
                    ...parsed[Number(id)],
                    activity,
                    description,
                    mood,
                    effort,
                };
                await AsyncStorage.setItem('entries', JSON.stringify(parsed));
                Alert.alert('Zaktualizowano wpis');
                router.back(); // wraca do szczegółów
            }
        } catch (e) {
            Alert.alert('Błąd zapisu');
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Edytuj aktywność" />

            <TextInput
                label="Nazwa aktywności"
                value={activity}
                onChangeText={setActivity}
                style={styles.input}
            />

            <TextInput
                label="Opis (opcjonalnie)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.input}
            />

            <View style={styles.section}>
                <TextInput label="Samopoczucie" disabled style={styles.label} />
                <View style={styles.row}>
                    <Button mode={mood === 'zadowolony' ? 'contained' : 'outlined'} onPress={() => setMood('zadowolony')} style={styles.button}>😀 Zadowolony</Button>
                    <Button mode={mood === 'niezadowolony' ? 'contained' : 'outlined'} onPress={() => setMood('niezadowolony')} style={styles.button}>😐 Niezadowolony</Button>
                </View>
            </View>

            <View style={styles.section}>
                <TextInput label="Wysiłek" disabled style={styles.label} />
                <View style={styles.row}>
                    <Button mode={effort === 'lekki' ? 'contained' : 'outlined'} onPress={() => setEffort('lekki')} style={styles.button}>🧘 Lekki</Button>
                    <Button mode={effort === 'średni' ? 'contained' : 'outlined'} onPress={() => setEffort('średni')} style={styles.button}>🚶 Średni</Button>
                    <Button mode={effort === 'ciężki' ? 'contained' : 'outlined'} onPress={() => setEffort('ciężki')} style={styles.button}>🏋️ Ciężki</Button>
                </View>
            </View>

            <Button mode="contained" onPress={handleSave}>
                Zapisz zmiany
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    button: {
        flexGrow: 1,
        marginBottom: 8,
    },
    label: {
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
});
export const options = {
    drawerItemStyle: { display: 'none' },
    drawerLabel: () => null,
};
