import React from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { Appbar, Text, Chip, Divider, useTheme, IconButton } from 'react-native-paper';
import { deleteEvent } from '../../database'; // Перевірте шлях до БД

const { width } = Dimensions.get('window');

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const theme = useTheme();

  // Функція видалення з підтвердженням
  const handleDelete = () => {
    Alert.alert(
      "Видалити подію?",
      "Ви впевнені, що хочете видалити цей запис із таймлайну?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive", 
          onPress: () => {
            deleteEvent(event.id);
            navigation.navigate('Main'); // Повертаємось на головну
          } 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Шапка з кнопками дій */}
      <Appbar.Header mode="center-aligned" elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Деталі події" titleStyle={styles.headerTitle} />
        <Appbar.Action 
            icon="pencil-outline" 
            onPress={() => navigation.navigate('AddEvent', { editEvent: event })} 
        />
        <Appbar.Action 
          icon="delete-outline" 
          onPress={handleDelete} 
          color={theme.colors.error} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок та метадані */}
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

        {/* Текст нотатки */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
            Нотатка
          </Text>
          <Text variant="bodyLarge" style={styles.noteText}>
            {event.note || "Опис до цієї події відсутній."}
          </Text>
        </View>

        {/* Галерея медіафайлів */}
        {event.media && event.media.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionLabel, { color: theme.colors.primary }]}>
              Медіафайли ({event.media.length})
            </Text>
            <View style={styles.mediaGrid}>
              {event.media.map((uri, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => console.log('Відкрити фото на весь екран:', uri)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri }} style={styles.mediaImage} />
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
  mediaImage: { 
    width: (width - 52) / 2, // Розрахунок ширини для 2 колонок з відступами
    height: 180, 
    borderRadius: 16,
    backgroundColor: '#f0f0f0' 
  }
});

export default EventDetailScreen;