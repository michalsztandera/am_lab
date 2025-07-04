import {
    View,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../../../../components/Header';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entry } from '../../../../types/Entry';
import { useEntriesStore } from '../../../../store/useEntriesStore';
import { entryApi } from '../../../../services/entryApi';

export default function EditEntryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const entryId = parseInt(id || '', 10);

    const [entry, setEntry] = useState<Entry | null>(null);
    const { updateEntry, fetchEntries } = useEntriesStore();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await entryApi.getOne(entryId);
                if (!data) throw new Error();
                setEntry(data);
            } catch {
                Alert.alert('Błąd ładowania wpisu');
                router.back();
            }
        };
        load();
    }, [entryId]);

    const formatDateForMySQL = (isoString: string) => {
        const d = new Date(isoString);
        return d.toISOString().slice(0, 19).replace('T', ' ');
    };

    const handleSave = async () => {
        if (!entry?.activity || !entry.mood || !entry.effort || !entry.type || !entry.date) {
            Alert.alert('Uzupełnij wszystkie wymagane pola!');
            return;
        }

        try {
            await updateEntry(entryId, {
                ...entry,
                date: formatDateForMySQL(entry.date),
            });
            Alert.alert('Zaktualizowano wpis');
            router.back();
        } catch {
            Alert.alert('Błąd zapisu');
        }
    };

    if (!entry) return null;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Header title="Edytuj aktywność" />

                    <TextInput
                        label="Nazwa aktywności"
                        value={entry.activity}
                        onChangeText={(text) => setEntry({ ...entry, activity: text })}
                        style={styles.input}
                        mode="outlined"
                    />

                    <TextInput
                        label="Opis (opcjonalnie)"
                        value={entry.description}
                        onChangeText={(text) => setEntry({ ...entry, description: text })}
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                        mode="outlined"
                    />

                    <TextInput
                        label="Typ aktywności"
                        value={entry.type}
                        onChangeText={(text) => setEntry({ ...entry, type: text })}
                        style={styles.input}
                        mode="outlined"
                    />

                    <TextInput
                        label="Czas trwania (w minutach)"
                        value={entry.duration?.toString() ?? ''}
                        onChangeText={(text) => setEntry({ ...entry, duration: text })}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                    />

                    <TextInput
                        label="Liczba kroków"
                        value={entry.steps?.toString() ?? ''}
                        onChangeText={(text) => setEntry({ ...entry, steps: text })}
                        keyboardType="numeric"
                        style={styles.input}
                        mode="outlined"
                    />


                    <TextInput
                        label="Data"
                        value={entry.date}
                        onChangeText={(text) => setEntry({ ...entry, date: text })}
                        placeholder="YYYY-MM-DD HH:MM:SS"
                        style={styles.input}
                        mode="outlined"
                    />

                    <View style={styles.section}>
                        <TextInput label="Samopoczucie" disabled style={styles.label} />
                        <View style={styles.row}>
                            <Button mode={entry.mood === 'zadowolony' ? 'contained' : 'outlined'} onPress={() => setEntry({ ...entry, mood: 'zadowolony' })} style={styles.button}>😀 Zadowolony</Button>
                            <Button mode={entry.mood === 'niezadowolony' ? 'contained' : 'outlined'} onPress={() => setEntry({ ...entry, mood: 'niezadowolony' })} style={styles.button}>😐 Niezadowolony</Button>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <TextInput label="Wysiłek" disabled style={styles.label} />
                        <View style={styles.row}>
                            <Button mode={entry.effort === 'lekki' ? 'contained' : 'outlined'} onPress={() => setEntry({ ...entry, effort: 'lekki' })} style={styles.button}>🧘 Lekki</Button>
                            <Button mode={entry.effort === 'średni' ? 'contained' : 'outlined'} onPress={() => setEntry({ ...entry, effort: 'średni' })} style={styles.button}>🚶 Średni</Button>
                            <Button mode={entry.effort === 'ciężki' ? 'contained' : 'outlined'} onPress={() => setEntry({ ...entry, effort: 'ciężki' })} style={styles.button}>🏋️ Ciężki</Button>
                        </View>
                    </View>

                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                        Zapisz zmiany
                    </Button>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
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
    saveButton: {
        marginTop: 12,
        paddingVertical: 6,
    },
});

export const options = {
    drawerItemStyle: { display: 'none' },
    drawerLabel: () => null,
};
