import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Linking, Platform } from 'react-native';

const CommentsScreen = ({ onNavigate, user, onUpdateStats }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [myComments, setMyComments] = useState(user?.myComments || []);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const sendFeedback = () => {
    if (!comment || rating === 0) return;

    const newComment = {
      id: Date.now().toString(),
      text: comment,
      stars: rating,
      date: new Date().toLocaleDateString()
    };

    const updatedComments = [newComment, ...myComments];
    setMyComments(updatedComments);
    onUpdateStats({ myComments: updatedComments });

    // Configuración de WhatsApp (Ecuador)
    const phone = "593969212190";
    const message = `⭐ Nueva Calificación: ${rating}/5\n💬 Comentario: ${comment}\n👤 Usuario: ${user?.name || 'Invitado'}`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback para web/dispositivos sin WA instalado
        Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      }
    });

    setComment('');
    setRating(0);
  };

  const StarRating = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => setRating(s)}>
          <Text style={[styles.star, { color: s <= rating ? '#F59E0B' : '#334155' }]}>
            {s <= rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Feedback</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.inputCard}>
          <Text style={styles.inputTitle}>¿Qué te parece la App?</Text>
          <StarRating />
          <TextInput
            style={styles.textArea}
            placeholder="Escribe tu comentario aquí..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, (!comment || rating === 0) && { opacity: 0.5 }]} 
            onPress={sendFeedback}
            disabled={!comment || rating === 0}
          >
            <Text style={styles.sendBtnText}>Enviar a Soporte</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>Mis Comentarios</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {myComments.length === 0 ? (
            <Text style={styles.emptyText}>Aún no has enviado comentarios.</Text>
          ) : (
            myComments.map(item => (
              <View key={item.id} style={styles.commentItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemStars}>{'★'.repeat(item.stars)}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 25 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  backBtn: { color: '#38BDF8', fontSize: 30, marginRight: 20 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  content: { flex: 1 },
  inputCard: { 
    backgroundColor: '#1E293B', 
    padding: 20, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: '#334155',
    marginBottom: 30
  },
  inputTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  star: { fontSize: 35, marginHorizontal: 5 },
  textArea: { 
    backgroundColor: '#0F172A', 
    borderRadius: 15, 
    padding: 15, 
    color: '#FFFFFF', 
    height: 100, 
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155'
  },
  sendBtn: { 
    backgroundColor: '#22C55E', 
    padding: 15, 
    borderRadius: 15, 
    marginTop: 20, 
    alignItems: 'center' 
  },
  sendBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  historyTitle: { color: '#94A3B8', fontSize: 14, fontWeight: '800', marginBottom: 15, textTransform: 'uppercase' },
  commentItem: { 
    backgroundColor: '#1E293B', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  itemStars: { color: '#F59E0B', fontSize: 12 },
  itemDate: { color: '#64748B', fontSize: 11 },
  itemText: { color: '#CBD5E1', fontSize: 14, lineHeight: 20 },
  emptyText: { color: '#475569', textAlign: 'center', marginTop: 20 }
});

export default CommentsScreen;