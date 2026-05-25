import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const BottomNav = ({ onNavigate, currentScreen }) => {
  const tabs = [
    { id: 'Home', label: 'Inicio', icon: '🏠' },
    { id: 'Trophies', label: 'Trofeos', icon: '🏆' },
    { id: 'Profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        return (
          <TouchableOpacity key={tab.id} style={styles.navItem} onPress={() => onNavigate(tab.id)}>
            <Text style={[styles.icon, isActive && styles.activeIcon]}>{tab.icon}</Text>
            <Text style={[styles.navText, isActive && styles.activeText]}>{tab.label}</Text>
            {isActive ? <View style={styles.activeDot} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingTop: 12,
    paddingBottom: 25, // Sube la barra para que no choque con los gestos del sistema
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderColor: '#334155',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24, opacity: 0.5 },
  activeIcon: { opacity: 1, transform: [{ scale: 1.1 }] },
  navText: { fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  activeText: { color: '#38BDF8', fontWeight: 'bold' },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#38BDF8',
    marginTop: 4,
  },
});

export default BottomNav;