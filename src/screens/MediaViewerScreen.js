import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';
import { VideoView, useVideoPlayer } from 'expo-video'; // Новий імпорт

const { width, height } = Dimensions.get('window');

const MediaViewerScreen = ({ route, navigation }) => {
  const { uri } = route.params;
  const isVideo = uri.toLowerCase().endsWith('.mp4') || uri.toLowerCase().endsWith('.mov');

  // Ініціалізація плеєра для нової бібліотеки
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header} mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Перегляд" titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      <View style={styles.content}>
        {isVideo ? (
          <VideoView
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            style={styles.fullMedia}
          />
        ) : (
          <Image 
            source={{ uri }} 
            style={styles.fullMedia} 
            resizeMode="contain" 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  header: { backgroundColor: 'transparent', elevation: 0, zIndex: 10 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullMedia: { 
    width: width, 
    height: height * 0.8,
  },
});

export default MediaViewerScreen;