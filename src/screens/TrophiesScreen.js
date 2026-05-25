import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

export const ALL_TROPHIES = [
  { id: 1, title: 'Maestro de la CPU', desc: 'Domina el Quiz Nivel Pro', icon: '🧠', color: '#FFD700' },
  { id: 2, title: 'Experto en RAM', desc: 'Mira 5 videos tutoriales', icon: '⚡', color: '#38BDF8' },
  { id: 3, title: 'Iniciado Tech', desc: 'Tu primera sesión en la app', icon: '🥉', color: '#CD7F32' },
  { id: 4, title: 'Explorador Interno', desc: 'Revisa todos los componentes', icon: '📟', color: '#22C55E' },
  { id: 5, title: 'Rey del Arcade', desc: 'Gana una partida de Trivia', icon: '👑', color: '#A855F7' },
  { id: 6, title: 'Velocista', desc: 'Completa un juego sin errores', icon: '🏃', color: '#F59E0B' },
  { id: 7, title: 'Bibliotecario', desc: 'Lee 10 términos del glosario', icon: '📚', color: '#FB8500' },
  { id: 8, title: 'Cineasta HD', desc: 'Mira todos los videos externos', icon: '🎬', color: '#EF4444' },
  { id: 9, title: 'Hardware Pro', desc: 'Llega a 1000 puntos totales', icon: '💎', color: '#06B6D4' },
  { id: 10, title: 'Leyenda Saber', desc: 'Desbloquea todos los trofeos', icon: '🌌', color: '#FFFFFF' },
];

const TrophiesScreen = ({ earnedTrophies = [] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus logros alcanzados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {ALL_TROPHIES.map((t) => {
            const isEarned = earnedTrophies.includes(t.id);
            return (
              <View key={t.id} style={[styles.card, !isEarned && styles.cardLocked]}>
                <View style={[
                  styles.iconBg, 
                  { backgroundColor: isEarned ? `${t.color}20` : 'rgba(255,255,255,0.05)' }
                ]}>
                  <Text style={[styles.icon, !isEarned && styles.iconLocked]}>
                    {isEarned ? t.icon : '🔒'}
                  </Text>
                </View>
                <Text style={[styles.cardTitle, !isEarned && styles.textLocked]}>{t.title}</Text>
                <Text style={[styles.cardDesc, !isEarned && styles.textLocked]}>{t.desc}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 30, paddingTop: 40 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#38BDF8', fontSize: 16, marginTop: 5 },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardLocked: {
    opacity: 0.6,
    borderColor: 'transparent',
  },
  iconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  icon: { fontSize: 30 },
  iconLocked: { opacity: 0.3 },
  cardTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  cardDesc: { color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 5 },
  textLocked: { color: '#475569' }
});

export default TrophiesScreen;