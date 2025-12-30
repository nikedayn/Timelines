import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { 
  TextInput, 
  Button, 
  IconButton, 
  Text, 
  Chip, 
  useTheme, 
  Appbar, 
  Icon, 
  Portal, 
  Dialog 
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
// Імпорт нового DatePicker та локалізації
import { DatePickerModal, registerTranslation, uk } from 'react-native-paper-dates';
import { addEvent, updateEvent } from '../../database';
import { TAGS_LIST } from '../constants/tags';

// Реєстрація української мови для календаря
registerTranslation('uk', uk);

const AddEventScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const editEvent = route.params?.editEvent;

    // Стан форми
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [selectedTag, setSelectedTag] = useState(TAGS_LIST[0]);
    const [media, setMedia] = useState([]);

    // Стан для DatePicker та Діалогів
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({ title: '', message: '', type: '' });

    useEffect(() => {
        if (editEvent) {
            setTitle(editEvent.title);
            setNote(editEvent.note || '');
            setDate(new Date(editEvent.date));
            setSelectedTag(editEvent.tag);
            setMedia(editEvent.media || []);
        }
    }, [editEvent]);

    // Обробники для нового DatePicker
    const onDismissDate = useCallback(() => {
        setShowDatePicker(false);
    }, []);

    const onConfirmDate = useCallback((params) => {
        setShowDatePicker(false);
        if (params.date) {
            setDate(params.date);
        }
    }, []);

    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            setMedia([...media, ...result.assets.map(a => a.uri)]);
        }
    };

    const showDialog = (title, message, type = '') => {
        setDialogConfig({ title, message, type });
        setVisible(true);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            showDialog("Помилка", "Будь ласка, введіть назву події");
            return;
        }
        try {
            if (editEvent) {
                await updateEvent(editEvent.id, title, note, date, selectedTag, media);
                showDialog("Успіх", "Подію оновлено", 'navigateMain');
            } else {
                await addEvent(title, note, date, selectedTag, media);
                navigation.goBack();
            }
        } catch (e) {
            showDialog("Помилка", "Не вдалося зберегти дані");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editEvent ? "Редагувати подію" : "Нова подія"} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TextInput
                    label="Назва"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                />

                {/* Кнопка виклику сучасного календаря */}
                <TouchableOpacity 
                    style={[styles.dateBox, { borderColor: theme.colors.outlineVariant }]} 
                    onPress={() => setShowDatePicker(true)}
                >
                    <IconButton icon="calendar-month" iconColor={theme.colors.primary} />
                    <View>
                        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>Дата</Text>
                        <Text variant="bodyLarge">{date.toLocaleDateString('uk-UA')}</Text>
                    </View>
                </TouchableOpacity>

                {/* Модальне вікно Material You DatePicker */}
                <DatePickerModal
                    locale="uk"
                    mode="single"
                    visible={showDatePicker}
                    onDismiss={onDismissDate}
                    date={date}
                    onConfirm={onConfirmDate}
                    label="Виберіть дату"
                />

                <Text variant="titleSmall" style={styles.sectionTitle}>Тег</Text>
                <View style={styles.tagsRow}>
                    {TAGS_LIST.map(t => (
                        <Chip 
                            key={t} 
                            selected={selectedTag === t} 
                            onPress={() => setSelectedTag(t)} 
                            style={styles.chip}
                            showSelectedCheck={true}
                        >
                            {t}
                        </Chip>
                    ))}
                </View>

                <TextInput
                    label="Нотатка"
                    value={note}
                    onChangeText={setNote}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                />

                <Text variant="titleSmall" style={styles.sectionTitle}>Медіафайли</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
                    <TouchableOpacity 
                        style={[styles.addMedia, { borderColor: theme.colors.outline, borderStyle: 'dashed' }]} 
                        onPress={pickMedia}
                    >
                        <Icon source="plus" size={30} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {media.map((uri, idx) => (
                        <View key={idx} style={styles.mediaWrapper}>
                            <Image source={{ uri }} style={styles.img} />
                            <IconButton 
                                icon="close-circle" 
                                iconColor={theme.colors.error}
                                size={24} 
                                style={styles.delBtn} 
                                onPress={() => setMedia(media.filter((_, i) => i !== idx))} 
                            />
                        </View>
                    ))}
                </ScrollView>

                <Button 
                    mode="contained" 
                    onPress={handleSave} 
                    style={styles.saveBtn} 
                    contentStyle={{ height: 50 }}
                >
                    {editEvent ? "Оновити" : "Зберегти"}
                </Button>
            </ScrollView>

            {/* Діалог підтвердження */}
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ borderRadius: 28 }}>
                    <Dialog.Title>{dialogConfig.title}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{dialogConfig.message}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button 
                            onPress={() => {
                                setVisible(false);
                                if (dialogConfig.type === 'navigateMain') navigation.navigate('Main');
                            }}
                        >
                            ОК
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  input: { marginBottom: 16 },
  dateBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderWidth: 1, 
    borderRadius: 12, // Більш закруглені кути в стилі MD3
    marginBottom: 16 
  },
  sectionTitle: { marginBottom: 8, marginTop: 8, fontWeight: 'bold' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  mediaRow: { flexDirection: 'row', marginBottom: 20 },
  addMedia: { 
    width: 80, 
    height: 80, 
    borderWidth: 1, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  mediaWrapper: { marginRight: 10, position: 'relative' },
  img: { width: 80, height: 80, borderRadius: 12 },
  delBtn: { position: 'absolute', top: -15, right: -15, backgroundColor: 'white', elevation: 2 },
  saveBtn: { marginTop: 20, borderRadius: 100 },
  chip: { height: 32 }
});

export default AddEventScreen;