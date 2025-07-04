import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Header from '../../components/Header';

export default function StatsScreen() {
    const data = {
        labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
        datasets: [
            {
                data: [3, 4.5, 2, 5, 3.5, 6, 4],
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <Header title="Statystyki" />
            <LineChart
                data={data}
                width={Dimensions.get('window').width - 32}
                height={220}
                yAxisSuffix=" h"
                chartConfig={{
                    backgroundColor: '#4CAF50',
                    backgroundGradientFrom: '#81C784',
                    backgroundGradientTo: '#4CAF50',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: () => '#fff',
                    strokeWidth: 2,
                }}
                style={styles.chart}
                bezier
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    chart: {
        marginVertical: 16,
        borderRadius: 16,
    },
});
