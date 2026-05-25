import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Platform } from 'react-native';

const DetailScreen = ({ item, onNavigate, user, onUpdateStats }) => {
  useEffect(() => {
    if (user && !user.exploredComponents?.includes(item.id)) {
      onUpdateStats({ 
        exploredComponents: [...(user.exploredComponents || []), item.id] 
      });
    }
  }, []);

  const openVideo = () => {
    const isNew = !user?.watchedVideos?.includes(item.id);
    const newWatched = isNew ? [...(user?.watchedVideos || []), item.id] : user?.watchedVideos;
    onUpdateStats({ 
      videosWatched: (user?.videosWatched || 0) + 1,
      watchedVideos: newWatched 
    });
    Linking.openURL(item.videoUrl).catch(err => console.error("No se pudo abrir", err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.closeButton, { top: Platform.OS === 'android' ? 40 : 20 }]} onPress={() => onNavigate('List', item.category)}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.nameLabel}>{item.name}</Text>
        
        <View style={[styles.imageCard, { backgroundColor: item.color }]}>
          <Text style={{fontSize: 100}}>{item.icon}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>¿Qué es?</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Función Principal</Text>
          <Text style={styles.descriptionText}>{item.function}</Text>
        </View>

        <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
          <Text style={styles.videoButtonText}>📺 Ver Video Explicativo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#1E293B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeText: { fontSize: 20, fontWeight: 'bold', color: '#38BDF8' },
  scrollContent: { padding: 25, paddingTop: 60 },
  nameLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageCard: {
    width: '100%',
    height: 250,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 20,
  },
  videoButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoButtonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default DetailScreen;