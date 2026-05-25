import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';

export default function CategoryCard({ item, animation, onPress }) {
  return (
    <Animated.View 
      style={[styles.cardContainer, { 
        opacity: animation, 
        transform: [{ scale: animation }] 
      }]}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.card, { borderColor: item.accent || '#38BDF8' }]}
        onPress={onPress}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.cardText}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%', // Para que quepan dos por fila
    height: 170, // Un poco más de altura
    marginBottom: 18,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 25, // Un poco menos redondeado
    padding: 18, // Ajustar padding
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5, // Borde más sutil
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardIcon: { fontSize: 40, marginBottom: 10 }, // Icono un poco más pequeño
  cardText: { 
    fontSize: 14, // Texto un poco más pequeño
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center' 
  },
});