// src/screens/MainScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Searchbar, Chip, FAB, useTheme, Text } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getEvents } from '../../database'; 
import { TAGS_LIST, DEFAULT_TAG } from '../constants/tags';
import TimelineItem from '../components/TimelineItem';

const MainScreen = ({ navigation }) => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(DEFAULT_TAG);

  const loadData = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  const filteredData = useMemo(() => {
    return events.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === DEFAULT_TAG || item.tag === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [events, searchQuery, selectedTag]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Timelines" />
      </Appbar.Header>

      <Searchbar
        placeholder="Пошук..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.tagsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
          {[DEFAULT_TAG, ...TAGS_LIST].map(tag => (
            <Chip
              key={tag}
              selected={selectedTag === tag}
              onPress={() => setSelectedTag(tag)}
              showSelectedCheck={true} // Додано галочку для вибраного тегу
              style={{ backgroundColor: selectedTag === tag ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <TimelineItem 
            item={item} 
            isFirst={index === 0}
            isLast={index === filteredData.length - 1}
            isOnly={filteredData.length === 1} // Нова перевірка на одиничну подію
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Подій не знайдено</Text>}
      />

      <FAB
        icon="plus"
        label="Подія"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: { margin: 16, borderRadius: 28 },
  tagsWrapper: { height: 50, marginBottom: 8 },
  tagsContainer: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 50, borderRadius: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, opacity: 0.4 }
});

export default MainScreen;