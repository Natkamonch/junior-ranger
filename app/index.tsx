import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, StatusBar, Platform, LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EMBEDDED, GAMES_MENU, SORT_ROUTE, CATCH_ROUTE, useBottomInset } from '../components/layout';
import { useRouter } from 'expo-router';
import { C } from '../assets/theme';
import { UI } from '../assets/uiImages';
import { ITEM_IMAGES } from '../assets/itemImages';
import { Wood, Meadow, WOOD, WOOD_EDGE } from '../components/Wood';

// The games menu. A child picks one big card and the game opens.
// Each game has a pause button with Exit, and Exit comes back here.
export default function Games() {
  const router = useRouter();
  const bottomInset = useBottomInset();
  const [body, setBody] = useState({ w: 0, h: 0 });

  return (
    <SafeAreaView style={s.screen} edges={EMBEDDED ? [] : ['top']}>
      <StatusBar barStyle="light-content" backgroundColor={WOOD} />

      <Wood style={s.banner}>
        <View style={s.title}>
          <Text style={s.titleText}>Pick a game</Text>
        </View>
      </Wood>

      <View
        style={s.body}
        onLayout={(e: LayoutChangeEvent) => setBody({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <Meadow width={body.w} height={body.h} />
        <View style={[s.cards, { paddingBottom: 18 + bottomInset }]}>
          <Pressable
            onPress={() => router.replace(SORT_ROUTE)}
            accessibilityRole="button"
            accessibilityLabel="Sort the rubbish"
            style={({ pressed }) => [s.card, pressed && s.pressed]}
          >
            <View style={s.art}>
              <Image source={UI.bin.red.closed} style={s.binSmall} />
              <Image source={UI.bin.yellow.closed} style={s.binSmall} />
              <Image source={UI.bin.green.closed} style={s.binSmall} />
            </View>
            <Text style={s.name}>Sort the rubbish</Text>
            <Text style={s.desc}>Pick the right bin for each thing.</Text>
            <View style={s.play}><Text style={s.playText}>Play</Text></View>
          </Pressable>

          <Pressable
            onPress={() => router.replace(CATCH_ROUTE)}
            accessibilityRole="button"
            accessibilityLabel="Catch the rubbish"
            style={({ pressed }) => [s.card, pressed && s.pressed]}
          >
            <View style={s.art}>
              <Image source={ITEM_IMAGES['plastic-drink-bottle']} style={s.fall} />
              <Image source={UI.bin.yellow.open} style={s.binBig} />
            </View>
            <Text style={s.name}>Catch the rubbish</Text>
            <Text style={s.desc}>Steer falling things into the right bin.</Text>
            <View style={s.play}><Text style={s.playText}>Play</Text></View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FONT = Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' });

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WOOD },
  banner: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, borderBottomWidth: 3, borderColor: WOOD_EDGE },
  title: { alignSelf: 'center', backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 26 },
  titleText: { fontSize: 20, fontWeight: '800', color: C.dark, fontFamily: FONT },

  body: { flex: 1, backgroundColor: '#CBEBF0', overflow: 'hidden' },
  cards: { flex: 1, padding: 18, gap: 16, justifyContent: 'center' },
  card: { flex: 1, maxHeight: 290, backgroundColor: C.card, borderRadius: 26, borderWidth: 4, borderColor: WOOD_EDGE, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  pressed: { transform: [{ scale: 0.97 }] },
  art: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 92, marginBottom: 6 },
  binSmall: { width: 84, height: 84, marginHorizontal: -4 },
  binBig: { width: 92, height: 92 },
  fall: { width: 64, height: 64, marginRight: 6, marginBottom: 22 },
  name: { fontSize: 24, fontWeight: '800', color: C.dark, textAlign: 'center', fontFamily: FONT },
  desc: { fontSize: 14, fontWeight: '500', color: C.grey, textAlign: 'center', marginTop: 2, marginBottom: 12, fontFamily: FONT },
  play: { backgroundColor: C.orange, borderRadius: 16, borderWidth: 3, borderColor: WOOD_EDGE, paddingVertical: 9, paddingHorizontal: 38 },
  playText: { fontSize: 18, fontWeight: '800', color: C.ink, fontFamily: FONT },
});
