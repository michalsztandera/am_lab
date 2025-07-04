import { Appbar } from 'react-native-paper';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function Header({ title }: { title: string }) {
    const navigation = useNavigation();
    const canGoBack = navigation.canGoBack?.() ?? false;

    return (
        <Appbar.Header>
            {canGoBack ? (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
            ) : (
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                />
            )}
            <Appbar.Content title={title} />
        </Appbar.Header>
    );
}