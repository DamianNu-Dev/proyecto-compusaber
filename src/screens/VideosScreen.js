import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { internalComponents, externalComponents } from './hardwareData';

const VideosScreen = ({ onNavigate, user, onUpdateStats }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const openVideo = (item) => {
    const isNew = !user?.watchedVideos?.includes(item.id);
    const newWatched = isNew ? [...(user?.watchedVideos || []), item.id] : user?.watchedVideos;
    
    onUpdateStats({ 
      videosWatched: (user?.videosWatched || 0) + 1,
      watchedVideos: newWatched 
    });
    
    Linking.openURL(item.videoUrl).catch(err => console.error("No se pudo abrir", err));
  };

  const VideoCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoCard} 
      onPress={() => openVideo(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.playBadge}>
          <Text style={styles.playText}>▶</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardTag}>Tutorial HD</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tutoriales</Text>
          <Text style={styles.subtitle}>Aprende visualmente</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => onNavigate('Home')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>⚙️ Componentes Internos</Text>
        <View style={styles.grid}>
          {internalComponents.map(item => <VideoCard key={item.id} item={item} />)}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>🖱️ Componentes Externos</Text>
        <View style={styles.grid}>
          {externalComponents.map(item => <VideoCard key={item.id} item={item} />)}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 20,
    marginBottom: 20 
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#38BDF8', fontSize: 14, fontWeight: '600' },
  closeBtn: { 
    backgroundColor: '#1E293B', 
    width: 40, height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  closeText: { color: '#38BDF8', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { 
    color: '#94A3B8', 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 15, 
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  videoCard: { 
    width: '48%', 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2
  },
  iconContainer: { 
    width: 80, height: 80, 
    borderRadius: 40, 
    backgroundColor: 'rgba(56, 189, 248, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 12
  },
  cardIcon: { fontSize: 40 },
  playBadge: { 
    position: 'absolute', 
    bottom: -5, right: -5, 
    backgroundColor: '#EF4444', 
    width: 28, height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B'
  },
  playText: { color: '#FFFFFF', fontSize: 12 },
  cardInfo: { alignItems: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  cardTag: { color: '#38BDF8', fontSize: 10, marginTop: 4, fontWeight: 'bold' }
});

export default VideosScreen;