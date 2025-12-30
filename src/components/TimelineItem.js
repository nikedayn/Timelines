// src/components/TimelineItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme, Icon } from 'react-native-paper';

const TimelineItem = ({ item, isFirst, isLast, isOnly, onPress }) => {
  const theme = useTheme();
  const eventDate = new Date(item.date);
  const isFuture = eventDate > new Date();

  return (
    <View style={styles.itemContainer}>
      {/* ЛІВА ЧАСТИНА: ТАЙМЛАЙН */}
      <View style={styles.timelineLeft}>
        {/* Малюємо лінію лише якщо подій більше ніж одна */}
        {!isOnly && (
          <View style={[
            styles.line, 
            { backgroundColor: theme.colors.outlineVariant },
            isFirst && { top: 28 }, 
            isLast && { bottom: 'auto', height: 28 }
          ]} />
        )}
        
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
        onPress={onPress}
      >
        <Card.Content style={styles.cardContent}>
          <Text variant="labelSmall" style={{ color: theme.colors.primary, marginBottom: 4 }}>
            {eventDate.toLocaleDateString('uk-UA')}
          </Text>
          
          <Text variant="titleMedium" style={styles.eventTitle}>
            {item.title}
          </Text>

          {item.note ? (
            <Text variant="bodySmall" style={styles.noteText} numberOfLines={2}>
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

const styles = StyleSheet.create({
  itemContainer: { 
    flexDirection: 'row', 
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
  },
  dot: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
    zIndex: 2,
    elevation: 2,
  },
  card: { 
    flex: 1, 
    borderRadius: 20, 
    marginLeft: 4,
    marginRight: 8,
    marginBottom: 16,
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
});

export default TimelineItem;