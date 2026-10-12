import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { C } from '../assets/theme';
import { SCENE } from '../assets/uiImages';

// Shared look for the Sort and Catch screens.
export const WOOD = '#B3814E';
export const WOOD_EDGE = '#5A3A1E';
const MEADOW_W = 716;   // size of assets/scene/meadow.png
const MEADOW_H = 1040;

// A plank of wood. Children sit on top of the texture.
export function Wood({ style, children }: { style?: any; children?: React.ReactNode }) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: WOOD }, style]}>
      <Image source={SCENE.wood} style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} resizeMode="stretch" />
      {children}
    </View>
  );
}

// The meadow, fitted to the box and pinned to the bottom so the hills always sit behind the bins.
export function Meadow({ width, height }: { width: number; height: number }) {
  if (width <= 0 || height <= 0) return null;
  const k = Math.max(width / MEADOW_W, height / MEADOW_H);
  const w = MEADOW_W * k;
  const h = MEADOW_H * k;
  return (
    <Image
      source={SCENE.meadow}
      style={{ position: 'absolute', width: w, height: h, left: (width - w) / 2, top: height - h }}
    />
  );
}

// Two big buttons so a player can jump straight into either game.
export function ModeTabs({ active, onSort, onCatch, left }: { active: 'sort' | 'catch'; onSort: () => void; onCatch: () => void; left?: React.ReactNode }) {
  const tab = (on: boolean, label: string, press: () => void) => (
    <Pressable
      onPress={on ? undefined : press}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={[tabs.tab, on && tabs.on]}
    >
      <Text style={[tabs.text, on && tabs.textOn]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={tabs.row}>
      {left}
      {tab(active === 'sort', 'Sort the rubbish', onSort)}
      {tab(active === 'catch', 'Catch the rubbish', onCatch)}
    </View>
  );
}

const tabs = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tab: { flex: 1, height: 36, borderRadius: 12, borderWidth: 3, borderColor: WOOD_EDGE, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: C.greenDark },
  text: { fontSize: 13, fontWeight: '700', color: C.grey },
  textOn: { color: '#FFFBEF', fontWeight: '800' },
});
