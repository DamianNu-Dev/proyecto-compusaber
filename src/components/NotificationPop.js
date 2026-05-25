import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const NotificationPop = ({ animation, title, subText, icon = '✨' }) => {
  return (
    <Animated.View style={[styles.notifPanel, { transform: [{ translateY: animation }] }]}>
      <View style={styles.notifItem}>
        <View style={styles.notifIconBg}>
          <Text style={styles.notifIcon}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.notifText}>{title}</Text>
          <Text style={styles.notifSubText}>{subText}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notifPanel: {
    position: 'absolute',
    top: 80, left: 20, right: 20,
    backgroundColor: '#38BDF8', // Color llamativo
    borderRadius: 18,
    padding: 15,
    zIndex: 1000,
    elevation: 12,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  notifItem: { flexDirection: 'row', alignItems: 'center' },
  notifIconBg: { 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    width: 38, height: 38, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12 
  },
  notifIcon: { fontSize: 20 },
  notifText: { color: '#0F172A', fontSize: 14, fontWeight: 'bold' },
  notifSubText: { color: '#0F172A', fontSize: 12, opacity: 0.8 },
});

export default NotificationPop;