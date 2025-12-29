import React, { useState } from 'react'; // Додано useState
import { View, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
// ДОДАНО Portal, Dialog та Button у список імпортів
import { Appbar, Text, Chip, Divider, useTheme, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { deleteEvent } from '../../database';

const { width } = Dimensions.get('window');

const EventDetailScreen = ({ route, navigation }) => {
    const { event } = route.params;
    const theme = useTheme();

    // Стан для керування видимістю діалогу
    const [visible, setVisible] = useState(false);

    const confirmDelete = () => {
        deleteEvent(event.id);
        setVisible(false);
        navigation.navigate('Main');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            {/* Шапка */}
            <Appbar.Header mode="center-aligned" elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Деталі події" titleStyle={styles.headerTitle} />
                <Appbar.Action 
                    icon="pencil-outline" 
                    onPress={() => navigation.navigate('AddEvent', { editEvent: event })} 
                />
                <Appbar.Action 
                    icon="delete-outline" 
                    onPress={() => setVisible(true)} // ВИПРАВЛЕНО: тепер відкриває діалог
                    color={theme.colors.error} 
                />
            </Appbar.Header>

            {/* ДІАЛОГ MATERIAL YOU */}
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ borderRadius: 28 }}>
                    <Dialog.Icon icon="delete-outline" color={theme.colors.error} />
                    <Dialog.Title style={{ textAlign: 'center' }}>Видалити подію?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                            Ви впевнені, що хочете видалити цей запис? Цю дію неможливо буде скасувати.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Скасувати</Button>
                        <Button 
                            textColor={theme.colors.error} 
                            onPress={confirmDelete}
                            mode="text"
                        >
                            Видалити
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text variant="headlineMedium" style={styles.title}>{event.title}</Text>
                
                <View style={styles.metaRow}>
                    <Chip icon="calendar" style={styles.chip} mode="outlined">
                        {new Date(event.date).toLocaleDateString('uk-UA')}
                    </Chip>
                    <Chip icon="tag" style={styles.chip} mode="flat">
                        {event.tag}
                    </Chip>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                    <Text variant="titleMedium" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                        Нотатка
                    </Text>
                    <Text variant="bodyLarge" style={styles.noteText}>
                        {event.note || "Опис до цієї події відсутній."}
                    </Text>
                </View>

                {event.media && event.media.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="titleMedium" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
                            Медіафайли ({event.media.length})
                        </Text>
                        <View style={styles.mediaGrid}>
                            {event.media.map((uri, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress={() => navigation.navigate('MediaViewer', { uri })}
                                    activeOpacity={0.8}
                                    style={styles.mediaWrapper}
                                >
                                    <Image source={{ uri }} style={styles.mediaImage} />
                                    {(uri.endsWith('.mp4') || uri.endsWith('.mov')) && (
                                        <View style={styles.playOverlay}>
                                            <IconButton icon="play-circle" iconColor="white" size={40} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    title: { fontWeight: 'bold', marginBottom: 16, lineHeight: 34 },
    metaRow: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
    chip: { borderRadius: 12 },
    divider: { marginBottom: 24, opacity: 0.5 },
    section: { marginBottom: 30 },
    sectionLabel: { marginBottom: 8, fontWeight: 'bold', letterSpacing: 0.5 },
    noteText: { lineHeight: 26, opacity: 0.8 },
    mediaGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 12, 
        marginTop: 8 
    },
    mediaWrapper: { position: 'relative' }, // Потрібно для накладання іконки Play
    mediaImage: { 
        width: (width - 52) / 2, 
        height: 180, 
        borderRadius: 16,
        backgroundColor: '#f0f0f0' 
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)', // Легке затемнення для відео
        borderRadius: 16,
    }
});

export default EventDetailScreen;