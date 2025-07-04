import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

export default function Dashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Header title="Dashboard" />
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Podsumowanie dnia</Title>
                    <Paragraph>Dzisiaj spaliłeś 500 kcal</Paragraph>
                </Card.Content>
                <Card.Actions style={styles.buttonGroup}>
                    <Button
                        mode="outlined"
                        style={styles.button}
                        onPress={() => router.push('/activities')}
                    >
                        Aktywności
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => router.push('/entry')}
                    >
                        Dodaj wpis
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => router.push('/stats')}
                    >
                        Statystyki
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#fff',
    },
    card: {
        marginTop: 20,
    },
    buttonGroup: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    button: {
        marginVertical: 4,
        flexGrow: 1,
        marginRight: 8,
    },
});
