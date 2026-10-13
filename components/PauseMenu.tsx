import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import { C } from '../assets/theme';
import { UI } from '../assets/uiImages';
import { WOOD_EDGE } from './Wood';

const FONT = Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' });

// Round pause button for the top right corner of the wooden banner.
export function PauseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable hitSlop={8} onPress={onPress} style={st.round} accessibilityRole="button" accessibilityLabel="Pause">
      <Image source={UI.pause} style={st.icon} />
    </Pressable>
  );
}

// Two big choices. Put this as the last child of the screen so it sits on top of everything.
export function PauseMenu({ onResume, onExit }: { onResume: () => void; onExit: () => void }) {
  return (
    <View style={st.veil}>
      <View style={st.card}>
        <Text style={st.title}>Paused</Text>
        <Pressable onPress={onResume} accessibilityRole="button" style={[st.btn, st.resume]}>
          <Image source={UI.play} style={st.btnIcon} />
          <Text style={st.btnText}>Resume</Text>
        </Pressable>
        <Pressable onPress={onExit} accessibilityRole="button" style={[st.btn, st.exit]}>
          <Text style={st.btnText}>Exit</Text>
        </Pressable>
        <Text style={st.note}>Exit goes back to the games.</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  round: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 44, height: 44 },
  veil: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, elevation: 100, backgroundColor: 'rgba(43,33,24,0.6)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { alignSelf: 'stretch', maxWidth: 340, backgroundColor: C.card, borderRadius: 26, borderWidth: 4, borderColor: WOOD_EDGE, padding: 22, alignItems: 'stretch', gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: C.dark, textAlign: 'center', marginBottom: 4, fontFamily: FONT },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 58, borderRadius: 18, borderWidth: 3, borderColor: WOOD_EDGE },
  resume: { backgroundColor: C.orange },
  exit: { backgroundColor: C.cream },
  btnIcon: { width: 26, height: 26 },
  btnText: { fontSize: 20, fontWeight: '800', color: C.ink, fontFamily: FONT },
  note: { fontSize: 13, fontWeight: '500', color: C.grey, textAlign: 'center', fontFamily: FONT },
});
