import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { internalComponents, externalComponents } from './hardwareData';

const { width } = Dimensions.get('window');

// Función para decidir qué datos mostrar según la categoría seleccionada
const getData = (category) => (category?.toLowerCase().includes('externos') ? externalComponents : internalComponents);

const ListScreen = ({ onNavigate, category }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => onNavigate('Detail', item)}
        style={styles.card}
      >
        <View style={styles.imagePlaceholder}>
          <Text style={{fontSize: 60}}>{item.icon}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text numberOfLines={2} style={styles.cardDesc}>{item.function}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{category || 'Componentes'}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => onNavigate('Home')}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getData(category)}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#1E293B',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeText: {
    fontSize: 18,
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    width: '100%',
    height: 110,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 6,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  imagePlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 15,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
});

export default ListScreen;