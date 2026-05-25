import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, TouchableOpacity, Animated, Dimensions, Easing, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import GamesScreen from './src/screens/GamesScreen';
import GlossaryScreen from './src/screens/GlossaryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TrophiesScreen from './src/screens/TrophiesScreen';
import QuizScreen from './src/screens/QuizScreen';
import VideosScreen from './src/screens/VideosScreen';
import HallOfFameScreen from './src/screens/HallOfFameScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import BottomNav from './src/components/BottomNav';
import NotificationPop from './src/components/NotificationPop';
import { ALL_TROPHIES } from './src/screens/TrophiesScreen';

import { internalComponents, externalComponents } from './src/screens/hardwareData'; // Importar para contar componentes
const { width } = Dimensions.get('window');

export default function App() {
  // Sistema de navegación básico por estados
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [params, setParams] = useState(null);
  const [user, setUser] = useState(null); // Almacenamiento en "RAM" (Estado Global)
  const [registeredUsers, setRegisteredUsers] = useState([]); // Base de datos temporal
  const [earnedTrophies, setEarnedTrophies] = useState([]); 

  // --- LÓGICA DE PERSISTENCIA (AsyncStorage) ---

  // 1. Cargar datos al iniciar la App
  useEffect(() => {
    const loadPersistentData = async () => {
      try {
        const [savedUsers, savedSession, savedTrophies] = await Promise.all([
          AsyncStorage.getItem('@compusaber_users'),
          AsyncStorage.getItem('@compusaber_session'),
          AsyncStorage.getItem('@compusaber_trophies')
        ]);

        if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
        if (savedTrophies) setEarnedTrophies(JSON.parse(savedTrophies));
        
        if (savedSession) {
          setUser(JSON.parse(savedSession));
          setCurrentScreen('Home'); // Auto-login si hay sesión
        }
      } catch (e) {
        console.error("Error cargando persistencia:", e);
      }
    };
    loadPersistentData();
  }, []);

  // 2. Guardar usuarios cuando la lista cambie
  useEffect(() => {
    if (registeredUsers.length > 0) {
      AsyncStorage.setItem('@compusaber_users', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  // 3. Guardar sesión activa (incluye puntos y progreso)
  useEffect(() => {
    if (user) {
      AsyncStorage.setItem('@compusaber_session', JSON.stringify(user));
    }
  }, [user]);

  // 4. Guardar logros obtenidos
  useEffect(() => {
    if (earnedTrophies.length > 0) {
      AsyncStorage.setItem('@compusaber_trophies', JSON.stringify(earnedTrophies));
    }
  }, [earnedTrophies]);

  // 5. Sincronizar trofeos con el perfil del usuario para persistencia por cuenta
  useEffect(() => {
    if (user && earnedTrophies.length > 0) {
      // Solo actualizar si hay cambios reales para evitar bucles infinitos
      if (JSON.stringify(user.earnedTrophies) !== JSON.stringify(earnedTrophies)) {
        const updatedUser = { ...user, earnedTrophies };
        setUser(updatedUser);
        setRegisteredUsers(prev => prev.map(u => u.email === user.email ? updatedUser : u));
      }
    }
  }, [earnedTrophies]);

  // 5. Lógica para el trofeo final "Leyenda Saber" (ID 10)
  useEffect(() => {
    const requiredTrophies = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const hasAllOthers = requiredTrophies.every(id => earnedTrophies.includes(id));

    if (hasAllOthers && !earnedTrophies.includes(10)) {
      unlockTrophy(10);
    }
  }, [earnedTrophies]);

  // Lógica Global de Notificaciones
  const notifAnim = useRef(new Animated.Value(-150)).current;
  const [notifData, setNotifData] = useState({ title: '', subText: '' });

  const triggerGlobalNotif = (title, subText) => {
    setNotifData({ title, subText });
    Animated.sequence([
      Animated.spring(notifAnim, { toValue: 20, useNativeDriver: true, bounciness: 12 }),
      Animated.delay(3000),
      Animated.timing(notifAnim, { toValue: -150, duration: 300, useNativeDriver: true })
    ]).start();
  };

  // Función para desbloquear trofeos de forma segura (sin duplicados)
  const unlockTrophy = (trophyId) => {
    if (earnedTrophies.includes(trophyId)) return;

    setTimeout(() => {
      const trophy = ALL_TROPHIES.find(t => t.id === trophyId);
      if (trophy) triggerGlobalNotif("¡Logro Desbloqueado!", trophy.title);
    }, 500);

    setEarnedTrophies(prev => [...prev, trophyId]);
  };

  const handleLogin = (userData) => {
    // Si es invitado, le damos estadísticas por defecto, si es registrado usamos las suyas
    const userWithStats = userData.points !== undefined ? userData : {
      ...userData,
      lessonsCompleted: 0,
      points: 0,
      videosWatched: 0,
      earnedTrophies: userData.earnedTrophies || [],
    };
    setUser(userWithStats);
    setEarnedTrophies(userWithStats.earnedTrophies);
    triggerGlobalNotif("¡Bienvenido!", "Qué bueno verte de nuevo.");
    unlockTrophy(3); // Desbloquear "Iniciado Tech" al entrar
    setCurrentScreen('Home');
  };

  const handleRegister = (newUser) => {
    const cleanUser = {
      ...newUser,
      lessonsCompleted: 0,
      points: 0,
      videosWatched: 0,
      earnedTrophies: [],
    };
    setRegisteredUsers([...registeredUsers, cleanUser]);
    setUser(cleanUser); // Login automático al registrarse
    triggerGlobalNotif("¡Registro Exitoso!", "Ya puedes empezar a aprender.");
    unlockTrophy(3); // Desbloquear "Iniciado Tech" al registrarse
    setCurrentScreen('Home');
  };

  const handleUpdateUser = (updatedData) => {
    // Aseguramos que los trofeos actuales se mantengan en el objeto del usuario
    const updatedUser = { ...user, ...updatedData, earnedTrophies };

    // Logro: Experto en RAM (ID 2) - Mira 5 videos tutoriales
    if (updatedUser.videosWatched >= 5) {
      unlockTrophy(2);
    }

    // Logro: Bibliotecario (ID 7) - Lee 10 términos del glosario
    if (updatedUser.readTerms?.length >= 10) {
      unlockTrophy(7);
    }

    // Logro: Explorador Interno (ID 4) - Revisa todos los componentes (8 internos + 8 externos = 16)
    const totalUniqueComponents = internalComponents.length + externalComponents.length;
    if (updatedUser.exploredComponents?.length >= totalUniqueComponents) {
      unlockTrophy(4);
    }

    // Logro: Cineasta HD (ID 8) - Mira todos los videos de componentes externos
    const externalIds = externalComponents.map(c => c.id);
    const watchedAllExternal = externalIds.every(id => updatedUser.watchedVideos?.includes(id));
    if (watchedAllExternal && externalIds.length > 0) {
      unlockTrophy(8);
    }

    // Logro: Hardware Pro (ID 9) - Llegar a 1000 puntos
    if (updatedUser.points >= 1000) {
      unlockTrophy(9);
    }

    setUser(updatedUser);
    setRegisteredUsers(prev => 
      prev.map(u => u.email === user.email ? updatedUser : u)
    );
  };

  const handleLogout = async () => {
    setUser(null);
    setEarnedTrophies([]);
    await AsyncStorage.removeItem('@compusaber_session');
    await AsyncStorage.removeItem('@compusaber_trophies');
    setCurrentScreen('Login');
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTransitioning = useRef(false); // Bloqueo para evitar clics durante animaciones
  
  const menuAnim = useRef(new Animated.Value(-width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef([0, 1, 2, 3, 4, 5].map(() => new Animated.Value(20))).current;
  const itemOpacities = useRef([0, 1, 2, 3, 4, 5].map(() => new Animated.Value(0))).current;

  const navigate = (screenName, data = null) => {
    setCurrentScreen(screenName);
    setParams(data);

    if (isMenuOpen) {
      // Cerramos el menú inmediatamente al navegar para evitar el "doble clic"
      setIsMenuOpen(false);
      isTransitioning.current = true;
      
      Animated.parallel([
        Animated.timing(menuAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        // Desvanecer items rápidamente para una transición limpia
        ...itemOpacities.map(op => Animated.timing(op, { toValue: 0, duration: 150, useNativeDriver: true })),
        ...itemAnims.map(anim => Animated.timing(anim, { toValue: 20, duration: 150, useNativeDriver: true }))
      ]).start(() => {
        isTransitioning.current = false;
      });
    }
  };

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    const backdropVal = isMenuOpen ? 0 : 1;

    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: backdropVal,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.stagger(80, 
        isMenuOpen 
          ? itemAnims.map(anim => Animated.timing(anim, { toValue: 20, duration: 200, useNativeDriver: true }))
          : itemAnims.map(anim => Animated.spring(anim, { toValue: 0, friction: 6, useNativeDriver: true }))
      ),
      Animated.stagger(80,
        isMenuOpen
          ? itemOpacities.map(op => Animated.timing(op, { toValue: 0, duration: 200, useNativeDriver: true }))
          : itemOpacities.map(op => Animated.timing(op, { toValue: 1, duration: 300, useNativeDriver: true }))
      )
    ]).start();
    setIsMenuOpen(!isMenuOpen);
  };

  // Renderizado condicional de pantallas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            registeredUsers={registeredUsers} 
          />
         );
      case 'Home':
        return <HomeScreen onNavigate={navigate} onOpenMenu={toggleMenu} user={user} earnedTrophies={earnedTrophies} onOpenNotifs={triggerGlobalNotif} />;
      case 'List':
        return <ListScreen category={params} onNavigate={navigate} />;
      case 'Detail':
        return (
          <DetailScreen 
            item={params} 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
          />
        );
      case 'Games':
        return (
          <GamesScreen 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
            onUnlockTrophy={unlockTrophy} 
          />
        );
      case 'Glossary':
        return (
          <GlossaryScreen 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
          />
        );
      case 'Profile':
        return (
          <ProfileScreen 
            onNavigate={navigate} 
            user={user} 
            onLogout={handleLogout} 
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'Trophies':
        return <TrophiesScreen earnedTrophies={earnedTrophies} />;
      case 'HallOfFame':
        return <HallOfFameScreen onNavigate={navigate} earnedTrophies={earnedTrophies} />;
      case 'Videos':
        return (
          <VideosScreen 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
          />
        );
      case 'Quiz':
        return (
          <QuizScreen 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
            onUnlockTrophy={unlockTrophy} 
          />
        );
      case 'Comments':
        return (
          <CommentsScreen 
            onNavigate={navigate} 
            user={user} 
            onUpdateStats={handleUpdateUser} 
          />
        );
      default:
        return <LoginScreen onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' ? (
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={true} />
      ) : (
        <StatusBar barStyle="light-content" />
      )}
      
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* Notificación Global */}
      <NotificationPop 
        animation={notifAnim} 
        title={notifData.title} 
        subText={notifData.subText} 
      />

      {/* Bottom Nav Funcional y Centralizada */}
      {currentScreen !== 'Login' && (
        <BottomNav onNavigate={navigate} currentScreen={currentScreen} />
      )}

      {/* Backdrop para cerrar menú */}
      <Animated.View 
        pointerEvents={isMenuOpen ? 'auto' : 'none'}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={toggleMenu} activeOpacity={1} />
      </Animated.View>

      {/* Menú Lateral (Drawer) */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: menuAnim }] }]}>
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerTitle}>COMPU<Text style={{color: '#FFFFFF'}}>SABER</Text></Text>
            <Text style={styles.drawerVersion}>v1.0.2 Premium</Text>
          </View>
          <TouchableOpacity onPress={toggleMenu}>
            <View style={styles.closeCircle}>
              <Text style={styles.closeMenuText}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigate('Login')} style={styles.backArrowMenuContainer}>
          <Text style={styles.backArrowText}>← Volver al Acceso</Text>
        </TouchableOpacity>

        <View style={styles.drawerContent}>
          {[
            { id: 'Home', label: 'Dashboard', icon: '🏠' },
            { id: 'Games', label: 'Arcade Juegos', icon: '🎮' },
            { id: 'Glossary', label: 'Enciclopedia', icon: '📖' },
            { id: 'HallOfFame', label: 'Salón de la Fama', icon: '🏛️' },
            { id: 'Profile', label: 'Configuración', icon: '👤' },
            { id: 'Comments', label: 'Comentarios', icon: '💬' }
          ].map((item, index) => (
            <Animated.View 
              key={item.id} 
              style={{ 
                opacity: itemOpacities[index], 
                transform: [{ translateX: itemAnims[index] }] 
              }}
            >
              <TouchableOpacity style={styles.drawerItem} onPress={() => navigate(item.id)}>
                <Text style={styles.drawerIcon}>{item.icon}</Text><Text style={styles.drawerItemText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => navigate('Login')}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F172A',
    // En Android respetamos la barra de estado, en Web y iOS el SafeAreaView hace su trabajo
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: width * 0.75,
    backgroundColor: '#1E293B',
    zIndex: 1000,
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#334155',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50, marginTop: 40 },
  drawerTitle: { color: '#38BDF8', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  drawerVersion: { color: '#64748B', fontSize: 12, marginTop: 2 },
  backArrowMenuContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 5 },
  backArrowText: { color: '#38BDF8', fontSize: 15, fontWeight: 'bold' },
  closeCircle: { backgroundColor: '#334155', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  closeMenuText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  drawerContent: { flex: 1 },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, marginBottom: 10, paddingHorizontal: 10, borderRadius: 15 },
  drawerIcon: { fontSize: 22, marginRight: 15 },
  drawerItemText: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
  drawerFooter: { marginTop: 'auto', marginBottom: 20 },
  logoutBtn: { backgroundColor: 'rgba(248, 113, 113, 0.1)', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(248, 113, 113, 0.2)' },
  logoutText: { color: '#F87171', fontWeight: 'bold', fontSize: 16 },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});