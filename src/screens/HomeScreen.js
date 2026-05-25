import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard'; // Ya existe y se usa
import { ALL_TROPHIES } from './TrophiesScreen';

const HomeScreen = ({ onNavigate, onOpenMenu, user, earnedTrophies = [], onOpenNotifs }) => {
  // Cálculo de progreso basado en trofeos ganados
  const progressPercent = Math.round((earnedTrophies.length / ALL_TROPHIES.length) * 100) || 0;
  const lessonsLeft = Math.max(0, 8 - (user?.lessonsCompleted || 0));

  const categories = [
    { id: 1, title: 'Componentes Internos', color: '#38BDF8', icon: '⚙️', accent: '#38BDF8' },
    { id: 2, title: 'Componentes Externos', color: '#38BDF8', icon: '🖱️', accent: '#38BDF8' },
    { id: 3, title: 'Videos Tutoriales', color: '#38BDF8', icon: '📺', screen: 'Videos', accent: '#FB8500' },
    { id: 4, title: 'Quices / Pruebas', color: '#38BDF8', icon: '📝', screen: 'Quiz', accent: '#9B5DE5' },
    { id: 5, title: 'Videojuegos', color: '#38BDF8', icon: '🎮', screen: 'Games', accent: '#22C55E' },
    { id: 6, title: 'Glosario Tech', color: '#38BDF8', icon: '📖', screen: 'Glossary', accent: '#F9C74F' },
  ];

  const fadeAnims = useRef(categories.map(() => new Animated.Value(0))).current;
  const bellAnim = useRef(new Animated.Value(0)).current;

  const triggerBell = () => {
    Animated.sequence([
      Animated.timing(bellAnim, { toValue: 15, duration: 80, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: -15, duration: 80, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: 15, duration: 80, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: -15, duration: 80, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
    
    if (onOpenNotifs) {
      onOpenNotifs("¡Sigue así!", "Estás aprendiendo mucho hoy.");
    }
  };

  useEffect(() => {
    const animations = categories.map((_, i) => {
      return Animated.spring(fadeAnims[i], {
        toValue: 1,
        tension: 20,
        friction: 7,
        delay: i * 100,
        useNativeDriver: true,
      });
    });
    Animated.stagger(100, animations).start(); // Animación escalonada para las tarjetas
  }, []); // El array vacío es correcto aquí

  return (
    <View style={styles.container}>
      {/* Header Pro Componentizado */}
      <Header onOpenMenu={onOpenMenu} onOpenNotifs={triggerBell} bellAnim={bellAnim} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingCard}>
          <View style={styles.greetingInfo}>
            <Text style={styles.greetingTitle}>¡Hola, {user?.name?.split(' ')[0] || 'estudiante'}!</Text>
            <Text style={styles.greetingDesc}>Tu progreso actual. Tienes {lessonsLeft} lecciones pendientes.</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
              <Text style={styles.progressText}>{progressPercent}% completado</Text>
            </View>
          </View>
          <View style={styles.greetingImage}>
            <Image 
              source={require('../../assets/computadora.jfif.png')} 
              style={{ width: 80, height: 80, borderRadius: 15 }} 
            />
          </View>
        </View>

        {/* CORRECCIÓN: Grid mejorado y componentizado */}
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <CategoryCard 
              key={item.id}
              item={item}
              animation={fadeAnims[index]}
              onPress={() => item.screen ? onNavigate(item.screen) : onNavigate('List', item.title)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Espacio para el BottomNav
  },
  greetingCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 30,
    padding: 25,
    marginBottom: 25,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
    elevation: 10,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.2,
  },
  greetingInfo: { flex: 1 },
  greetingTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  greetingDesc: { color: '#94A3B8', fontSize: 13, marginTop: 8, lineHeight: 18 },
  progressBarContainer: { marginTop: 15, flexDirection: 'row', alignItems: 'center' },
  progressBar: { height: 6, backgroundColor: '#38BDF8', borderRadius: 3, overflow: 'hidden', marginRight: 10 },
  progressText: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold' },
  greetingImage: { marginLeft: 10 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default HomeScreen;