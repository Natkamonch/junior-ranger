import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Image,
  StatusBar, Platform, PanResponder, Dimensions, LayoutChangeEvent, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EMBEDDED, GAMES_MENU, SORT_ROUTE, CATCH_ROUTE, useBottomInset } from '../components/layout';
import { useRouter } from 'expo-router';
import { ITEM_IMAGES } from '../assets/itemImages';
import { C } from '../assets/theme';
import { UI } from '../assets/uiImages';
import { Wood, Meadow, WOOD, WOOD_EDGE } from '../components/Wood';
import { PauseButton, PauseMenu } from '../components/PauseMenu';

/* ------------------------------------------------------------------
   CATCH MODE
   Rubbish falls from the top. The kid steers it into the right bin
   by dragging it sideways, or by tapping the bin they want.
   Three mistakes and the game ends.

   Item list format:  bin | picture | name | why
   (picture is the file name in assets/items, without .png)
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

const MAX_LIVES = 3;
const NEXT_DELAY_RIGHT = 500;   // ms before the next item after a catch
const NEXT_DELAY_OTHER = 1100;  // ms after a wrong bin or a miss, so the hint can be read
const START_SPEED = 1.1;
const SPEED_STEP = 0.06;
const MAX_SPEED = 3.2;
const LOSE_LIFE_ON_WRONG_BIN = true;   // false = only a miss costs a life

type Bin = 'red' | 'yellow' | 'green';
type Item = { bin: Bin; pic: string; name: string; why: string };


const BINS: Record<Bin, { name: string; sub: string; solid: string; soft: string }> = {
  red:    { name: 'red lid',    sub: 'Rubbish',   solid: '#D14B3C', soft: '#FBE4E0' },
  yellow: { name: 'yellow lid', sub: 'Recycling', solid: '#E7B32B', soft: '#FCE59A' },
  green:  { name: 'green lid',  sub: 'Garden',    solid: '#3E8E4F', soft: '#E2F0E4' },
};
const ORDER: Bin[] = ['red', 'yellow', 'green'];

const POOL: Item[] = [];
ITEMS.trim().split('\n').forEach((line) => {
  const p = line.split('|').map((v) => v.trim());
  const bin = p[0] as Bin;
  if (p.length < 4 || !BINS[bin]) return;
  POOL.push({ bin, pic: p[1], name: p[2], why: p[3] });
});

const SCREEN_W = Dimensions.get('window').width;
const PAD = 16;
const FIELD_W = SCREEN_W - PAD * 2;
const FALLER_W = 84;
const GUTTER = 8;
const BIN_W = Math.min(100, (FIELD_W - GUTTER * 2 - 12) / 3);
const SPARE = FIELD_W - BIN_W * 3;
const EDGE = SPARE / 6;                       // even spacing, bins not jammed to the walls
const GAP = SPARE / 3;
const BIN_X: Record<Bin, number> = {
  red: EDGE,
  yellow: EDGE + BIN_W + GAP,
  green: EDGE + (BIN_W + GAP) * 2,
};
const BIN_CENTRE: Record<Bin, number> = {
  red: BIN_X.red + BIN_W / 2,
  yellow: BIN_X.yellow + BIN_W / 2,
  green: BIN_X.green + BIN_W / 2,
};
const CATCH_RADIUS = BIN_W / 2 + 10;
const BIN_H = 120;          // bin tile height
const GROUND_H = 8;        // grass the bins stand on
const WOOD_LEVELS = 5;      // items per level

/* ---------- small visual helpers ---------- */

// confetti and a "+10" when the item goes in the right bin
const CONFETTI = ['#F5B82E', '#E7B32B', '#3E8E4F', '#D14B3C', '#8DB255', '#FFFBEF'];
const PIECES = Array.from({ length: 16 }).map((_, i) => {
  const a = (i / 16) * Math.PI * 2 + (i % 2) * 0.2;
  const dist = 34 + (i % 3) * 14;
  return { dx: Math.cos(a) * dist, up: Math.sin(a) * dist - 22, fall: 24 + (i % 4) * 6, colour: CONFETTI[i % CONFETTI.length], w: 6 + (i % 3) * 2 };
});
function Burst({ left, top, text }: { left: number; top: number; text: string }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(p, { toValue: 1, duration: 850, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [p]);
  return (
    <View style={{ position: 'absolute', left, top, width: 0, height: 0 }} pointerEvents="none">
      {PIECES.map((c, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute', width: c.w, height: c.w * 1.5, borderRadius: 2, backgroundColor: c.colour,
            opacity: p.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, c.dx] }) },
              { translateY: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, c.up, c.up + c.fall] }) },
              { rotate: p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', (i % 2 ? 300 : -300) + 'deg'] }) },
            ],
          }}
        />
      ))}
      <Animated.Text
        style={{
          position: 'absolute', left: -30, width: 60, textAlign: 'center', fontSize: 22, fontWeight: '800', color: C.dark,
          textShadowColor: '#FFFBEF', textShadowRadius: 3, textShadowOffset: { width: 0, height: 0 },
          opacity: p.interpolate({ inputRange: [0, 0.15, 0.75, 1], outputRange: [0, 1, 1, 0] }),
          transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [-20, -68] }) }],
        }}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

export default function CatchScreen() {
  const router = useRouter();
  const bottomInset = useBottomInset();

  const [item, setItem] = useState<Item>(() => POOL[Math.floor(Math.random() * POOL.length)]);
  const [caught, setCaught] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [hint, setHint] = useState('Drag the item sideways, or tap the bin you want.');
  const [flash, setFlash] = useState<{ text: string; colour: string } | null>(null);
  const [over, setOver] = useState(false);
  const [near, setNear] = useState<Bin | null>(null);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fieldH, setFieldH] = useState(0);
  const [burst, setBurst] = useState<{ id: number; left: number; top: number } | null>(null);

  const x = useRef((FIELD_W - FALLER_W) / 2);
  const y = useRef(-100);
  const speed = useRef(START_SPEED);
  const target = useRef<Bin | null>(null);
  const busy = useRef(false);
  const deadRef = useRef(false);
  const pausedRef = useRef(false);
  const livesRef = useRef(MAX_LIVES);
  const itemRef = useRef(item);
  const dragFrom = useRef(0);
  const landY = useRef(0);        // set once the field has measured itself

  const posX = useRef(new Animated.Value(x.current)).current;
  const posY = useRef(new Animated.Value(y.current)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lids = useRef<Record<Bin, Animated.Value>>({
    red: new Animated.Value(0),
    yellow: new Animated.Value(0),
    green: new Animated.Value(0),
  }).current;
  // bin "chomp" when it takes an item, 0 to 3 is one squash and bounce
  const chomp = useRef<Record<Bin, Animated.Value>>({
    red: new Animated.Value(0),
    yellow: new Animated.Value(0),
    green: new Animated.Value(0),
  }).current;

  itemRef.current = item;
  pausedRef.current = paused;

  const onFieldLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    landY.current = h - GROUND_H - BIN_H + 18;   // item meets the bin mouth
    setFieldH(h);
  }, []);

  const nearestBin = useCallback((): Bin | null => {
    const centre = x.current + FALLER_W / 2;
    let best: Bin | null = null;
    let bd = Infinity;
    ORDER.forEach((k) => {
      const d = Math.abs(centre - BIN_CENTRE[k]);
      if (d < bd) { bd = d; best = k; }
    });
    return bd <= CATCH_RADIUS ? best : null;
  }, []);

  const spawn = useCallback(() => {
    const next = POOL[Math.floor(Math.random() * POOL.length)];
    setItem(next);
    itemRef.current = next;
    x.current = 10 + Math.random() * Math.max(10, FIELD_W - FALLER_W - 20);
    y.current = -100;
    posX.setValue(x.current);
    posY.setValue(y.current);
    fade.setValue(1);
    scale.setValue(1);
    target.current = null;
    setNear(null);
    busy.current = false;
  }, [fade, posX, posY, scale]);

  const showFlash = useCallback((text: string, colour: string) => {
    setFlash({ text, colour });
    setTimeout(() => setFlash(null), 800);
  }, []);

  const openLid = useCallback((k: Bin) => {
    Animated.sequence([
      Animated.timing(lids[k], { toValue: 1, duration: 170, useNativeDriver: false }),
      Animated.delay(320),
      Animated.timing(lids[k], { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  }, [lids]);

  const chompBin = useCallback((k: Bin) => {
    chomp[k].setValue(0);
    Animated.timing(chomp[k], { toValue: 3, duration: 420, easing: Easing.linear, useNativeDriver: true }).start();
  }, [chomp]);

  const loseLife = useCallback((msg: string) => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    setHint(msg);
    if (livesRef.current <= 0) {
      deadRef.current = true;
      setTimeout(() => setOver(true), 650);
      return true;
    }
    return false;
  }, []);

  // item visibly drops into the bin rather than just vanishing
  const dropIn = useCallback((k: Bin) => {
    Animated.parallel([
      Animated.timing(posX, { toValue: BIN_CENTRE[k] - FALLER_W / 2, duration: 260, useNativeDriver: false }),
      Animated.timing(posY, { toValue: y.current + 34, duration: 260, useNativeDriver: false }),
      Animated.timing(scale, { toValue: 0.35, duration: 260, useNativeDriver: false }),
      Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  }, [fade, posX, posY, scale]);

  const land = useCallback(() => {
    busy.current = true;
    const d = itemRef.current;
    const bin = nearestBin();

    let ended = false;
    if (!bin) {
      Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: false }).start();
      showFlash('Missed', C.dark);
      ended = loseLife('It landed on the ground. That costs a life.');
    } else {
      openLid(bin);
      dropIn(bin);
      setTimeout(() => chompBin(bin), 220);
      if (bin === d.bin) {
        setCaught((c) => c + 1);
        setBurst({ id: Date.now(), left: BIN_CENTRE[bin], top: landY.current + 8 });
        setTimeout(() => setBurst(null), 1000);
        speed.current = Math.min(MAX_SPEED, speed.current + SPEED_STEP);
        showFlash('Yes!', C.ink);
        setHint(d.name + ' belongs in the ' + BINS[bin].name + '. ' + d.why);
      } else {
        showFlash('Wrong bin', C.dark);
        const msg = d.name + ' goes in the ' + BINS[d.bin].name + ', not the ' + BINS[bin].name + '.';
        if (LOSE_LIFE_ON_WRONG_BIN) ended = loseLife(msg + ' That costs a life.');
        else setHint(msg);
      }
    }
    const wait = bin && bin === d.bin ? NEXT_DELAY_RIGHT : NEXT_DELAY_OTHER;
    if (!ended) setTimeout(() => { if (!deadRef.current) spawn(); }, wait);
  }, [chompBin, dropIn, fade, loseLife, nearestBin, openLid, showFlash, spawn]);

  useEffect(() => {
    let alive = true;
    let id: number;
    const step = () => {
      if (!alive) return;
      if (!busy.current && !deadRef.current && !pausedRef.current && landY.current > 0) {
        y.current += speed.current;
        if (target.current) {
          const want = BIN_CENTRE[target.current] - FALLER_W / 2;
          x.current += (want - x.current) * 0.15;
          posX.setValue(x.current);
        }
        posY.setValue(y.current);
        const n = nearestBin();
        setNear((prev) => (prev === n ? prev : n));
        if (y.current >= landY.current) land();
      }
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => { alive = false; cancelAnimationFrame(id); };
  }, [land, nearestBin, posX, posY]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !busy.current && !deadRef.current && !pausedRef.current,
      onMoveShouldSetPanResponder: () => !busy.current && !deadRef.current && !pausedRef.current,
      onPanResponderGrant: () => {
        setDragging(true);
        target.current = null;
        dragFrom.current = x.current;
      },
      onPanResponderMove: (_e, g) => {
        x.current = Math.max(0, Math.min(FIELD_W - FALLER_W, dragFrom.current + g.dx));
        posX.setValue(x.current);
      },
      onPanResponderRelease: () => setDragging(false),
      onPanResponderTerminate: () => setDragging(false),
    }),
  ).current;

  function replay() {
    livesRef.current = MAX_LIVES;
    deadRef.current = false;
    speed.current = START_SPEED;
    setLives(MAX_LIVES);
    setCaught(0);
    setOver(false);
    setPaused(false);
    setHint('Drag the item sideways, or tap the bin you want.');
    spawn();
  }

  const rank =
    caught >= 20 ? { pic: 'head', name: 'Head ranger', line: 'That is a serious streak.' }
    : caught >= 12 ? { pic: 'top', name: 'Top sorter', line: 'Getting close to head ranger.' }
    : caught >= 5 ? { pic: 'good', name: 'Good sorter', line: 'Read the item before you steer it.' }
    : { pic: 'new', name: 'Sorter in training', line: 'Take your time with the first few.' };

  return (
    <SafeAreaView style={s.screen} edges={EMBEDDED ? [] : ['top']}>
      <StatusBar barStyle="light-content" backgroundColor={WOOD} />

      <Wood style={s.banner}>
        <View style={s.bannerRow}>
          <View style={s.plaque}>
            <Image source={UI.star} style={s.starImg} />
            <View>
              <Text style={s.plaqueLabel}>SCORE</Text>
              <Text style={s.plaqueNum}>{caught * 10}</Text>
            </View>
          </View>

          <View style={s.heartsPill}>
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Image key={i} source={i < lives ? UI.heartFull : UI.heartEmpty} style={s.heart} />
            ))}
          </View>

          <View style={s.level}>
            <Text style={s.levelText}>LEVEL {Math.floor(caught / WOOD_LEVELS) + 1}</Text>
            <View style={s.levelTrack}>
              <View style={[s.levelFill, { width: `${((caught % WOOD_LEVELS) / WOOD_LEVELS) * 100}%` as `${number}%` }]} />
            </View>
          </View>

          <PauseButton onPress={() => { if (!over) setPaused(true); }} />
        </View>
      </Wood>

      <View style={s.body}>
      <View style={s.fieldWrap}>
        <View style={s.field} onLayout={onFieldLayout}>
          <Meadow width={FIELD_W} height={fieldH} />

          <Animated.View
            style={[
              s.faller,
              { opacity: fade, transform: [{ translateX: posX }, { translateY: posY }, { scale }] },
            ]}
            {...responder.panHandlers}
          >
            <View style={[s.tile, dragging && s.tileLifted]}>
              <Image source={ITEM_IMAGES[item.pic]} style={s.tileImg} resizeMode="contain" />
            </View>
            <Text numberOfLines={2} style={s.fallerName}>{item.name}</Text>
          </Animated.View>

          {ORDER.map((k) => {
            const b = BINS[k];
            return (
              <Pressable
                key={k}
                onPress={() => { if (!busy.current && !deadRef.current && !paused) target.current = k; }}
                accessibilityRole="button"
                accessibilityLabel={b.name + ', ' + b.sub}
                style={[
                  s.bin,
                  { left: BIN_X[k], width: BIN_W, backgroundColor: b.soft },
                  near === k && { borderColor: b.solid },
                ]}
              >
                <Animated.View
                  style={[
                    s.can,
                    {
                      transform: [
                        { scaleY: chomp[k].interpolate({ inputRange: [0, 1, 2, 3], outputRange: [1, 0.86, 1.07, 1] }) },
                        { scaleX: chomp[k].interpolate({ inputRange: [0, 1, 2, 3], outputRange: [1, 1.08, 0.96, 1] }) },
                      ],
                    },
                  ]}
                >
                  <Animated.Image source={UI.bin[k].closed} style={[s.canImg, { opacity: lids[k].interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} />
                  <Animated.Image source={UI.bin[k].open} style={[s.canImg, { opacity: lids[k] }]} />
                </Animated.View>
                <Text style={s.binLabel}>{b.sub}</Text>
              </Pressable>
            );
          })}

          {burst && <Burst key={burst.id} left={burst.left} top={burst.top} text="+10" />}

          {flash && (
            <View style={s.flashWrap} pointerEvents="none">
              <Text style={[s.flash, { color: flash.colour }]}>{flash.text}</Text>
            </View>
          )}

          {over && (
            <View style={s.over}>
              <View style={s.badge}><Image source={UI.rank[rank.pic as 'head' | 'top' | 'good' | 'new']} style={s.badgeImg} /></View>
              <Text style={s.overRank}>{rank.name}</Text>
              <Text style={s.overLine}>
                You sorted {caught} before running out of lives. {rank.line}
              </Text>
              <Pressable style={s.cta} onPress={replay}>
                <Text style={s.ctaText}>Play again</Text>
              </Pressable>
              <Pressable style={s.backLink} onPress={() => router.replace(GAMES_MENU)}>
                <Text style={s.backLinkText}>Back to games</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View style={[s.talk, { marginBottom: 12 + bottomInset }]}>
        <Text style={s.why}>{hint}</Text>
      </View>
      </View>

      {paused && !over && <PauseMenu onResume={() => setPaused(false)} onExit={() => router.replace(GAMES_MENU)} />}
    </SafeAreaView>
  );
}

const FONT = Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' });

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: WOOD },

  banner: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, gap: 8, borderBottomWidth: 3, borderColor: WOOD_EDGE },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: C.dark, fontSize: 28, lineHeight: 28, marginTop: -3, fontWeight: '700' },
  pauseImg: { width: 24, height: 24 },
  ribbon: { flex: 1, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  ribbonTitle: { color: C.dark, fontSize: 15, fontWeight: '800', letterSpacing: 1.5, fontFamily: FONT },
  ribbonSub: { color: C.grey, fontSize: 10, fontWeight: '600', fontFamily: FONT, marginTop: -1 },

  plaque: { flex: 1.1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  starImg: { width: 22, height: 22 },
  plaqueLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: C.grey, fontFamily: FONT },
  plaqueNum: { fontSize: 18, fontWeight: '800', color: C.dark, lineHeight: 20, fontFamily: FONT },
  heartsPill: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 14, paddingHorizontal: 6, height: 42 },
  heart: { width: 22, height: 22 },
  level: { flex: 1, backgroundColor: C.cream, borderWidth: 3, borderColor: WOOD_EDGE, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, justifyContent: 'center' },
  levelText: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: C.dark, fontFamily: FONT },
  levelTrack: { height: 9, borderRadius: 5, backgroundColor: C.light, borderWidth: 1.5, borderColor: WOOD_EDGE, marginTop: 3, overflow: 'hidden' },
  levelFill: { height: '100%', backgroundColor: C.green },

  footer: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 10, borderTopWidth: 3, borderColor: WOOD_EDGE },
  body: { flex: 1, backgroundColor: C.cream },

  // field now fills whatever space is left instead of a fixed height
  fieldWrap: { flex: 1, paddingHorizontal: PAD, paddingTop: 12 },
  field: { flex: 1, width: FIELD_W, backgroundColor: '#CBEBF0', borderRadius: 22, overflow: 'hidden' },

  faller: { position: 'absolute', top: 0, left: 0, width: FALLER_W, alignItems: 'center' },
  tile: { width: 80, height: 80, borderRadius: 22, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center' },
  tileLifted: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  tileImg: { width: 72, height: 72 },
  fallerName: { fontSize: 11, fontWeight: '600', color: C.ink, textAlign: 'center', marginTop: 4, lineHeight: 14, fontFamily: FONT },

  bin: { position: 'absolute', bottom: GROUND_H - 2, height: BIN_H, borderWidth: 2, borderColor: 'transparent', borderRadius: 16, paddingTop: 8, alignItems: 'center' },
  can: { width: 86, height: 86 },
  canImg: { position: 'absolute', top: 0, left: 0, width: 86, height: 86 },
  binLabel: { fontSize: 11, fontWeight: '600', color: C.ink, marginTop: 2, fontFamily: FONT },

  flashWrap: { position: 'absolute', left: 0, right: 0, top: '30%', alignItems: 'center' },
  flash: { fontSize: 24, fontWeight: '800', fontFamily: FONT },

  pauseVeil: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,243,214,0.85)', alignItems: 'center', justifyContent: 'center' },
  pauseText: { fontSize: 20, fontWeight: '800', color: C.dark, fontFamily: FONT },

  over: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,243,214,0.97)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  badge: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  badgeImg: { width: 72, height: 72 },
  overRank: { fontSize: 21, fontWeight: '800', color: C.dark, marginBottom: 6, fontFamily: FONT },
  overLine: { fontSize: 14, fontWeight: '500', color: C.grey, textAlign: 'center', lineHeight: 20, marginBottom: 16, fontFamily: FONT },

  backLink: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 18 },
  backLinkText: { color: C.dark, fontSize: 15, fontWeight: '700', fontFamily: FONT, textDecorationLine: 'underline' },
  cta: { backgroundColor: C.orange, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 26 },
  ctaText: { color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: FONT },

  talk: { marginHorizontal: PAD, marginTop: 12, marginBottom: 12, backgroundColor: C.light, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, minHeight: 66, justifyContent: 'center' },
  why: { fontSize: 14, fontWeight: '500', color: C.grey, lineHeight: 20, fontFamily: FONT },
});
