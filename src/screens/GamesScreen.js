import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const GAME_MODES = [
  { id: 'trivia', title: 'Trivia Master', icon: '🧠', color: '#38BDF8', desc: 'Demuestra cuánto sabes de hardware.' },
  { id: 'match', title: 'Hardware Match', icon: '🧩', color: '#22C55E', desc: 'Une cada componente con su nombre.' },
  { id: 'speed', title: 'Velocidad Tech', icon: '⚡', color: '#F59E0B', desc: 'Responde antes de que acabe el tiempo.' },
];

const QUESTIONS_DB = {
  trivia: [
    { q: '¿Qué componente es el "cerebro" de la PC?', options: ['RAM', 'CPU', 'SSD'], correct: 'CPU' },
    { q: '¿Cuál es un periférico de salida?', options: ['Mouse', 'Monitor', 'Teclado'], correct: 'Monitor' },
    { q: 'La RAM almacena datos permanentemente.', options: ['Verdadero', 'Falso'], correct: 'Falso' },
    { q: '¿Qué componente almacena el BIOS?', options: ['ROM', 'RAM', 'GPU'], correct: 'ROM' },
    { q: '¿Cuál es la función principal de la fuente?', options: ['Dar luz', 'Energía', 'Enfriar'], correct: 'Energía' },
  ],
  match: [
    { q: 'Une: Dispositivo de entrada principal', options: ['Monitor', 'Teclado', 'CPU'], correct: 'Teclado' },
    { q: 'Une: Almacenamiento de alta velocidad', options: ['SSD', 'HDD', 'CD'], correct: 'SSD' },
    { q: 'Une: Dispositivo de puntero', options: ['Scanner', 'Mouse', 'Monitor'], correct: 'Mouse' },
    { q: 'Une: Muestra la imagen al usuario', options: ['Impresora', 'Monitor', 'GPU'], correct: 'Monitor' },
    { q: 'Une: Conecta todos los componentes', options: ['Cable', 'Tarjeta Madre', 'Gabinete'], correct: 'Tarjeta Madre' },
    { q: 'Une: Procesa los gráficos pesados', options: ['Monitor', 'GPU', 'CPU'], correct: 'GPU' },
  ],
  speed: [
    { q: '¿Qué unidad mide la velocidad de la CPU?', options: ['Watts', 'Ghz', 'GB'], correct: 'Ghz' },
    { q: '¿Qué es Overclocking?', options: ['Limpiar', 'Subir velocidad', 'Apagar'], correct: 'Subir velocidad' },
    { q: '¿Tipo de memoria volátil?', options: ['HDD', 'RAM', 'SSD'], correct: 'RAM' },
    { q: '¿Puerto de video digital moderno?', options: ['VGA', 'HDMI', 'PS2'], correct: 'HDMI' },
    { q: '¿Qué significa HDD?', options: ['Hard Disk Drive', 'High Data Disk', 'Hyper Drive'], correct: 'Hard Disk Drive' },
    { q: '¿Componente que usa pasta térmica?', options: ['RAM', 'CPU', 'Fuente'], correct: 'CPU' },
    { q: '¿Unidad mínima de información?', options: ['Byte', 'Bit', 'Kilo'], correct: 'Bit' },
    { q: '¿Qué gestiona el Kernel?', options: ['Juegos', 'Hardware', 'Word'], correct: 'Hardware' },
    { q: '¿Certificación de fuentes?', options: ['80 Plus', 'HD Ready', 'WiFi'], correct: '80 Plus' },
    { q: '¿Qué inicia antes que el Sistema Op.?', options: ['BIOS', 'Chrome', 'Spotify'], correct: 'BIOS' },
  ]
};

const GamesScreen = ({ onNavigate, onUpdateStats, user, onUnlockTrophy }) => {
  const [activeMode, setActiveMode] = useState(null); // 'trivia', 'match', etc.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [gameTimer, setGameTimer] = useState(60);
  const timerInterval = useRef(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const selectMode = (modeId) => {
    const shuffled = [...QUESTIONS_DB[modeId]].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setScore(0);
    setLives(3);
    setCurrentIndex(0);
    setGameState('playing');
    setActiveMode(modeId);

    if (modeId === 'speed') {
      setGameTimer(30);
      timerInterval.current = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerInterval.current);
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex / (shuffledQuestions.length || 1)) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, shuffledQuestions]);

  const handleAnswer = (selected) => {
    const isCorrect = selected === shuffledQuestions[currentIndex].correct;

    if (isCorrect) {
      setScore(score + 10);
      if (onUpdateStats) onUpdateStats({ points: (user?.points || 0) + 10 });
    } else {
      setLives(lives - 1);
      if (lives <= 1) {
        clearInterval(timerInterval.current);
        setGameState('lost');
        return;
      }
    }

    if (currentIndex + 1 < shuffledQuestions.length) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setCurrentIndex(currentIndex + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    } else {
      clearInterval(timerInterval.current);
      // Lógica de Trofeos
      if (onUnlockTrophy) {
        onUnlockTrophy(5); // Rey del Arcade (ID 5)
        if (lives === 3) onUnlockTrophy(6); // Velocista (ID 6)
      }
      setGameState('won');
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setGameState('playing');
    setActiveMode(null);
  };

  if (!activeMode) {
    return (
      <View style={styles.container}>
        <View style={styles.headerSelection}>
          <TouchableOpacity onPress={() => onNavigate('Home')}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
          <Text style={styles.titleSelection}>Elige tu Reto</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollGames}>
          {GAME_MODES.map((game) => (
            <TouchableOpacity key={game.id} style={[styles.gameCard, { borderColor: game.color }]} onPress={() => selectMode(game.id)}>
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (gameState !== 'playing') {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>{gameState === 'won' ? '🏆' : '❌'}</Text>
        <Text style={styles.resultTitle}>{gameState === 'won' ? '¡FELICIDADES!' : 'GAME OVER'}</Text>
        <Text style={styles.resultText}>Puntaje final: {score}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={resetGame}>
          <Text style={styles.primaryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} onPress={() => onNavigate('Home')}>
          <Text style={styles.outlineButtonText}>Salir al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={() => { clearInterval(timerInterval.current); setActiveMode(null); }}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          }) }]} />
        </View>
        <View style={styles.headerInfo}>
           <Text style={styles.statsText}>❤️ {lives}  ⭐ {score}</Text>
           {activeMode === 'speed' && <Text style={styles.timerText}>⏳ {gameTimer}s</Text>}
        </View>
      </View>

      <Animated.View style={[styles.quizBox, { opacity: fadeAnim }]}>
        <Text style={styles.questionCounter}>PREGUNTA {currentIndex + 1} DE {shuffledQuestions.length}</Text>
        <Text style={styles.questionText}>{shuffledQuestions[currentIndex]?.q}</Text>
        
        <View style={styles.optionsGrid}>
          {shuffledQuestions[currentIndex]?.options.map((opt, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.optionButton}
              onPress={() => handleAnswer(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  headerSelection: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  titleSelection: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginLeft: 20 },
  scrollGames: { paddingBottom: 30 },
  gameCard: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1 
  },
  gameIcon: { fontSize: 40, marginRight: 20 },
  gameInfo: { flex: 1 },
  gameTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  gameDesc: { color: '#94A3B8', fontSize: 14, marginTop: 4 },
  gameHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 40 },
  closeX: { color: '#94A3B8', fontSize: 24, marginRight: 15, fontWeight: 'bold' },
  progressBg: { flex: 1, height: 12, backgroundColor: '#1E293B', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#22C55E', borderRadius: 10 },
  statsText: { color: '#FFFFFF', marginLeft: 15, fontWeight: 'bold', fontSize: 16 },
  quizBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  questionCounter: { color: '#38BDF8', fontWeight: 'bold', letterSpacing: 1, marginBottom: 10 },
  questionText: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  bigIcon: { fontSize: 80, marginBottom: 30 },
  optionsGrid: { width: '100%' },
  optionButton: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 12, 
    borderWidth: 2, 
    borderColor: '#334155',
    alignItems: 'center'
  },
  optionText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  resultContainer: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 30 },
  resultEmoji: { fontSize: 100, marginBottom: 20 },
  resultTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  resultText: { color: '#94A3B8', fontSize: 18, marginBottom: 40 },
  primaryButton: { backgroundColor: '#38BDF8', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  primaryButtonText: { color: '#0F172A', fontSize: 18, fontWeight: 'bold' },
  outlineButton: { width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', borderWidth: 2, borderColor: '#334155' },
  outlineButtonText: { color: '#FFFFFF', fontSize: 18 }
});

export default GamesScreen;