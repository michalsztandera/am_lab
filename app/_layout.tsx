import { Drawer } from 'expo-router/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomDrawer from '../components/CustomDrawer';

export default function Layout() {
    return (
        <PaperProvider>
            <Drawer
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerActiveTintColor: '#4CAF50',
                    drawerInactiveTintColor: '#666',
                    drawerStyle: {
                        backgroundColor: '#f7f9fc',
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                    },
                    drawerLabelStyle: {
                        fontSize: 16,
                        marginLeft: -10,
                    },
                    drawerItemStyle: {
                        borderRadius: 12,
                        marginVertical: 4,
                    },
                }}
            >
                <Drawer.Screen
                    name="(drawer)/index"
                    options={{
                        title: 'Dashboard',
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="view-dashboard" size={26} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="(drawer)/activities"
                    options={{
                        title: 'Aktywności',
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="run-fast" size={26} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="(drawer)/entry"
                    options={{
                        title: 'Dodaj wpis',
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="plus-circle-outline" size={26} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="(drawer)/stats"
                    options={{
                        title: 'Statystyki',
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="chart-bar" size={26} color={color} />
                        ),
                    }}
                />

                {/* ❌ Ukryte ekrany szczegółów i edycji aktywności */}
                <Drawer.Screen
                    name="(drawer)/activity/[id]/index"
                    options={{
                        drawerItemStyle: { display: 'none' },
                        drawerLabel: () => null,
                    }}
                />
                <Drawer.Screen
                    name="(drawer)/activity/[id]/edit"
                    options={{
                        drawerItemStyle: { display: 'none' },
                        drawerLabel: () => null,
                    }}
                />
            </Drawer>
        </PaperProvider>
    );
}
