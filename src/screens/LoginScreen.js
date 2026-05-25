import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const LoginScreen = ({ onLogin, onRegister, registeredUsers }) => {
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // States para Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States para Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [viewMode, setViewMode] = useState('welcome'); // 'welcome', 'login', 'register'

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const startLogin = () => {
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      Alert.alert("Error", "Credenciales incorrectas o usuario no registrado.");
    }
  };

  const handleSignUp = () => {
    if (!regName || !regEmail || !regPassword) {
      Alert.alert("Atención", "Por favor completa todos los campos.");
      return;
    }
    
    const userExists = registeredUsers.some(u => u.email.toLowerCase() === regEmail.toLowerCase());
    if (userExists) {
      Alert.alert("Error", "Este correo ya está registrado.");
      return;
    }

    onRegister({
      name: regName,
      email: regEmail,
      password: regPassword
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoCompu}>COMPU</Text>
              <Text style={styles.logoSaber}>SABER</Text>
            </View>
            <Text style={styles.subtitle}>{viewMode === 'register' ? 'Crea tu cuenta' : 'Domina el hardware de forma interactiva'}</Text>
          </View>

          {viewMode === 'welcome' ? (
            <View style={styles.imageContainer}>
              <View style={styles.pcPlaceholder}>
                <Animated.Image 
                  source={require('../../assets/computadora.jfif.png')} 
                  style={{ width: '90%', height: '90%', borderRadius: 25, transform: [{ translateY: floatAnim }] }} 
                  resizeMode="contain"
                />
                <View style={styles.glowEffect} />
              </View>
            </View>
          ) : viewMode === 'login' ? (
            <View style={styles.formContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Correo o Usuario" 
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                placeholderTextColor="#64748B" 
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setViewMode('register')}>
                <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkHighlight}>Regístrate</Text></Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Nombre Completo" 
                placeholderTextColor="#64748B"
                value={regName}
                onChangeText={setRegName}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Correo Electrónico" 
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={regEmail}
                onChangeText={setRegEmail}
              />
              <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                placeholderTextColor="#64748B" 
                secureTextEntry 
                value={regPassword}
                onChangeText={setRegPassword}
              />
              <TouchableOpacity onPress={() => setViewMode('login')}>
                <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkHighlight}>Inicia Sesión</Text></Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          {viewMode === 'welcome' ? (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={() => onLogin({ name: 'Estudiante', email: 'invitado@compusaber.dev' })} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Comenzar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setViewMode('login')} activeOpacity={0.7}>
                <Text style={styles.outlineButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={viewMode === 'login' ? startLogin : handleSignUp} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>{viewMode === 'login' ? 'Entrar' : 'Registrarme'}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Azul Marino Profundo
    padding: 20,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCompu: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoSaber: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#38BDF8', // Azul brillante
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pcPlaceholder: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#1E293B',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  glowEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#38BDF8',
    opacity: 0.05,
  },
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 16,
  },
  linkText: { color: '#94A3B8', textAlign: 'center', marginTop: 10, fontSize: 14 },
  linkHighlight: { color: '#38BDF8', fontWeight: 'bold' },
  footer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    // Sombra Pro
    elevation: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
export default LoginScreen;