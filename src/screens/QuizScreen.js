import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const QUIZ_DATA = {
  beginner: {
    title: 'Principiante',
    color: '#22C55E',
    questions: [
      { q: '¿Qué componente almacena datos temporalmente?', options: ['RAM', 'Disco Duro', 'Fuente'], correct: 'RAM' },
      { q: '¿Cuál es el "cerebro" de la PC?', options: ['GPU', 'CPU', 'Monitor'], correct: 'CPU' },
      { q: '¿Cuál es un periférico de entrada?', options: ['Impresora', 'Teclado', 'Parlantes'], correct: 'Teclado' },
      { q: '¿Qué dispositivo muestra las imágenes?', options: ['Monitor', 'Mouse', 'CPU'], correct: 'Monitor' },
      { q: '¿Cuál se usa para escribir?', options: ['Gabinete', 'Teclado', 'Microfono'], correct: 'Teclado' },
      { q: '¿Qué dispositivo captura video para llamadas?', options: ['Escaner', 'Cámara Web', 'Monitor'], correct: 'Cámara Web' },
      { q: '¿Cuál de estos produce sonido?', options: ['Micrófono', 'Parlantes', 'Mouse'], correct: 'Parlantes' },
      { q: '¿Para qué sirve el Mouse?', options: ['Escribir', 'Mover el cursor', 'Enfriar la PC'], correct: 'Mover el cursor' },
    ]
  },
  medium: {
    title: 'Intermedio',
    color: '#F59E0B',
    questions: [
      { q: '¿Dónde se conectan todos los componentes?', options: ['Gabinete', 'Tarjeta Madre', 'Socket'], correct: 'Tarjeta Madre' },
      { q: '¿Qué significa SSD?', options: ['Super Speed Drive', 'Solid State Drive', 'System Storage Data'], correct: 'Solid State Drive' },
      { q: '¿Qué componente necesita pasta térmica?', options: ['Memoria RAM', 'Procesador', 'Fuente de Poder'], correct: 'Procesador' },
      { q: '¿Cuál es la función de la GPU?', options: ['Procesar Audio', 'Procesar Gráficos', 'Almacenar archivos'], correct: 'Procesar Gráficos' },
      { q: '¿Qué tipo de puerto es el más común hoy?', options: ['VGA', 'USB', 'Serial'], correct: 'USB' },
      { q: '¿Qué componente transforma la corriente alterna en continua?', options: ['Tarjeta de Red', 'Fuente de Poder', 'Gabinete'], correct: 'Fuente de Poder' },
      { q: '¿Cuál es la ventaja de un SSD sobre un HDD?', options: ['Es más lento', 'Es más rápido', 'Pesa más'], correct: 'Es más rápido' },
      { q: '¿Qué componente evita el sobrecalentamiento?', options: ['Tarjeta Madre', 'Sistema de Enfriamiento', 'Monitor'], correct: 'Sistema de Enfriamiento' },
    ]
  },
  pro: {
    title: 'Hardware Pro',
    color: '#EF4444',
    questions: [
      { q: '¿Qué certificación garantiza eficiencia energética?', options: ['Gold 80+', 'Intel Inside', 'RGB Sync'], correct: 'Gold 80+' },
      { q: '¿Cuál es la función del puente norte (Northbridge)?', options: ['Gestionar GPU/RAM', 'Audio frontal', 'Puertos USB'], correct: 'Gestionar GPU/RAM' },
      { q: '¿Qué unidad mide la frecuencia de la CPU?', options: ['Gigabytes', 'GigaHertz', 'Watts'], correct: 'GigaHertz' },
      { q: '¿Qué es el Overclocking?', options: ['Bajar voltaje', 'Subir frecuencia', 'Limpiar ventiladores'], correct: 'Subir frecuencia' },
      { q: '¿Qué tecnología usa un procesador AMD moderno?', options: ['HyperThreading', 'Infinity Fabric', 'DLSS'], correct: 'Infinity Fabric' },
      { q: '¿Qué software permite al OS hablar con el hardware?', options: ['Kernel', 'Driver', 'BIOS'], correct: 'Driver' },
      { q: '¿Qué sistema inicia el hardware antes del OS?', options: ['BIOS', 'Software', 'Bit'], correct: 'BIOS' },
      { q: '¿Cómo se llama el canal de comunicación entre componentes?', options: ['Bus de Datos', 'Vía Láctea', 'Ethernet'], correct: 'Bus de Datos' },
    ]
  }
};

const QuizScreen = ({ onNavigate, onUpdateStats, onUnlockTrophy, user }) => {
  const [mode, setMode] = useState('selection'); // selection, quiz, result
  const [difficulty, setDifficulty] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timer, setTimer] = useState(15);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const progressWidth = useRef(new Animated.Value(0)).current;
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const startQuiz = (diff) => {
    // Barajar preguntas para que nunca inicien igual
    const shuffled = [...QUIZ_DATA[diff].questions].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    
    setDifficulty(diff);
    setMode('quiz');
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    fadeAnim.setValue(1); // Resetear opacidad para que sean visibles
    progressWidth.setValue(0); // Resetear barra de progreso
    resetTimer(diff);
  };

  const resetTimer = (diff) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (diff === 'pro') {
      setTimer(15);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleAnswer(null);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (selected) => {
    const correct = selected === currentQuestions[currentIndex].correct;

    setSelectedOption(selected);
    setIsCorrect(correct);
    if (timerRef.current) clearInterval(timerRef.current);

    if (correct) {
      setScore(prev => prev + 1); // Usar función para evitar desfase
      onUpdateStats({ points: (user?.points || 0) + 20 });
    } else {
      shake();
    }

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      if (currentIndex + 1 < currentQuestions.length) {
        setCurrentIndex(currentIndex + 1);
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
          resetTimer(difficulty);
      } else {
        if (difficulty === 'pro') onUnlockTrophy(1); // Maestro CPU
        onUpdateStats({ lessonsCompleted: (user?.lessonsCompleted || 0) + 1 });
        setMode('result');
      }
    });
    }, 600);
  };

  useEffect(() => {
    if (difficulty) {
      const total = QUIZ_DATA[difficulty].questions.length;
      Animated.timing(progressWidth, {
        toValue: ((currentIndex + 1) / total) * 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, difficulty]);

  // Pantalla de Selección
  if (mode === 'selection') {
    return (
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Retos de Saber</Text>
        <Text style={styles.subTitle}>Elige tu nivel de maestría</Text>
        
        {Object.keys(QUIZ_DATA).map((key) => (
          <TouchableOpacity 
            key={key} 
            style={[styles.levelCard, { borderColor: QUIZ_DATA[key].color }]}
            onPress={() => startQuiz(key)}
          >
            <View style={[styles.dot, { backgroundColor: QUIZ_DATA[key].color }]} />
            <Text style={styles.levelText}>{QUIZ_DATA[key].title}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('Home')}>
          <Text style={styles.backBtnText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de Resultado
  if (mode === 'result') {
    const total = QUIZ_DATA[difficulty].questions.length;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultEmoji}>{score === total ? '🔥' : '👏'}</Text>
        <Text style={styles.resultTitle}>¡Quiz Completado!</Text>
        <Text style={styles.scoreText}>{score} de {total} correctas</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('selection')}>
          <Text style={styles.primaryBtnText}>Intentar otro nivel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de Quiz Activo
  const currentQ = currentQuestions[currentIndex];
  if (!currentQ) return null; // Evitar error si el array no ha cargado

  return (
    <View style={styles.container}>
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => setMode('selection')}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
        <Text style={styles.difficultyTag}>{QUIZ_DATA[difficulty].title}</Text>
        <Text style={styles.progressText}>Pregunta {currentIndex + 1}/{QUIZ_DATA[difficulty].questions.length}</Text>
      </View>

      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, { width: progressWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
      </View>

      {difficulty === 'pro' && (
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, timer < 5 && { color: '#EF4444' }]}>⏱ {timer}s</Text>
        </View>
      )}

      <Animated.View style={[styles.quizBox, { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.questionText}>{currentQ.q}</Text>
        {currentQ.options.map((opt, i) => (
          <TouchableOpacity 
            key={i} 
            disabled={selectedOption !== null}
            style={[
              styles.optionBtn,
              selectedOption === opt && (isCorrect ? styles.correctOpt : styles.wrongOpt),
              selectedOption !== null && opt === currentQ.correct && styles.correctOpt
            ]} 
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 25, justifyContent: 'center' },
  mainTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { color: '#94A3B8', fontSize: 16, marginBottom: 40 },
  levelCard: { 
    backgroundColor: '#1E293B', 
    padding: 22, 
    borderRadius: 20, 
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1 
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  levelText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1 },
  arrow: { color: '#38BDF8', fontSize: 20, fontWeight: 'bold' },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backArrow: { color: '#FFFFFF', fontSize: 24, paddingRight: 15 },
  difficultyTag: { color: '#38BDF8', fontWeight: 'bold', backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  progressText: { color: '#94A3B8', fontWeight: '500' },
  progressBarBg: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, marginBottom: 30, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38BDF8' },
  timerContainer: { alignItems: 'center', marginBottom: 20 },
  timerText: { color: '#38BDF8', fontSize: 20, fontWeight: 'bold' },
  quizBox: { width: '100%' },
  questionText: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold', marginBottom: 40, lineHeight: 34 },
  optionBtn: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 18, 
    marginBottom: 15, 
    borderWidth: 1.5, 
    borderColor: '#334155'
  },
  correctOpt: { borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.1)' },
  wrongOpt: { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  optionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  resultContainer: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', padding: 30 },
  resultEmoji: { fontSize: 80, marginBottom: 20 },
  resultTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  scoreText: { color: '#38BDF8', fontSize: 22, fontWeight: '800', marginBottom: 40 },
  primaryBtn: { backgroundColor: '#38BDF8', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 15 },
  primaryBtnText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },
  backBtn: { marginTop: 30, alignItems: 'center' },
  backBtnText: { color: '#64748B', fontWeight: 'bold' }
});

export default QuizScreen;