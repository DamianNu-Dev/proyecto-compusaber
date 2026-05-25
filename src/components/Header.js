import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

export default function Header({ onOpenMenu, onOpenNotifs, bellAnim }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onOpenMenu} activeOpacity={0.7}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>COMPUSABER</Text>
      <TouchableOpacity style={styles.bellIcon} onPress={onOpenNotifs} activeOpacity={0.7}>
        <Animated.View style={{ 
          transform: [{ rotate: bellAnim.interpolate({
            inputRange: [-10, 10],
            outputRange: ['-20deg', '20deg']
          }) }] 
        }}>
          <Text style={{fontSize: 24}}>🔔</Text>
          <View style={styles.notifBadge} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#0F172A',
  },
  menuIcon: { fontSize: 28, color: '#38BDF8', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  bellIcon: { padding: 5 },
  notifBadge: {
    position: 'absolute',
    top: 2, right: 2,
    width: 10, height: 10,
    backgroundColor: '#F87171',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#0F172A'
  },
});