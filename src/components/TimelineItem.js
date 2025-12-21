// src/components/TimelineItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme, Icon } from 'react-native-paper';

const TimelineItem = ({ item, isLast }) => {
  const theme = useTheme();
  const isFuture = new Date(item.date) > new Date();

  return (
    <View style={styles.container}>
      {/* Ліва частина: Лінія та Точка */}
      <View style={styles.timelineLeft}>
        <View style={[styles.line, { backgroundColor: theme.colors.outlineVariant }, isLast && { height: '50%' }]} />
        <View style={[ 
          styles.dot, 
          { backgroundColor: isFuture ? theme.colors.primary : theme.colors.secondaryContainer,
            borderColor: theme.colors.outline } 
        ]}>
           {isFuture ? <Icon source="calendar-clock" size={14} color="white" /> : <Icon source="check" size={14} color={theme.colors.onSecondaryContainer} />}
        </View>
      </View>

      {/* Права частина: Картка події */}
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>{item.date}</Text>
          <Text variant="titleMedium" style={styles.title}>{item.title}</Text>
          {item.note && <Text variant="bodySmall" numberOfLines={2}>{item.note}</Text>}
          
          <View style={styles.footer}>
            <Chip icon="tag" style={styles.tag} textStyle={{ fontSize: 10 }}>{item.tag}</Chip>
            {item.hasMedia && <Icon source="paperclip" size={16} color={theme.colors.outline} />}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', minHeight: 100 },
  timelineLeft: { width: 50, alignItems: 'center' },
  line: { position: 'absolute', width: 2, height: '100%' },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1 },
  card: { flex: 1, marginBottom: 16, marginRight: 16, borderRadius: 16 },
  title: { marginVertical: 4, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  tag: { height: 24, justifyContent: 'center' }
});

export default TimelineItem;