import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, IconButton, Text, Chip, useTheme, Appbar, Icon } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEvent, updateEvent } from '../../database'; // Імпортуємо обидві функції

const TAGS_LIST = ['Особисте', 'Робота', 'Навчання', 'Подорожі', 'Спорт'];

const AddEventScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const editEvent = route.params?.editEvent; // Перевіряємо, чи ми в режимі редагування

    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selectedTag, setSelectedTag] = useState(TAGS_LIST[0]);
    const [media, setMedia] = useState([]);

    // Якщо ми редагуємо, заповнюємо поля даними при завантаженні
    useEffect(() => {
        if (editEvent) {
        setTitle(editEvent.title);
        setNote(editEvent.note || '');
        setDate(new Date(editEvent.date));
        setSelectedTag(editEvent.tag);
        setMedia(editEvent.media || []);
        }
    }, [editEvent]);

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

    const handleSave = () => {
        if (!title.trim()) {
        Alert.alert("Помилка", "Будь ласка, введіть назву події");
        return;
        }

        try {
        if (editEvent) {
            // Оновлення існуючої події
            updateEvent(editEvent.id, title, note, date, selectedTag, media);
            Alert.alert("Успіх", "Подію оновлено", [
            { text: "OK", onPress: () => navigation.navigate('Main') }
            ]);
        } else {
            // Створення нової події
            addEvent(title, note, date, selectedTag, media);
            navigation.goBack();
        }
        } catch (e) {
        Alert.alert("Помилка", "Не вдалося зберегти дані");
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

            <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker(true)}>
            <IconButton icon="calendar" />
            <View>
                <Text variant="labelSmall">Дата</Text>
                <Text variant="bodyLarge">{date.toLocaleDateString('uk-UA')}</Text>
            </View>
            </TouchableOpacity>

            {showPicker && (
            <DateTimePicker
                value={date}
                mode="date"
                onChange={(e, d) => { setShowPicker(false); if(d) setDate(d); }}
            />
            )}

            <Text variant="titleSmall" style={styles.sectionTitle}>Тег</Text>
            <View style={styles.tagsRow}>
            {TAGS_LIST.map(t => (
                <Chip 
                    key={t} 
                    selected={selectedTag === t} 
                    onPress={() => setSelectedTag(t)} 
                    style={styles.chip}
                    showSelectedCheck={false}
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
            <TouchableOpacity style={[styles.addMedia, {borderColor: theme.colors.outline}]} onPress={pickMedia}>
                <Icon source="plus" size={30} color={theme.colors.primary} />
            </TouchableOpacity>
            {media.map((uri, idx) => (
                <View key={idx} style={styles.mediaWrapper}>
                <Image source={{ uri }} style={styles.img} />
                <IconButton 
                    icon="close-circle" 
                    size={20} 
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
            {editEvent ? "Оновити у Timelines" : "Зберегти у Timelines"}
            </Button>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  input: { marginBottom: 16 },
  dateBox: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', marginBottom: 16 },
  sectionTitle: { marginBottom: 8, marginTop: 8, fontWeight: 'bold' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  mediaRow: { flexDirection: 'row', marginBottom: 20 },
  addMedia: { width: 80, height: 80, borderStyle: 'dashed', borderWidth: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  mediaWrapper: { marginRight: 10 },
  img: { width: 80, height: 80, borderRadius: 12 },
  delBtn: { position: 'absolute', top: -10, right: -10 },
  saveBtn: { marginTop: 20, borderRadius: 12 },
  chip: { height: 32 }
});

export default AddEventScreen;