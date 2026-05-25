import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { glossaryData } from './hardwareData';

const GlossaryScreen = ({ onNavigate, user, onUpdateStats }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const markAsRead = (id) => {
    const currentRead = user?.readTerms || [];
    if (!currentRead.includes(id)) {
      onUpdateStats({ readTerms: [...currentRead, id] });
    }
  };

  const renderItem = ({ item, index }) => {
    const isRead = user?.readTerms?.includes(item.id);

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => markAsRead(item.id)}>
        <Animated.View style={[styles.glossaryCard, { opacity: fadeAnim }, isRead && styles.readCard]}>
        <View style={styles.termBadge}>
          <Text style={styles.termText}>{item.term}</Text>
          {isRead && <Text style={styles.readCheck}>✓</Text>}
        </View>
        <Text style={styles.definitionText}>{item.definition}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Glosario Tech</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => onNavigate('Home')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={glossaryData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 30 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  closeButton: { 
    backgroundColor: '#1E293B', 
    width: 40, height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  closeText: { color: '#38BDF8', fontSize: 20, fontWeight: 'bold' },
  list: { paddingBottom: 40 },
  glossaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
    // Sombra sutil
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  readCard: { borderLeftColor: '#22C55E', backgroundColor: '#161E2E' },
  termBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  termText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  readCheck: { color: '#22C55E', fontWeight: 'bold' },
  definitionText: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
  },
});

export default GlossaryScreen;