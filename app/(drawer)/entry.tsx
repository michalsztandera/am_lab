import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../../components/Header';
import { useState } from 'react';
import { useEntriesStore } from '../../store/useEntriesStore';

export default function EntryScreen() {
    const [activity, setActivity] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState<'zadowolony' | 'niezadowolony' | ''>('');
    const [effort, setEffort] = useState<'lekki' | 'średni' | 'ciężki' | ''>('');
    const [type, setType] = useState('');
    const [duration, setDuration] = useState('');
    const [steps, setSteps] = useState('');

    const { addEntry } = useEntriesStore();

    const handleSave = async () => {
        if (!activity || !mood || !effort || !type || !duration || !steps) {
            Alert.alert('Uzupełnij wszystkie wymagane pola!');
            return;
        }

        const entry = {
            activity,
            description,
            mood,
            effort,
            type,
            duration,
            steps,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        try {
            await addEntry(entry as any);
            Alert.alert('Zapisano!');
            setActivity('');
            setDescription('');
            setMood('');
            setEffort('');
            setType('');
            setDuration('');
            setSteps('');
        } catch (e) {
            Alert.alert('Błąd zapisu');
            console.error(e);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
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

                    <TextInput
                        label="Typ aktywności"
                        value={type}
                        onChangeText={setType}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Czas trwania (minuty)"
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Liczba kroków"
                        value={steps}
                        onChangeText={setSteps}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                    />

                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                        💾 Zapisz aktywność
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
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
        marginTop: 20,
        paddingVertical: 8,
    },
});
