// src/screens/MainScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Searchbar, Chip, FAB, useTheme, Text, Card, Icon } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getEvents } from '../../database'; 

const MainScreen = ({ navigation }) => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Всі');

  const tags = ['Всі', 'Особисте', 'Робота', 'Навчання', 'Подорожі', 'Спорт'];

  useEffect(() => {
    if (isFocused) {
      const data = getEvents();
      const formattedData = data.map(item => ({
        ...item,
        media: item.media ? JSON.parse(item.media) : []
      }));
      setEvents(formattedData);
    }
  }, [isFocused]);

  const filteredData = events.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'Всі' || item.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const renderItem = ({ item, index }) => {
    const isFuture = new Date(item.date) > new Date();
    const isFirst = index === 0;
    const isLast = index === filteredData.length - 1;

    return (
      <View style={styles.itemContainer}>
        {/* ЛІВА ЧАСТИНА: ТАЙМЛАЙН */}
        <View style={styles.timelineLeft}>
          {/* ЛІНІЯ: проходить через весь контейнер без розривів */}
          <View style={[
            styles.line, 
            { backgroundColor: theme.colors.outlineVariant },
            isFirst && { top: 28 }, // Починається від центру першої крапки
            isLast && { bottom: 'auto', height: 28 } // Закінчується на останній
          ]} />
          
          <View style={[
            styles.dot, 
            { backgroundColor: isFuture ? theme.colors.primary : theme.colors.secondaryContainer }
          ]}>
            <Icon 
              source={isFuture ? "calendar-clock" : "check"} 
              size={18} 
              color={isFuture ? "white" : theme.colors.onSecondaryContainer} 
            />
          </View>
        </View>

        {/* ПРАВА ЧАСТИНА: КАРТКА */}
        <Card 
          style={styles.card} 
          mode="elevated" 
          onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
          <Card.Content style={styles.cardContent}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, marginBottom: 4 }}>
              {new Date(item.date).toLocaleDateString('uk-UA')}
            </Text>
            
            <Text variant="titleMedium" style={styles.eventTitle}>
              {item.title}
            </Text>

            {item.note ? (
              <Text variant="bodySmall" style={styles.noteText} numberOfLines={3}>
                {item.note}
              </Text>
            ) : null}
            
            <View style={styles.cardFooter}>
              <View style={styles.tagWrapper}>
                <Chip compact style={styles.tagChip} textStyle={styles.tagTextStyle} mode="flat">
                  {item.tag}
                </Chip>
              </View>
              {item.media && item.media.length > 0 && (
                <Icon source="paperclip" size={18} color={theme.colors.outline} />
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Timelines" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <Searchbar
        placeholder="Пошук подій..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={{ height: 50, marginBottom: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
          {tags.map(tag => (
            <Chip
              key={tag}
              selected={selectedTag === tag}
              onPress={() => setSelectedTag(tag)}
              style={styles.filterChip}
              showSelectedCheck={false}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Подій не знайдено</Text>}
      />

      <FAB
        icon="plus"
        label="Подія"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => navigation.navigate('AddEvent')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: { margin: 16, borderRadius: 28 },
  tagsContainer: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { height: 32 },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  
  itemContainer: { 
    flexDirection: 'row', 
    marginTop: -1, // Прибирає мікро-розриви між сегментами
    backgroundColor: 'transparent',
  },
  
  timelineLeft: { 
    width: 60, 
    alignItems: 'center',
    position: 'relative',
  },
  line: { 
    position: 'absolute', 
    width: 2, 
    top: 0, 
    bottom: 0, 
    left: '50%',
    marginLeft: -1,
    zIndex: 1
  },
  dot: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
    zIndex: 2,
    elevation: 4,
    backgroundColor: 'white' // для чіткості крапки
  },
  
  card: { 
    flex: 1, 
    borderRadius: 20, 
    marginLeft: 4,
    marginRight: 8,
    marginBottom: 16, // Відступ між картками тепер ТУТ
    marginTop: 10,
    elevation: 1
  },
  cardContent: { paddingVertical: 12, paddingHorizontal: 16 },
  eventTitle: { fontWeight: 'bold', lineHeight: 22 },
  noteText: { marginTop: 4, opacity: 0.7, lineHeight: 18 },
  
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  tagWrapper: { flex: 1, flexDirection: 'row' },
  tagChip: { height: 26, backgroundColor: 'rgba(0,0,0,0.04)' },
  tagTextStyle: { fontSize: 10, marginVertical: 0, paddingHorizontal: 4 },
  
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 50, borderRadius: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, opacity: 0.4 }
});

export default MainScreen;