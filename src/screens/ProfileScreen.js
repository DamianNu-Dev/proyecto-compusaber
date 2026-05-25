import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';

const ProfileScreen = ({ onNavigate, user, onUpdateUser, onLogout }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

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

  const handleSave = () => {
    onUpdateUser({ name: editName, email: editEmail });
    setIsEditing(false);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}><Text style={{fontSize: 60}}>🧑‍💻</Text></View>
          {isEditing ? (
            <View style={{width: '100%', marginTop: 10}}>
              <TextInput 
                style={styles.editInput} 
                value={editName} 
                onChangeText={setEditName} 
                placeholder="Nombre"
                placeholderTextColor="#64748B"
              />
              <TextInput 
                style={styles.editInput} 
                value={editEmail} 
                onChangeText={setEditEmail} 
                placeholder="Correo"
                placeholderTextColor="#64748B"
              />
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{user?.name || 'Estudiante'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'sin@correo.com'}</Text>
            </>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.lessonsCompleted || 0}</Text>
            <Text style={styles.statLabel}>Lecciones Completadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>Puntos Totales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.videosWatched || 0}</Text>
            <Text style={styles.statLabel}>Videos Vistos</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editProfileButton} 
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={styles.editProfileButtonText}>{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 20 
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
  profileCard: { 
    backgroundColor: '#1E293B', 
    padding: 30, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 25 },
  avatarPlaceholder: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#334155', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#38BDF8',
  },
  userName: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  userEmail: { color: '#94A3B8', fontSize: 16, marginTop: 5 },
  editInput: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
    paddingVertical: 20,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#38BDF8', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#94A3B8', fontSize: 13, marginTop: 5, textAlign: 'center' },
  editProfileButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  editProfileButtonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
});

export default ProfileScreen;