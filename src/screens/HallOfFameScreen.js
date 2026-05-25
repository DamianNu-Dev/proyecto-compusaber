import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ALL_TROPHIES } from './TrophiesScreen';

const HallOfFameScreen = ({ onNavigate, earnedTrophies }) => {
  const myTrophies = ALL_TROPHIES.filter(t => earnedTrophies.includes(t.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Salón de la Fama</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {myTrophies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏛️</Text>
            <Text style={styles.emptyText}>Tu salón está vacío. ¡Gana trofeos aprendiendo!</Text>
          </View>
        ) : (
          myTrophies.map((t) => (
            <View key={t.id} style={styles.achievementCard}>
              <View style={[styles.medalCircle, { borderColor: t.color }]}>
                <Text style={styles.medalIcon}>{t.icon}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.trophyTitle}>{t.title}</Text>
                <Text style={styles.trophyDesc}>{t.desc}</Text>
                <Text style={styles.dateText}>Completado con éxito</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 25, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  backBtn: { color: '#38BDF8', fontSize: 30, marginRight: 20 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  scroll: { padding: 20 },
  achievementCard: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5
  },
  medalCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  medalIcon: { fontSize: 35 },
  info: { flex: 1 },
  trophyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  trophyDesc: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  dateText: { color: '#38BDF8', fontSize: 11, marginTop: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 80, opacity: 0.2, marginBottom: 20 },
  emptyText: { color: '#94A3B8', fontSize: 16, textAlign: 'center' }
});

export default HallOfFameScreen;