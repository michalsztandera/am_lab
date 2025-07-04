import { View, StyleSheet, Alert, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../../components/Header';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EntryScreen() {
    const [activity, setActivity] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState<'zadowolony' | 'niezadowolony' | ''>('');
    const [effort, setEffort] = useState<'lekki' | 'średni' | 'ciężki' | ''>('');

    const handleSave = async () => {
        if (!activity || !mood || !effort) {
            Alert.alert('Uzupełnij wymagane pola!');
            return;
        }

        const entry = {
            activity,
            mood,
            effort,
            description,
            date: new Date().toISOString(),
        };

        try {
            const existing = await AsyncStorage.getItem('entries');
            const parsed = existing ? JSON.parse(existing) : [];
            parsed.push(entry);
            await AsyncStorage.setItem('entries', JSON.stringify(parsed));
            Alert.alert('Zapisano!');
            setActivity('');
            setMood('');
            setEffort('');
            setDescription('');
        } catch (e) {
            Alert.alert('Błąd zapisu');
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Dodaj aktywność" />

            <TextInput
                label="Nazwa aktywności"
                value={activity}
                onChangeText={setActivity}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Opis (opcjonalnie)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.input}
                mode="outlined"
            />

            <View style={styles.section}>
                <Text style={styles.label}>Samopoczucie</Text>
                <View style={styles.row}>
                    <Button
                        mode={mood === 'zadowolony' ? 'contained' : 'outlined'}
                        onPress={() => setMood('zadowolony')}
                        style={styles.button}
                    >
                        😀 Zadowolony
                    </Button>
                    <Button
                        mode={mood === 'niezadowolony' ? 'contained' : 'outlined'}
                        onPress={() => setMood('niezadowolony')}
                        style={styles.button}
                    >
                        😐 Niezadowolony
                    </Button>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Wysiłek</Text>
                <View style={styles.row}>
                    <Button
                        mode={effort === 'lekki' ? 'contained' : 'outlined'}
                        onPress={() => setEffort('lekki')}
                        style={styles.button}
                    >
                        🧘 Lekki
                    </Button>
                    <Button
                        mode={effort === 'średni' ? 'contained' : 'outlined'}
                        onPress={() => setEffort('średni')}
                        style={styles.button}
                    >
                        🚶 Średni
                    </Button>
                    <Button
                        mode={effort === 'ciężki' ? 'contained' : 'outlined'}
                        onPress={() => setEffort('ciężki')}
                        style={styles.button}
                    >
                        🏋️ Ciężki
                    </Button>
                </View>
            </View>

            <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                💾 Zapisz aktywność
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
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flexGrow: 1,
        marginBottom: 8,
    },
    label: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    saveButton: {
        marginTop: 16,
        paddingVertical: 6,
    },
});
