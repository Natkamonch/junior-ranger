import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, ScrollView, Image,
  StyleSheet, Animated, StatusBar, Platform, PanResponder, LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EMBEDDED, GAMES_MENU, SORT_ROUTE, CATCH_ROUTE, useBottomInset } from '../components/layout';
import { useRouter } from 'expo-router';
import { ITEM_IMAGES } from '../assets/itemImages';
import { C } from '../assets/theme';
import { UI } from '../assets/uiImages';
import { Wood, Meadow, WOOD, WOOD_EDGE } from '../components/Wood';
import { PauseButton, PauseMenu } from '../components/PauseMenu';

/* To hear the item read out loud:
     npx expo install expo-speech
   then uncomment the import below and the line marked SPEAK. */
// import * as Speech from 'expo-speech';

/* ------------------------------------------------------------------
   ITEM LIST
   One line per item:   bin | picture | name | why
   picture is the file name in assets/items, without .png
   bin must be  red  yellow  or  green
------------------------------------------------------------------ */
const ITEMS = `
yellow | plastic-drink-bottle | Plastic drink bottle | Empty it, lid back on, and it can become a new bottle.
yellow | tin-can | Tin can | Metal gets melted down and used again.
yellow | cardboard-box | Cardboard box | Squash it flat so it doesn't fill the bin.
yellow | newspaper | Newspaper | Paper comes back as new paper.
yellow | glass-jar | Glass jar | Rinse it first. Whole jars only, not broken glass.
yellow | shampoo-bottle | Shampoo bottle | Hard plastic bottles from the bathroom count too.
yellow | glass-bottle | Glass bottle | Empty it and take the lid off first.
yellow | milk-carton | Milk carton | Cartons go in the yellow lid. Give it a rinse.
yellow | toilet-roll-tube | Toilet roll tube | The cardboard tube is fine, just not the paper.
yellow | envelope | Envelope | Paper envelopes are fine, even with the little window.
yellow | old-magazine | Old magazine | Shiny paper still gets recycled.
yellow | scrap-paper | Scrap paper | Loose paper counts, but not if it is shredded tiny.
yellow | juice-popper | Juice popper | Pull the straw off and put that in the red lid.
yellow | yoghurt-tub | Yoghurt tub | Rinse it. Hard plastic tubs are fine.
yellow | ice-cream-tub | Ice cream tub | Give it a quick wash first.
yellow | paper-bag | Paper bag | Clean paper bags can be recycled. Greasy ones go in the red bin.
yellow | old-schoolbook | Old schoolbook | Rip the plastic cover off first.
yellow | plastic-takeaway-container | Plastic takeaway container | Wash the food off and it can go around again.
yellow | honey-jar | Honey jar | Warm water helps get the last sticky bit out.
yellow | empty-spice-jar | Empty spice jar | Small glass jars still count.
yellow | tomato-sauce-bottle | Tomato sauce bottle | Squeeze bottles are fine once they are empty.
yellow | junk-mail | Junk mail | All that letterbox paper goes straight in.
yellow | old-worksheets | Old worksheets | Even the ones covered in red pen.
yellow | shopping-catalogue | Shopping catalogue | Same as a newspaper, straight in.
yellow | cardboard-folder | Cardboard folder | Cardboard ones only. Plastic ones go in the red lid.
yellow | last-years-calendar | Last year's calendar | Take the metal spiral off first.
yellow | tuna-tin | Tuna tin | Rinse the fishy bits out or your bin will smell.
yellow | pet-food-tin | Pet food tin | Same as any other tin, just wash it.
yellow | cardboard-mailer | Cardboard mailer | Peel the plastic tape off first.
yellow | laundry-liquid-bottle | Laundry liquid bottle | Big plastic bottles are fine, lid back on.
yellow | clean-foil-pie-tray | Clean foil pie tray | Scrunch clean foil into a ball so it does not get lost.
yellow | empty-deodorant-can | Empty deodorant can | Only when it is completely empty.
yellow | old-notebook | Old notebook | Pull the wire spiral out first.
yellow | cardboard-fruit-punnet | Cardboard fruit punnet | The cardboard ones, not the clear plastic ones.
yellow | pasta-sauce-jar | Pasta sauce jar | Rinse it out and take the lid off.
green | fallen-leaves | Fallen leaves | Leaves turn into mulch for gardens.
green | grass-clippings | Grass clippings | Straight from the mower to the green lid.
green | small-branch | Small branch | Little prunings are fine. Big logs are not.
green | dead-flowers | Dead flowers | Old flowers from the garden or a vase.
green | pulled-weeds | Pulled weeds | Shake the dirt off first.
green | hedge-clippings | Hedge clippings | Everything you trim off a bush goes here.
green | old-sunflower-stalk | Old sunflower stalk | When the plant is finished it feeds the next garden.
green | real-christmas-tree | Real Christmas tree | Chop it into pieces so the lid still shuts.
green | palm-fronds | Palm fronds | Cut the big ones down so the lid closes.
green | bamboo-cuttings | Bamboo cuttings | Bamboo grows fast, so there is always plenty.
green | old-cactus | Old cactus | Wear gloves before you pick it up.
green | dead-lavender-bush | Dead lavender bush | Pull it out roots and all.
green | bark-and-gum-nuts | Bark and gum nuts | Everything that drops off a gum tree.
green | vine-trimmings | Vine trimmings | Long vines are easier if you cut them up.
green | dry-lawn-thatch | Dry lawn thatch | The dead grass you rake out of the lawn.
green | storm-branches | Storm branches | Whatever the wind knocks down, if it fits.
green | finished-bulb-plants | Finished bulb plants | When the flowers are done the leaves go too.
green | fallen-blossom | Fallen blossom | Sweep it up off the path.
green | dead-hibiscus-flowers | Dead hibiscus flowers | Straight off the bush into the green lid.
green | spent-daisies | Spent daisies | Deadheading gives you more flowers later.
green | dead-pot-plant | Dead pot plant | The plant and the soil go in. The pot does not.
green | clover-weeds | Clover weeds | Weeds count as garden waste, lucky or not.
green | corn-stalks | Corn stalks | The whole plant once the corn is picked.
green | old-tomato-plant | Old tomato plant | Pull it out when it stops fruiting.
green | bolted-lettuce-plant | Bolted lettuce plant | When lettuce shoots up tall it is finished.
green | bamboo-stakes | Bamboo stakes | Plain untreated ones only, nothing painted.
green | pumpkin-vine | Pumpkin vine | The vine goes in, and it is very long.
green | grape-vine-cuttings | Grape vine cuttings | Winter prunings fill the bin fast.
green | lawn-toadstools | Lawn toadstools | They pop up after rain and go in the green lid.
green | old-bouquet | Old bouquet | Pull the ribbon and plastic wrap off first.
red | lolly-wrapper | Lolly wrapper | Crinkly wrappers are too small to recycle.
red | plastic-bag | Plastic bag | Soft plastic jams the recycling machines.
red | old-toothbrush | Old toothbrush | Too many materials stuck together.
red | broken-globe | Broken globe | It smashes in the truck. Some councils have a drop-off.
red | popped-balloon | Popped balloon | Balloons are rubbish, and never let go outside.
red | used-bandaid | Used bandaid | Anything with germs goes in the red lid.
red | empty-pen | Empty pen | Too small for the sorting machines to catch.
red | worn-out-sock | Worn-out sock | Too ripped to give away, so it is rubbish.
red | greasy-pizza-box | Greasy pizza box | Cardboard with food and oil on it cannot be recycled.
red | takeaway-coffee-cup | Takeaway coffee cup | Looks like paper, but it is lined with plastic inside.
red | bubble-tea-cup | Bubble tea cup | Cup, film and straw are three plastics stuck together.
red | broken-mirror | Broken mirror | Mirror glass is different to bottle glass. Wrap it first.
red | broken-toy | Broken toy | Toys are too mixed up to pull apart.
red | old-sponge | Old sponge | Sponges fall to bits, so they go in the red lid.
red | old-cd | Old CD | Nothing at the kerb can recycle these.
red | shop-receipt | Shop receipt | Shiny receipt paper is coated, so it is not real paper.
red | glittery-wrapping-paper | Glittery wrapping paper | Glitter and foil stop it being recycled. Plain paper is fine.
red | bread-bag | Bread bag | Another soft plastic that tangles the machines.
red | broken-shoe | Broken shoe | If nobody can wear it, it is rubbish.
red | takeaway-noodle-box | Takeaway noodle box | Food and grease soak right into the cardboard.
red | old-thong | Old thong | Rubber and foam glued together cannot be split up.
red | old-cap | Old cap | Fabric does not go in any bin at home.
red | ripped-t-shirt | Ripped t-shirt | If it is too torn to donate, the red lid it is.
red | torn-jeans | Torn jeans | Cut them into rags first if you can use them.
red | broken-schoolbag | Broken schoolbag | Zips, fabric and plastic all stuck together.
red | old-handbag | Old handbag | Try a charity bin first. Broken ones are rubbish.
red | broken-sunglasses | Broken sunglasses | Lenses and frames are different plastics.
red | broken-watch | Broken watch | Take the battery out and drop that at a shop.
red | broken-jewellery | Broken jewellery | Too small and mixed for the sorting machines.
red | broken-umbrella | Broken umbrella | Metal, fabric and plastic all in one.
red | tangled-thread | Tangled thread | Thread wraps around the machinery.
red | old-wool-scraps | Old wool scraps | Short leftover bits nobody can knit with.
red | blunt-scissors | Blunt scissors | Wrap the blades in paper so nobody gets cut.
red | snapped-ruler | Snapped ruler | Hard plastic like this is not accepted at the kerb.
red | pencil-stub | Pencil stub | Wood and graphite, too small to sort.
red | broken-crayons | Broken crayons | Melt them into new crayons, or red lid.
red | drawing-pins | Drawing pins | Wrap sharp things up before they go in.
red | paper-clips | Paper clips | Metal, but far too small for the machines.
red | bent-safety-pin | Bent safety pin | Close it first so nobody gets a surprise.
red | disposable-razor | Disposable razor | Wrap the blade in paper first.
red | soap-pump-top | Soap pump top | The bottle is recycling. The pump is rubbish.
red | old-shower-head | Old shower head | Metal and plastic screwed together.
red | old-plunger | Old plunger | Rubber and a wooden handle, both rubbish.
red | lost-dice | Lost dice | Tiny hard plastic, straight to the red lid.
red | used-sticky-tape | Used sticky tape | Sticky tape cannot be recycled, so it goes in the red bin.
red | torn-playing-cards | Torn playing cards | Cards are coated in plastic, not plain paper.
red | crusty-paintbrush | Crusty paintbrush | Dried paint means it cannot be cleaned up.
red | odd-glove | Odd glove | One glove on its own is no use to anyone.
red | ripped-scarf | Ripped scarf | Fabric again, so the red lid.
red | old-eraser | Old eraser | Rubber and plastic cannot be recycled, so it goes in the red bin.
red | cracked-boomerang-toy | Cracked boomerang toy | A cracked one is not safe to throw.
red | puzzle-with-missing-pieces | Puzzle with missing pieces | Cardboard, but coated so it cannot be recycled.
red | chocolate-wrapper | Chocolate wrapper | The shiny foil inside stops it being recycled.
red | lollipop-stick | Lollipop stick | Far too small for the sorting machines.
red | ice-cream-wrapper | Ice cream wrapper | Soft, shiny wrappers all go in the red lid.
red | plastic-straw | Plastic straw | Straws fall through every machine in the plant.
red | plastic-fork | Plastic fork | Takeaway cutlery is too small and too dirty.
red | plastic-spoon | Plastic spoon | Same as the fork, straight in the red lid.
red | chipped-plate | Chipped plate | Plate ceramic melts at a different heat to bottles.
red | cracked-teapot | Cracked teapot | Wrap the sharp bits before you bin it.
red | chipped-mug | Chipped mug | Mugs are ceramic, not glass, so no yellow lid.
red | cracked-bucket | Cracked bucket | Buckets are not packaging, so the kerb will not take them.
red | worn-out-broom | Worn out broom | Bristles, plastic and a handle in one piece.
red | broken-window-glass | Broken window glass | Window glass is not the same as bottle glass. Wrap it.
red | candle-stub | Candle stub | Wax cannot be recycled at home.
red | old-ribbon | Old ribbon | Ribbon tangles in the machines like string does.
red | ripped-shorts | Ripped shorts | Too worn to pass on, so the red lid.
red | worn-out-jacket | Worn out jacket | Charity bin first. Only bin it if it is wrecked.
red | stained-dress | Stained dress | If the stain will not come out, it is rubbish.
red | old-lipstick | Old lipstick | The tube is too small and too mixed to recycle.
red | broken-comb | Broken comb | Thin hard plastic, straight in the red lid.
red | used-tissues | Used tissues | Anything with germs on it goes in the red lid.
red | used-face-mask | Used face mask | Never leave one on the ground. Red lid every time.
red | old-video-tape | Old video tape | The tape inside wraps around everything.
red | scratched-dvd | Scratched DVD | Same as a CD, nothing at the kerb wants it.
red | broken-picture-frame | Broken picture frame | Glass, wood and clips, all stuck together.
red | broken-dartboard | Broken dartboard | Cork and wire in one lump.
red | deflated-ball | Deflated ball | Once it will not hold air it is rubbish.
red | snapped-table-tennis-bat | Snapped table tennis bat | Rubber glued to wood cannot be split.
red | torn-kite | Torn kite | Plastic sheet and sticks, both rubbish.
red | frayed-rope | Frayed rope | Rope is the worst thing for tangling machines.
red | broken-fridge-magnet | Broken fridge magnet | Magnet and plastic glued together.
red | key-that-fits-nothing | Key that fits nothing | Too small to sort, so the red lid.
red | greasy-popcorn-bag | Greasy popcorn bag | The grease soaks in and ruins the paper.
red | chip-packet | Chip packet | Silver on the inside means it is not recyclable.
`;

const ROUND_SIZE = 15;    // items in one play
const AUTO_NEXT_RIGHT = 600;  // ms before the next item after a right answer
// after a wrong answer there is no timer: the child reads the reason and taps Next
const PERFECT_BONUS = 10; // ROUND_SIZE + PERFECT_BONUS = points for full marks

type Bin = 'red' | 'yellow' | 'green';
type Item = { bin: Bin; pic: string; name: string; why: string };
type Rect = { x: number; y: number; w: number; h: number };


const BINS: Record<Bin, { name: string; top: string; sub: string; solid: string; soft: string }> = {
  red:    { name: 'red lid',    top: 'Red lid',    sub: 'Rubbish',   solid: '#D14B3C', soft: '#FBE4E0' },
  yellow: { name: 'yellow lid', top: 'Yellow lid', sub: 'Recycling', solid: '#E7B32B', soft: '#FCE59A' },
  green:  { name: 'green lid',  top: 'Green lid',  sub: 'Garden',    solid: '#3E8E4F', soft: '#E2F0E4' },
};
const ORDER: Bin[] = ['red', 'yellow', 'green'];
const YAY = ['Yes!', 'Spot on.', 'Got it.', 'Nice one.', "That's the one."];

const POOL: Record<Bin, Item[]> = { red: [], yellow: [], green: [] };
ITEMS.trim().split('\n').forEach((line) => {
  const p = line.split('|').map((v) => v.trim());
  const bin = p[0] as Bin;
  if (p.length < 4 || !POOL[bin]) return;
  POOL[bin].push({ bin, pic: p[1], name: p[2], why: p[3] });
});

function shuffle<T>(a: T[]): T[] {
  return a.map((v) => [Math.random(), v] as [number, T]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);
}

function buildRound(): Item[] {
  const keys = ORDER.filter((k) => POOL[k].length);
  const each = Math.floor(ROUND_SIZE / keys.length);
  const picked: Item[] = [];
  keys.forEach((k) => picked.push(...shuffle(POOL[k]).slice(0, Math.min(each, POOL[k].length))));
  const spare = shuffle(([] as Item[]).concat(...keys.map((k) => POOL[k])).filter((x) => picked.indexOf(x) < 0));
  while (picked.length < ROUND_SIZE && spare.length) picked.push(spare.pop() as Item);
  return shuffle(picked);
}

export default function Sort() {
  const router = useRouter();
  const bottomInset = useBottomInset();
  const [round, setRound] = useState<Item[]>(buildRound);
  const [at, setAt] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [missed, setMissed] = useState<Item[]>([]);
  const [picked, setPicked] = useState<Bin | null>(null);
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState<Bin | null>(null);   // bin the finger is over
  const [dragging, setDragging] = useState(false);
  const [body, setBody] = useState({ w: 0, h: 0 });

  const item = round[at];
  const answered = picked !== null;
  const right = answered && picked === item.bin;

  const pan = useRef(new Animated.ValueXY()).current;
  const enter = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const lids = useRef<Record<Bin, Animated.Value>>({
    red: new Animated.Value(0),
    yellow: new Animated.Value(0),
    green: new Animated.Value(0),
  }).current;

  // where each bin sits on screen, so we know what the kid dropped on
  const rects = useRef<Record<Bin, Rect | null>>({ red: null, yellow: null, green: null });
  const binRefs = useRef<Record<Bin, View | null>>({ red: null, yellow: null, green: null });

  const answeredRef = useRef(false);
  const chooseRef = useRef<(b: Bin) => void>(() => {});
  const nextRef = useRef<() => void>(() => {});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  answeredRef.current = answered;

  // pause: stop a pending auto-advance and pick it up again on Resume
  const [paused, setPaused] = useState(false);
  const resumeNext = useRef(false);
  function pause() {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; resumeNext.current = true; }
    setPaused(true);
  }
  function resume() {
    setPaused(false);
    if (resumeNext.current) {
      resumeNext.current = false;
      timer.current = setTimeout(() => { timer.current = null; nextRef.current(); }, AUTO_NEXT_RIGHT);
    }
  }
  function exitGame() {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    router.replace(GAMES_MENU);
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    enter.setValue(0);
    Animated.spring(enter, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
  }, [at, done, enter]);

  function measure(k: Bin) {
    const node = binRefs.current[k];
    if (node && node.measureInWindow) {
      node.measureInWindow((x, y, w, h) => {
        rects.current[k] = { x, y, w, h };
      });
    }
  }

  function hitTest(x: number, y: number): Bin | null {
    for (const k of ORDER) {
      const r = rects.current[k];
      if (r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return k;
    }
    return null;
  }

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !answeredRef.current,
      onMoveShouldSetPanResponder: () => !answeredRef.current,
      onPanResponderGrant: () => setDragging(true),
      onPanResponderMove: (_e, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
        setHover(hitTest(g.moveX, g.moveY));
      },
      onPanResponderRelease: (_e, g) => {
        setDragging(false);
        const bin = hitTest(g.moveX, g.moveY);
        setHover(null);
        if (bin) chooseRef.current(bin);
        else Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        setHover(null);
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
      },
    }),
  ).current;

  function speak(text: string) {
    // SPEAK
    // Speech.speak(text, { language: 'en-AU', rate: 0.9, pitch: 1.1 });
  }

  function choose(bin: Bin) {
    if (answeredRef.current) return;
    setPicked(bin);
    answeredRef.current = true;

    Animated.timing(lids[bin], { toValue: 1, duration: 220, useNativeDriver: true }).start();

    // a right answer moves on by itself. A wrong one waits for the child to tap Next
    if (timer.current) clearTimeout(timer.current);
    if (bin === item.bin) timer.current = setTimeout(() => { timer.current = null; nextRef.current(); }, AUTO_NEXT_RIGHT);

    if (bin === item.bin) {
      setHearts((h) => h + 1);
      Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: true }).start();
    } else {
      setMissed((m) => [...m, item]);
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: true }).start();
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0.5, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.timing(lids[bin], { toValue: 0, duration: 220, useNativeDriver: true }).start();
      }, 700);
    }
  }
  chooseRef.current = choose;

  function reset() {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    ORDER.forEach((k) => lids[k].setValue(0));
    pan.setValue({ x: 0, y: 0 });
    shake.setValue(0);
    fade.setValue(1);
    setPicked(null);
    answeredRef.current = false;
  }

  function next() {
    reset();
    if (at === round.length - 1) setDone(true);
    else setAt(at + 1);
  }

  nextRef.current = next;

  function replay() {
    reset();
    setRound(buildRound());
    setAt(0);
    setHearts(0);
    setMissed([]);
    setDone(false);
  }

  const bonus = hearts === round.length ? PERFECT_BONUS : 0;
  const points = hearts + bonus;
  const pct = Math.round(((done ? round.length : at) / round.length) * 100);

  const marks = [
    { min: round.length,     pic: 'head', rank: 'Head ranger',        line: 'Every one right. The bins are lucky to have you.' },
    { min: round.length - 2, pic: 'top', rank: 'Top sorter',         line: 'Almost perfect.' },
    { min: round.length - 5, pic: 'good', rank: 'Good sorter',        line: 'You know your lids.' },
    { min: -1,               pic: 'new', rank: 'Sorter in training', line: 'Have another go and watch your hearts climb.' },
  ];
  const mark = marks.find((m) => hearts >= m.min) ?? marks[marks.length - 1];

  const itemStyle = {
    opacity: Animated.multiply(enter, fade),
    zIndex: dragging ? 50 : 1,
    elevation: dragging ? 12 : 0,
    transform: [
      { translateX: Animated.add(pan.x, shake.interpolate({ inputRange: [-1, 1], outputRange: [-12, 12] })) },
      { translateY: Animated.add(pan.y, enter.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] })) },
      { scale: Animated.multiply(
          dragging ? 1.08 : 1,
          fade.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
        ) },
    ],
  };

  return (
    <SafeAreaView style={s.screen} edges={EMBEDDED ? [] : ['top']}>
      <StatusBar barStyle="light-content" backgroundColor={WOOD} />

      <Wood style={s.banner}>
        <View style={s.bannerRow}>
          <View style={s.plaque}>
            <Image source={UI.heartFull} style={s.heartImg} />
            <View>
              <Text style={s.plaqueLabel}>HEARTS</Text>
              <Text style={s.plaqueNum}>{hearts}</Text>
            </View>
          </View>
          <View style={s.level}>
            <Text style={s.levelText}>ITEM {done ? round.length : at + 1} OF {round.length}</Text>
            <View style={s.levelTrack}>
              <View style={[s.levelFill, { flex: pct }]} />
              <View style={{ flex: 100 - pct }} />
            </View>
          </View>
          <PauseButton onPress={pause} />
        </View>
      </Wood>

      <View
        style={s.body}
        onLayout={(e: LayoutChangeEvent) => setBody({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <Meadow width={body.w} height={body.h} />
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: 16 + bottomInset }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!dragging}
      >
        {!done ? (
          <>
            <View style={s.card}>
              <Pressable
                style={s.speak}
                hitSlop={8}
                accessibilityLabel="Read this out loud"
                onPress={() => speak(item.name + '. Which bin does it go in?')}
              >
                <Image source={UI.speaker} style={s.speakImg} />
              </Pressable>

              {round[at + 1] ? (
                <Image source={ITEM_IMAGES[round[at + 1].pic]} style={s.preload} />
              ) : null}

              <Animated.View style={[s.itemWrap, itemStyle]} {...responder.panHandlers}>
                <View style={[s.tile, dragging && s.tileLifted]}>
                  <Image source={ITEM_IMAGES[item.pic]} style={s.tileImg} resizeMode="contain" />
                </View>
                <Text style={s.itemName}>{item.name}</Text>
              </Animated.View>
            </View>

            <View style={s.lower}>
            <View style={s.bins}>
              {ORDER.map((k) => {
                const b = BINS[k];
                const isAnswer = answered && !right && k === item.bin;
                const isRight = answered && right && k === picked;
                const isHover = hover === k;
                return (
                  <Pressable
                    key={k}
                    ref={(r) => { binRefs.current[k] = r as unknown as View; }}
                    onLayout={() => measure(k)}
                    onPress={() => choose(k)}
                    disabled={answered}
                    accessibilityRole="button"
                    accessibilityLabel={b.top + ', ' + b.sub}
                    style={[
                      s.bin,
                      { backgroundColor: b.soft },
                      isHover && { borderColor: b.solid, transform: [{ scale: 1.05 }] },
                      isAnswer && { borderColor: C.orange },
                      isRight && { borderColor: b.solid },
                    ]}
                  >
                    <View style={s.can}>
                      <Animated.Image source={UI.bin[k].closed} style={[s.canImg, { opacity: lids[k].interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} />
                      <Animated.Image source={UI.bin[k].open} style={[s.canImg, { opacity: lids[k] }]} />
                    </View>
                    <Text style={s.binLabel}>{b.top}{'\n'}{b.sub}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.talk}>
              {!answered ? (
                <>
                  <Text style={s.verdict}>Where does this go?</Text>
                  <Text style={s.why}>Drag it into a bin, or just tap one.</Text>
                </>
              ) : right ? (
                <>
                  <Text style={[s.verdict, { color: C.greenDark }]}>{YAY[at % YAY.length]}</Text>
                  <Text style={s.why}>{item.why}</Text>
                </>
              ) : (
                <>
                  <Text style={[s.verdict, { color: C.dark }]}>Not that one.</Text>
                  <Text style={s.why}>{item.name} goes in the {BINS[item.bin].name}. {item.why}</Text>
                  <Pressable onPress={next} accessibilityRole="button" style={s.nextBtn}>
                    <Text style={s.ctaText}>{at === round.length - 1 ? 'See my score' : 'Next'}</Text>
                  </Pressable>
                </>
              )}
            </View>

            </View>
          </>
        ) : (
          <View style={s.lower}>
            <View style={s.end}>
              <View style={s.badge}><Image source={UI.rank[mark.pic as 'head' | 'top' | 'good' | 'new']} style={s.badgeImg} /></View>
              <Text style={s.rank}>{mark.rank}</Text>
              <Text style={s.tally}>You earned {hearts} of {round.length} hearts. {mark.line}</Text>

              <View style={[s.points, bonus > 0 && { backgroundColor: C.green }]}>
                <Text style={s.pointsBig}>+{points} points</Text>
                <Text style={s.pointsSmall}>
                  {bonus
                    ? hearts + ' for sorting, ' + bonus + ' perfect bonus.'
                    : hearts + ' for sorting. Get all ' + round.length + ' right for a ' + PERFECT_BONUS + ' point bonus.'}
                </Text>
              </View>

              <View style={s.missed}>
                <Text style={s.missedTitle}>{missed.length ? 'Worth remembering' : 'Nothing to fix'}</Text>
                {missed.length ? (
                  missed.map((x, i) => (
                    <View key={i} style={s.missedRow}>
                      <Image source={ITEM_IMAGES[x.pic]} style={s.missedImg} resizeMode="contain" />
                      <Text style={[s.missedLine, s.missedText]}>
                        {x.name} {'\u2192'} {BINS[x.bin].name}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={s.missedLine}>You put every single thing in the right bin.</Text>
                )}
              </View>
            </View>

            <Pressable style={s.cta} onPress={replay}>
              <Text style={s.ctaText}>Play again</Text>
            </Pressable>

            <Pressable style={s.link} onPress={exitGame}>
              <Text style={s.linkText}>Back to games</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      </View>

      {paused && <PauseMenu onResume={resume} onExit={exitGame} />}
    </SafeAreaView>
  );
}

const FONT = Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' });

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WOOD },

  banner: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, gap: 8, borderBottomWidth: 3, borderColor: WOOD_EDGE },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ribbon: { flex: 1, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  ribbonTitle: { color: C.dark, fontSize: 15, fontWeight: '800', letterSpacing: 1.5, fontFamily: FONT },
  ribbonSub: { color: C.grey, fontSize: 10, fontWeight: '600', fontFamily: FONT, marginTop: -1 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, alignItems: 'center', justifyContent: 'center' },
  playImg: { width: 24, height: 24 },
  plaque: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  heartImg: { width: 22, height: 22 },
  plaqueLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: C.grey, fontFamily: FONT },
  plaqueNum: { fontSize: 18, fontWeight: '800', color: C.dark, lineHeight: 20, fontFamily: FONT },
  level: { flex: 1.3, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, justifyContent: 'center', minHeight: 42 },
  levelText: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: C.dark, fontFamily: FONT },
  levelTrack: { flexDirection: 'row', height: 9, borderRadius: 5, backgroundColor: C.light, borderWidth: 1.5, borderColor: WOOD_EDGE, marginTop: 3, overflow: 'hidden' },
  levelFill: { backgroundColor: C.green },

  footer: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, borderTopWidth: 3, borderColor: WOOD_EDGE },
  body: { flex: 1, backgroundColor: '#CBEBF0', overflow: 'hidden' },
  scroll: { flexGrow: 1, justifyContent: 'space-between', gap: 14, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  lower: { gap: 12 },

  card: { backgroundColor: 'rgba(255,251,239,0.94)', borderRadius: 24, borderWidth: 3, borderColor: WOOD_EDGE, paddingVertical: 22, paddingHorizontal: 18, flex: 1, minHeight: 280, justifyContent: 'center' },
  speak: {
    position: 'absolute', top: 12, right: 12, width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },
  speakImg: { width: 30, height: 30 },
  itemWrap: { alignItems: 'center' },
  tile: { width: 176, height: 176, borderRadius: 40, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center' },
  tileLifted: {
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 },
  },
  tileImg: { width: 152, height: 152 },
  itemName: { fontSize: 26, fontWeight: '800', color: C.ink, marginTop: 16, textAlign: 'center', fontFamily: FONT },

  bins: { flexDirection: 'row', gap: 10 },
  bin: { flex: 1, borderRadius: 20, borderWidth: 2, borderColor: 'transparent', paddingTop: 12, paddingBottom: 10, alignItems: 'center' },
  can: { width: 100, height: 100 },
  canImg: { position: 'absolute', top: 0, left: 0, width: 100, height: 100 },
  binLabel: { fontSize: 12.5, fontWeight: '600', color: C.ink, textAlign: 'center', marginTop: 8, lineHeight: 16, fontFamily: FONT },

  talk: { backgroundColor: C.light, borderRadius: 20, borderWidth: 3, borderColor: WOOD_EDGE, padding: 14, minHeight: 104, justifyContent: 'center' },
  nextBtn: { alignSelf: 'flex-end', marginTop: 10, backgroundColor: C.orange, borderRadius: 14, borderWidth: 3, borderColor: WOOD_EDGE, paddingVertical: 8, paddingHorizontal: 22 },
  preload: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  verdict: { fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: FONT },
  why: { fontSize: 14, fontWeight: '500', color: C.grey, lineHeight: 20, fontFamily: FONT },

  link: { paddingVertical: 10, alignItems: 'center', backgroundColor: C.cream, borderRadius: 14, borderWidth: 3, borderColor: WOOD_EDGE },
  linkText: { color: C.dark, fontSize: 15, fontWeight: '700', fontFamily: FONT, textDecorationLine: 'underline' },
  cta: { backgroundColor: C.orange, borderRadius: 16, borderWidth: 3, borderColor: WOOD_EDGE, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: C.ink, fontSize: 16, fontWeight: '700', fontFamily: FONT },

  end: { backgroundColor: C.card, borderRadius: 22, padding: 22, alignItems: 'center' },
  badge: { width: 104, height: 104, borderRadius: 52, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  badgeImg: { width: 88, height: 88 },
  rank: { fontSize: 23, fontWeight: '800', color: C.dark, marginBottom: 6, fontFamily: FONT },
  tally: { fontSize: 14, fontWeight: '500', color: C.grey, textAlign: 'center', marginBottom: 16, lineHeight: 20, fontFamily: FONT },

  points: { alignSelf: 'stretch', backgroundColor: C.orange, borderRadius: 16, padding: 14, marginBottom: 14 },
  pointsBig: { color: C.ink, fontSize: 23, fontWeight: '800', fontFamily: FONT },
  pointsSmall: { color: C.ink, fontSize: 12.5, fontWeight: '500', marginTop: 2, lineHeight: 17, fontFamily: FONT },

  missed: { alignSelf: 'stretch', backgroundColor: C.card, borderRadius: 16, padding: 14 },
  missedTitle: { fontSize: 13.5, fontWeight: '700', color: C.ink, marginBottom: 6, fontFamily: FONT },
  missedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  missedImg: { width: 34, height: 34 },
  missedText: { flex: 1 },
  missedLine: { fontSize: 13, fontWeight: '500', color: C.grey, lineHeight: 22, fontFamily: FONT },
});
