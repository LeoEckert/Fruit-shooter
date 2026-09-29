# Wütendes Obst (Angry Fruit) – Game Design Document

> Version 0.1 · Date: 2026-09-29 · Status: concept (no implementation yet)
>
> This document describes the game's features, content and rules. It is the
> basis for implementation by other agents. Numbers are starting values for
> balancing, not fixed requirements.
>
> German version: [GAME_DESIGN.de.md](GAME_DESIGN.de.md)

---

## Contents

1. [Vision & Pitch](#1-vision--pitch)
2. [Story & World](#2-story--world)
3. [Core Mechanic: The Fork Slingshot](#3-core-mechanic-the-fork-slingshot)
4. [The Fruits](#4-the-fruits)
5. [The Blender Gang (Enemies)](#5-the-blender-gang-enemies)
6. [Building Materials & Objects](#6-building-materials--objects)
7. [Status Effects & Chain Reactions](#7-status-effects--chain-reactions)
8. [Worlds & Level Structure](#8-worlds--level-structure)
9. [Boss Fights](#9-boss-fights)
10. [Score, Stars & Rating](#10-score-stars--rating)
11. [Progression & Meta Game](#11-progression--meta-game)
12. [Additional Game Modes](#12-additional-game-modes)
13. [Game Feel, Art & Sound](#13-game-feel-art--sound)
14. [Controls & Accessibility](#14-controls--accessibility)
15. [Implementation Notes](#15-implementation-notes)
16. [Scope: MVP and Later Stages](#16-scope-mvp-and-later-stages)
17. [Open Questions](#17-open-questions)

---

## 1. Vision & Pitch

**One sentence:** A 2D physics slingshot game in which furious fruit uses a
canning-jar rubber band catapult to topple the kitchen-appliance fortresses of
the Blender Gang before being turned into smoothie tomorrow morning.

**Design pillars**

| Pillar | Meaning |
|---|---|
| **Shooting is everything** | Every mechanic builds on the shot. No walking, no building, no in-level menus. Aim, release, tap once in flight. |
| **Chaos with a cause** | Collapses and chain reactions are spectacular but understandable. Players who understand a level can plan the chaos. |
| **Kitchen logic** | Every rule makes everyday sense: juice makes things wet, wet toasters spark, ice slides, honey sticks. Players should be able to guess interactions. |
| **Silly, never mean** | Slapstick instead of violence. Appliances break, tip over, rattle and whine. Fruit bursts into juice, not blood. |
| **Short and replayable** | A level takes 30 to 90 seconds. Restarting is instant. |

**Target audience:** Casual players aged 8 and up, mobile (touch) and browser
(mouse). Landscape orientation.

---

## 2. Story & World

### Premise

It is Sunday evening. The fruits lie in the fruit bowl and overhear the kitchen
appliances whispering on the shelf: tomorrow at 7 a.m. is "Smoothie Monday".
The Blender Gang, led by **the Pulverizer** (an old countertop blender with a
chrome lid), has dug in on the kitchen shelf, built fortresses out of cereal
boxes, mason jars and cutting boards, and already locked the best fruit away in
jars.

The fruits strike back. Grandpa Apple stretches a canning-jar rubber band
between two forks stuck in a cork, and the battle begins.

### Narrative structure

- The story is told in **short comic cutscenes** (3–5 still panels, no text or a
  few speech bubbles in gibberish) between worlds.
- Each world ends with a **boss fight** against a member of the Blender Gang.
- Overarching time pressure: each world shows a **kitchen clock** running from
  8:00 p.m. to 7:00 a.m. Purely narrative, not a gameplay timer.

### The world clock (chapters)

| Time | Chapter | Event |
|---|---|---|
| 8:00 p.m. | Prologue | The fruits eavesdrop on the gang. Tutorial. |
| 10:00 p.m. | World 1 | Attack on the countertop. |
| 12:00 a.m. | World 2 | The fridge is opened – free the captured berries. |
| 2:00 a.m. | World 3 | The oven heats up. |
| 3:30 a.m. | World 4 | Flood in the kitchen sink. |
| 5:00 a.m. | World 5 | The pantry and the spice rack. |
| 6:30 a.m. | World 6 | Showdown on the kitchen shelf against the Pulverizer. |
| 7:00 a.m. | Epilogue | The human walks into the kitchen and everything freezes. They only see a mess and make toast. |

### Side characters

- **Grandpa Apple** – leader, explains everything in the tutorial, wears reading glasses.
- **The Captives** – fruit locked in mason jars in each level. Freeing them is
  optional and gives a bonus (see [10](#10-score-stars--rating)).
- **The Fruit Fly** – flies around the menu as a mascot and gives hints when a
  level has been lost three times in a row.

---

## 3. Core Mechanic: The Fork Slingshot

### Setup

Two forks are stuck in a wine cork with a red canning-jar rubber band stretched
between them. The slingshot stands on the left of the level, the fortress on the
right.

### Flow of a shot

1. **Load:** The next fruit automatically hops out of the fruit bowl into the band.
2. **Pull:** The player drags the fruit away from the band. Drag direction =
   opposite of launch direction. Drag length = power (capped at a maximum radius).
3. **Aim assist:** While dragging, a dotted line shows the **first half** of the
   trajectory. The second half stays hidden (skill element).
4. **Release:** The fruit flies and the band snaps back audibly.
5. **Ability:** Tapping once during flight triggers the special ability
   (different per fruit, see [4](#4-the-fruits)). Only once per shot.
6. **Settling:** The camera follows the fruit and waits until all objects have
   settled (speed below threshold for 1.5 s, at most 8 s).
7. **Evaluation:** All Blender Gang appliances destroyed → win. Otherwise next
   fruit. No fruit left → loss.

### Physics rules

- Rigid 2D bodies with gravity, friction, restitution and mass.
- **Damage = impact energy** (relative velocity² × mass, scaled). Every object
  has hit points. Objects take damage from fruit, from other falling objects and
  from falls.
- Blender Gang appliances also take damage when they **tip over or fall**. A nudge
  off the edge is a legitimate kill.
- After a shot, fruits remain as physics objects until the next shot starts. Then
  they disappear with a "plop" (no unbounded number of bodies in the level).

### Slingshot extras (unlocked over the course of the game)

| Extra | Effect |
|---|---|
| **Double band** | Once per level: +30% launch power for one shot. |
| **Spoon catapult** | Alternative launcher in some levels: high arc, fixed power, only the angle can be chosen. |
| **Movable slingshot** | In some levels the slingshot sits on a skateboard and can be moved along a rail before the shot. |
| **Second slingshot** | Some levels have two slingshots (bottom left, top left); the player picks one before each shot. |

---

## 4. The Fruits

### 4.1 Overview

All values relative to the apple (= 1.0).

| Fruit | Mass | Size | Bounce | Ability (tap in flight) | Strong against | Weak against |
|---|---|---|---|---|---|---|
| **Apple** | 1.0 | 1.0 | medium | none – standard shot | cardboard, wood | metal |
| **Watermelon** | 4.0 | 2.2 | low | bursts on impact, seeds as buckshot | walls, stacks | high targets (heavy arc) |
| **Grape** | 0.4 × 5 | 0.5 | medium | splits into 5 berries (fan) | glass, spread-out targets | metal, wood |
| **Banana** | 0.8 | 1.2 | low | boomerang curve back | targets behind cover | open targets |
| **Lemon** | 0.9 | 0.9 | medium | sprays juice in a cone, enemies blinded | enemy groups, metal (rust) | sturdy structures |
| **Coconut** | 2.5 | 1.1 | high | tap makes it even harder + extra drop | stone, metal | – (but slow) |
| **Kiwi** | 0.7 | 0.8 | low | keeps rolling relentlessly after landing | ground targets, corridors | towers |

### 4.2 The starting fruits in detail

#### Apple – "The Reliable One"
- **Role:** Standard shot, first fruit in the game, reference for all values.
- **Ability:** None. In exchange, it is the most predictable.
- **Upgrade idea (ripeness system):** From ripeness level 3 it leaves a dent on
  impact that permanently weakens the hit object by 10%.
- **Character:** Grumpy, red cheeks, stem hairdo.

#### Watermelon – "The Steamroller"
- **Flight:** Heavy, flat arc, needs a long pull.
- **Impact (automatic):** On the first strong impact (threshold) it bursts. The
  flesh breaks into 3 large chunks (physical, behaving like small apples), plus
  12 seeds as buckshot in a 90° cone in the direction of flight.
- **Tap in flight:** Triggers the burst **immediately** – the seeds then rain down
  from above ("seed hail"), good against enemies on open floors.
- **Side effect:** Leaves a **pink juice puddle** (status effect *wet*, see
  [7](#7-status-effects--chain-reactions)).

#### Grape – "The Volley"
- **Flight:** Light, fast.
- **Tap in flight:** Splits into **5 berries** that spread in a ±15° fan and keep
  the remaining velocity.
- **Special:** Berries are strong against **glass** (glass shatters from low energy
  when hit by small, hard objects).
- **Second tap (upgrade):** Berries burst and make everything in a small radius
  *sticky*.

#### Banana – "The Boomerang"
- **Flight:** Normal arc, visibly spinning.
- **Tap in flight:** The banana accelerates and flies a **curve back to the left**
  (semicircle upward). This hits targets from behind, e.g. appliances shielded by
  a wall facing the slingshot.
- **Rule:** The curve direction is always the same (counterclockwise); the radius
  depends on the speed at the moment of the tap. Fast = wide.
- **After impact:** Leaves a **banana peel** object. Enemies that step on it or
  slide onto it fall over (slapstick guaranteed).

#### Lemon – "The Sour One"
- **Tap in flight:** Sprays a **juice jet in a 60° cone forward and down** (range
  about 4 apple widths).
- **Effect on enemies:** Hit appliances are *blinded* for 4 s: they squeeze their
  eyes shut, turn around and stumble a few steps in a random direction (small
  impulse). Near edges this often makes them fall.
- **Effect on metal:** Makes metal objects *sour* → they **rust** within 3 s and
  lose 50% of their hit points.
- **The lemon itself:** Deals little impact damage.

#### Coconut – "The Rock"
- **Flight:** Heavy, very high bounce, loses only 20% speed per impact.
- **Passive:** Bounces up to **4 times** before coming to rest.
- **Tap in flight:** The coconut becomes **rock hard** for 2 s (mass ×2) and gets
  a small downward impulse – ideal for smashing down through floors.
- **The only fruit that reliably destroys stone and metal.**

#### Kiwi – "The Roller"
- **Flight:** Small, flat.
- **After landing:** Keeps **rolling relentlessly** at constant speed, climbs small
  steps, pushes small objects aside and breaks through cardboard.
- **Tap in flight or while rolling:** Changes direction (once). Good in tunnels and
  basements under the fortress.
- **Stop:** Stops when it hits a wall it cannot break through, or after 6 s.

### 4.3 New fruits (expansions)

Unlocked across the worlds. Each world introduces 1–2 new fruits.

| Fruit | Ability | Idea |
|---|---|---|
| **Chili Pepper** | Tap: afterburner – shoots straight in the aimed direction and **ignites** flammable objects on impact (cardboard, wood, oil). | Fire chain reactions, World 3 (oven). |
| **Pineapple** | Tap: hovers briefly, then fires its **leaves like throwing stars** in 3 directions. On impact: small explosion (hand-grenade look). | The game's "bomb". |
| **Cherries** | Two cherries on one stem. Tap: **stem snaps**, both fly apart – one up, one down. | Two targets with one shot. |
| **Strawberry** | Tap: throws its **seeds as glue dots** downward. Hit objects become *sticky* for a short time and stick together. | Stabilizes/glues – surprisingly tactical (see puzzle levels). |
| **Pomegranate** | On impact: **cluster bomb** – bursts into 20 seeds that fly in all directions and bounce once more. | Pure chaos, late game. |
| **Avocado** | Tap: throws its **pit** forward (heavy, fast); the empty shell keeps flying. | Precision shot with a follow-up. |
| **Blueberries** | Come as a **three-pack** in one shot; each berry can be fired individually by tapping (mini cannon, 3 taps). | Multi-tap as a variation. |
| **Durian** | Tap: releases a **stink cloud**. Enemies in the cloud flee (move away from it) – often over the edge. | Crowd-control fruit. |
| **Plum** | Tap: **shrinks** into a prune (half size, triple density) and flies through gaps. | Precision fruit for tight holes. |
| **Mango** | Tap: **glides like a paper plane** at a shallow angle far forward. | Range for huge levels. |
| **Orange** | Tap: peels itself – the peel flies ahead as a **shield** and breaks glass, while the orange itself rolls on. | Two-stage breakthrough. |
| **Passion Fruit** | Passive: gets **faster** instead of slower on each impact (up to 3 bounces). | Pinball levels. |

**Secret fruit:** **The Golden Pear** – unlocked by collecting all recipe cards
(see [11](#11-progression--meta-game)). Tap: everything on screen goes into
**slow motion** for 2 s, and the pear can be re-aimed once (a second aim in
mid-flight).

### 4.4 Fruit order and the fruit bowl

- **Default:** Each level defines the **order** of the fruits (as in the genre
  classic). The fruit bowl to the left of the slingshot shows all upcoming fruits.
- **From World 3 – "fruit basket levels":** Some levels let players **choose the
  order freely** (tapping a fruit in the bowl loads it).
- **Leftover fruit = bonus points** (see [10](#10-score-stars--rating)). On a win
  they hop out of the bowl cheering.

### 4.5 Fruit combos

When a fruit hits an effect left behind by an earlier fruit, a **combo** occurs,
with bonus points and a short caption.

| Combo | Trigger | Effect |
|---|---|---|
| **Fruit Salad** | 3 different fruits lie within a small radius | +5,000 points, confetti made of fruit pieces |
| **Lemonade** | Lemon juice hits a watermelon puddle | The puddle becomes *sour*: everything in it rusts / gets blinded |
| **Flambé** | Chili ignites a banana peel, or a juice puddle mixed with a liquor bottle | Burst of flame, large radius |
| **Coconut Bowling** | Coconut hits a kiwi lying on the ground | The kiwi gets double speed |
| **Rum Pot** | A cherry lands in a mason jar | The jar explodes |
| **Banana Split** | A banana flies through the seeds of a bursting watermelon | The banana splits into 3 boomerangs |

Combos are meant to be **discovered**. They are not explained, but get entered in
the recipe book the first time they are triggered.

---

## 5. The Blender Gang (Enemies)

The enemies are kitchen appliances with faces (knobs as eyes, cables as tails).
**Most of them do not attack** – they are the targets. Some appliances do have
**active behavior** that changes the fortress. This adds variety without the
player having to do anything other than shoot.

### 5.1 Foot soldiers

| Appliance | HP | Behavior | Weak spot |
|---|---|---|---|
| **Egg Cup** | very low | Passive. The game's equivalent of the pigs: small, numerous, wobbly. | Tipping over is enough. |
| **Whisk** | low | Spins when hit and flings small objects away. | Wire bends easily. |
| **Coffee Mug** | low | Passive. Sloshes when hit – makes neighbors *wet*. | Porcelain. |
| **Immersion Blender** | medium | Passive, wears a measuring-cup helmet. | Knock the helmet off, then it's weak. |
| **Egg Slicer** | medium | Slices fruit that touches it **slowly** (below a speed threshold) – fast hits destroy it. | Hit it hard and fast. |
| **Cheese Grater** | medium | Fruit that **slides along** it loses mass (gets grated). | Coconut. |

### 5.2 Specialists

| Appliance | HP | Behavior |
|---|---|---|
| **Toaster** | high | Every 5 s toast pops out. Toast is an object that stays on the fortress (filler material). *Wet* → **short circuit**: explosion with sparks. |
| **Juicer** | high | Catches a fruit that hits it head-on and **squeezes it** (fruit lost, juice puddle created). Vulnerable from above or behind – banana! |
| **Hand Mixer** | medium | Hangs from the ceiling by its cable and swings. Hit the cable → it falls. |
| **Kettle** | medium | Boils over after 10 s: an upward **steam blast** that deflects flying fruit. When hit: scalds neighbors with hot water (damage). |
| **Microwave** | very high | Door opens and closes rhythmically. Open = a fruit shot inside closes the door, and after 2 s **the fruit explodes** inside (heavy internal damage). |
| **Kitchen Scale** | medium | Tilts platforms: whatever lies on one side lifts the other. Physics puzzle element. |
| **Robot Vacuum** | medium | Drives back and forth on the floor and **sucks up fruit lying around** (kiwi counter). Pushes small objects. |
| **Knife Block** | high | Fires a knife horizontally toward the slingshot every 6 s. If it hits a fruit **in flight**, the fruit is cut in half (two weaker halves keep flying). The only "shooting" enemy. |
| **Fridge Magnet** | low | Attracts metal in a small radius and holds structures together until destroyed – then everything falls apart. |
| **Ice Maker** | medium | Freezes fruit that hits it (the fruit becomes an ice block: slides, is heavy, shatters). |

### 5.3 The bosses (overview)

| World | Boss | Short description |
|---|---|---|
| 1 | **Toast Tyrant** | Giant four-slice toaster, see [9](#9-boss-fights) |
| 2 | **Frostbite** | Old fridge with a freezer-compartment mouth |
| 3 | **Madame Hot Air** | Air fryer |
| 4 | **Captain Dishwasher** | A dishwasher sailing the sink like a ship |
| 5 | **The Grinders** | Pepper and salt mill duo |
| 6 | **The Pulverizer** | Countertop blender, leader of the gang |

### 5.4 Enemy reactions (humor)

- Enemies **follow** the flying fruit with their eyes.
- When a fruit narrowly misses: a relieved exhale (puff of steam).
- When an appliance falls but survives: it gets cracks and a band-aid.
- Surviving appliances **laugh** after a missed shot (rattling).
- Destroyed appliances fall apart into parts (screws, springs, knobs) that bounce
  around briefly and then fade.

---

## 6. Building Materials & Objects

### 6.1 Basic materials

| Material | Kitchen look | HP | Density | Special |
|---|---|---|---|---|
| **Cardboard** | Cereal boxes, egg cartons | low | light | flammable; when *wet* it softens (HP halved) |
| **Wood** | Cutting boards, wooden spoons, toothpicks | medium | medium | flammable |
| **Glass** | Mason jars, drinking glasses | low | medium | shatters from hard, small hits; shards are harmless |
| **Porcelain** | Plates, cups | low–medium | medium | breaks into a few large pieces that keep falling |
| **Metal** | Pots, pans, cans | high | heavy | rusts from lemon; conducts electricity (toaster!) |
| **Stone** | Mortar, marble board | very high | very heavy | only coconut/pineapple are effective |
| **Spaghetti** | Bundles of uncooked spaghetti | very low | very light | breaks if you look at it; *wet* → goes soft and sags |
| **Jelly** | Gelatin dessert blocks | – (indestructible) | medium | extremely elastic, fruit bounces off like a trampoline |
| **Ice** | Ice cubes, ice sheets | medium | medium | almost no friction; melts into water (*wet*) from fire |
| **Plastic Container** | Food storage boxes | medium | light | indestructible for small fruit, springy; the lid can pop open |

### 6.2 Interactive objects

| Object | Effect |
|---|---|
| **Soda bottle** | When hit or shaken: after 1 s it flies as a **rocket** in the direction its neck points. |
| **Flour sack** | Bursts into a **dust cloud** that hides an area for 3 s. Flour + fire = **dust explosion**. |
| **Oil bottle** | Leaves a *slippery* surface. Flammable. |
| **Honey jar** | Makes everything nearby *sticky*. |
| **Gas stove flame** | Permanent fire source at fixed positions. |
| **Popcorn bag** | When heated: the popcorn **explodes** into hundreds of light kernels that gently nudge everything. |
| **Spring / springform pan** | Trampoline: launches fruit upward. |
| **Pot lid** | Can flap on a hinge as a shield. |
| **Clothespin on a string** | Ropes/hangers: cutting them (banana, knife) makes objects fall. |
| **Rolling pin** | Starts rolling on slopes as soon as it is nudged. |
| **Salt shaker** | Salt melts ice in a small radius. |
| **Mason jar with captives** | Contains a captured fruit. Destroying the jar = rescue (bonus). |
| **Golden spoon** | Hidden collectible in some levels (hit it = collected). |

### 6.3 Environment

| Element | Effect |
|---|---|
| **Fan** | Constant wind zone that deflects fruit (visible through particles). |
| **Range hood** | Upward suction in an area. |
| **Faucet** | Water jet that makes everything below it *wet* and pushes light objects down. |
| **Conveyor belt** (dishwasher rack / bread slicer) | Moves objects and enemies horizontally. |
| **Water surface** (sink) | Buoyancy: light fruit floats, heavy fruit sinks. Cardboard soaks up water. |
| **Hot stovetop** | Fruit that stays on it gets *baked* (see below). |
| **Cat paw** | Easter egg in some levels: a cat swipes across the level after 20 s of inactivity. |

---

## 7. Status Effects & Chain Reactions

Status effects make interactions predictable. Each effect has a clear visual
(color/particles).

| Effect | Visual | Source | Effect |
|---|---|---|---|
| **Wet** | blue drops | Watermelon, water, coffee mug, melted ice | Cardboard softens, toasters/electrical appliances **short circuit**, fire extinguished |
| **Sour** | yellow bubbles | Lemon | Enemies blinded; metal rusts (−50% HP) |
| **Burning** | flames | Chili, stove flame | Wood/cardboard lose HP over time, fire spreads to neighbors |
| **Sticky** | golden strands | Honey, strawberry, grape (upgrade) | Objects stick together (joint), fruit sticks where it lands |
| **Slippery** | shine | Oil, ice, banana peel | Friction almost 0 |
| **Frozen** | ice crystals | Ice maker, freezer | Object becomes brittle (behaves like glass), fruit turns into ice blocks |
| **Baked** | brown crust | Stovetop, oven | Fruit becomes harder (+mass, −bounce); cardboard chars |
| **Blinded** | squeezed-shut eyes | Lemon, flour cloud | Enemies stumble randomly |
| **Electrified** | lightning | Short circuit, metal in contact with a toaster | Damage over time, jumps along metal |

### Example chain reactions (level design templates)

1. **The Short Circuit:** Watermelon bursts above the toaster → toaster wet →
   short circuit → electricity travels through metal pots → three immersion
   blenders fall.
2. **The Fireworks:** Chili hits an oil bottle → oil burns → popcorn bag above
   pops → kernels nudge the soda bottle → rocket flies into the knife block.
3. **The Ice Slide:** Knock over the salt shaker → ice sheet melts in one spot →
   tower tips → slides across the ice to the edge.
4. **The Dust Explosion:** Grape destroys a flour sack → cloud → chili into it →
   boom.

---

## 8. Worlds & Level Structure

### 8.1 Overview

Each world has **15 levels + 1 boss level + 3 bonus levels** (unlocked with
stars). Each world adds **one new core theme**, carried by materials, enemies and
environment.

| # | World | Theme / mechanic | New fruits | New enemies / objects |
|---|---|---|---|---|
| 0 | **The Fruit Bowl** (tutorial, 5 levels) | Aiming, pulling, tapping | Apple, Grape | Egg Cup, cardboard, wood |
| 1 | **The Countertop** | Basics, glass, first chain reactions | Banana, Watermelon | Toaster, Whisk, Immersion Blender, glass |
| 2 | **The Fridge** | Ice, sliding, multiple floors (shelves) | Kiwi, Blueberries | Ice Maker, Fridge Magnet, ice, plastic containers |
| 3 | **The Oven** | Fire, heat, baking | Chili Pepper, Coconut | Kettle, Microwave, stove flame, popcorn |
| 4 | **The Sink** | Water, buoyancy, currents | Lemon, Orange | Juicer, Robot Vacuum, faucet, water |
| 5 | **Pantry & Spice Rack** | Dust, sticking, hiding spots, ropes | Strawberry, Durian, Cherries | Cheese Grater, Kitchen Scale, flour, honey, spaghetti |
| 6 | **The Kitchen Shelf** | Everything combined, huge fortresses | Pineapple, Pomegranate | Knife Block, Egg Slicer, jelly |
| ★ | **The Garden** (post-game) | Barbecue, wind, lawn sprinklers | Mango, Passion Fruit, Avocado, Plum | Grill Tongs Gang (bonus faction) |

### 8.2 Level archetypes

To make 100+ levels feel different, each level is assigned an archetype. The
world sets the materials, the archetype sets the structure.

| Archetype | Description |
|---|---|
| **The Tower** | Tall, narrow, wobbly. One good hit at the bottom brings everything down. |
| **The Castle** | Wide, multi-layered, enemies in chambers. Needs several shots. |
| **The Bunker** | Flat, solid, enemies behind metal. Coconut/kiwi puzzle. |
| **The Clockwork** | A prepared chain reaction. One precise shot sets everything off. |
| **The Suspension Bridge** | Objects on strings over gaps. |
| **The Long-Range Arena** | Fortress far away, camera has to zoom, wind. |
| **The Hideout** | Enemies behind the fortress, reachable only by boomerang or bounce shots. |
| **The Floors** | Fridge shelves, shelf boards – enemies stacked above each other. |
| **The Conveyor** | Moving targets. Timing is part of the shot. |

### 8.3 Level rules

- Each level defines: fruits (order), enemies, objects, environment, camera
  bounds, score thresholds for 1/2/3 stars.
- **At least one solution** using fewer fruits than available must exist (for
  3 stars).
- New elements are introduced in **three steps:** (1) show it safely, (2) combine
  it with something familiar, (3) use it in a surprising way.
- Each world has a **"sandbox level"** with an absurd number of fruits and chain
  reactions – pure fun, barely a challenge.

---

## 9. Boss Fights

Bosses are multi-phase levels. The boss has a visible **health bar**. It only
takes damage at **weak spots**, which change each phase. After each phase the
gang partly rebuilds the fortress (animation). Fruits are refilled each phase;
the total score carries over.

### World 1 – Toast Tyrant
- **Phase 1:** Stands behind a wall of toast slices. Launches toast every 4 s,
  which stays as new cover. → Tear down cover faster than it is rebuilt.
- **Phase 2:** A lever on its side becomes visible. Hit → it jumps up and lands
  hard. → Wet fruit into the slots = short-circuit damage.
- **Phase 3:** Stands on a wobbly platform above the sink. Knock it over.

### World 2 – Frostbite
- Opens its freezer compartment and **freezes** flying fruit in a cone.
- Weak spots: the compressor at the back (banana) and the door hinge (coconut).
- Phase 3: The door stands open and everything slides on ice; use salt.

### World 3 – Madame Hot Air
- Blows hot air: a wind zone that deflects fruit upward and *bakes* it.
- Baked fruit is harder – the player turns the boss's mechanic against her.
- Weak spot: the frying basket that slides out in phase 2.

### World 4 – Captain Dishwasher
- Floats in the sink and **rocks** with the waves (moving target).
- Fires dishwasher tabs as cannonballs at foam platforms.
- Phase 2: Hit the sink plug → water drains → the ship runs aground and tips over.

### World 5 – The Grinders
- Two bosses at once (Pepper and Salt), connected by a chain.
- Pepper makes things sneeze (air blast, fruit deflected); Salt melts ice and
  makes fruit heavy (salty = mass ×1.5).
- Both must be defeated **within 10 s** of each other, otherwise the survivor
  grinds the other back to full health.

### World 6 – The Pulverizer
- **Phase 1:** Sits enthroned at the very top of the kitchen shelf in a fortress
  made of all materials. A classic collapse is required.
- **Phase 2:** Switches to speed 3: the blades in the jar spin and a **suction**
  pulls all nearby fruit into the jar (fruit lost) → shoot a coconut or frozen
  fruit inside to **jam** the blades.
- **Phase 3:** The lid flies off and the cable is exposed. The cable to the power
  outlet runs through the entire level – cut it with a banana or put water into
  the outlet (short circuit, final bang, the lights go out).
- **Epilogue:** The light turns on and the human enters the kitchen.

---

## 10. Score, Stars & Rating

| Action | Points |
|---|---|
| Appliance destroyed (foot soldier) | 5,000 |
| Appliance destroyed (specialist) | 8,000 |
| Boss phase completed | 25,000 |
| Object damaged | 10 per HP of damage |
| Object destroyed | Cardboard 500 · Wood 700 · Glass 600 · Metal 1,000 · Stone 1,500 |
| Captive fruit freed | 3,000 |
| Unused fruit on win | 10,000 |
| Combo triggered | 2,000 – 5,000 (see combo table) |
| Golden spoon | 0 points, but a collectible |

**"Juice Chain" multiplier:** If several appliances are destroyed within a single
shot, a multiplier rises (×1, ×1.5, ×2, ×3 …). Shown as a growing juice splash at
the edge of the screen.

**Stars:** 1 star = win. 2 and 3 stars via per-level score thresholds.

**Additional level badges** (optional, shown on the level select screen):
- 🥄 Golden spoon found
- 🫙 All captives freed
- 🎯 Won with a single fruit ("One-Fruit Wonder")

---

## 11. Progression & Meta Game

### 11.1 World map

The kitchen as a **side-view overview map**, with levels as points along a path
across the countertop, fridge, oven and so on. The kitchen clock on the wall
shows story progress.

### 11.2 Ripeness system (fruit upgrades)

- Each fruit earns **ripeness points** when used and when it deals damage.
- 3 ripeness levels: *unripe → ripe → perfectly ripe*. Each level unlocks a
  small, visible improvement (e.g. grape: 6 instead of 5 berries; kiwi: rolls
  2 s longer; lemon: larger cone).
- **Important:** Levels must be 3-star achievable with unripe fruit too. Ripeness
  is a convenience, not a requirement. In competitive mode (Daily Market) all
  fruits are normalized to *ripe*.

### 11.3 Recipe book (collection)

- Every discovered **combo** is entered as a recipe (with an illustration).
- Each world hides **recipe cards** (via golden spoons and bonus levels).
- Complete collection → Golden Pear (see [4.3](#43-new-fruits-expansions)).

### 11.4 Cosmetics

- **Hats & accessories** for fruit (chef's hat, pirate hat, sunglasses,
  mustache). Purely visual, unlocked with stars.
- **Slingshot skins:** silverware, chopsticks, cake forks, barbecue tongs.
- **Band colors:** with trail effects (rainbow, glitter, juice splashes).
- **No purchasable currency is planned in the design.** Everything is earned by
  playing.

### 11.5 Fruit almanac

A reference with all fruits, enemies and materials that fills up on first
encounter: stats, ability, a short funny profile ("Coconut – favorite hobby:
bouncing. Afraid of: nothing.").

---

## 12. Additional Game Modes

| Mode | Description | Unlock |
|---|---|---|
| **Daily Market** | A new generated level every day with a fixed fruit selection. One attempt counts for the leaderboard, then free practice. | after World 1 |
| **Smoothie Sprint** | Time attack: 60 s, unlimited apples, fortresses rebuild after each destruction. Collect points. | after World 2 |
| **One-Shot Puzzles** | 30 handcrafted levels with exactly one fruit. Pure clockwork chain reactions. | after World 3 |
| **Endless Shelf** | The fortress keeps growing and the camera moves up. Each destroyed floor gives a new fruit. How long can you last? | after World 4 |
| **Kitchen Clash (local, 2 players)** | Hot-seat: both players have a fortress and a slingshot on opposite sides. Fruit vs. appliances – player 2 shoots **appliance ammo** (toast, tabs, knives). Players take turns. | after World 5 |
| **Level Editor** | Place materials, enemies and fruit from the almanac, test, share as a code (short text string). | after World 6 |
| **Mirror Mode** | All levels mirrored, slingshot on the right, physics slightly intensified. | after completion |

---

## 13. Game Feel, Art & Sound

### 13.1 Art style

- **2D, hand-drawn**, thick outlines, saturated colors, subtle paper texture.
  Side view, **no** perspective.
- **Parallax background** with 3 layers (kitchen tiles, window with moon, kitchen
  cabinets).
- Fruits have **exaggerated faces** with angry eyebrows; the eyes react to aim
  direction, flight (squeezed shut) and impact (stars).
- Lighting tells the time: World 1 warm evening light, World 3 the oven's glow,
  World 6 bluish dawn.

### 13.2 Juice (feedback)

| Moment | Effect |
|---|---|
| Pulling | The band visibly stretches, a creaking sound rises in pitch, the fruit squishes (squash). |
| Launch | Snap sound, small camera jolt, the fruit stretches (stretch), trail of juice dots. |
| Ability | Brief slow motion (0.1 s), fruit battle cry ("Hyaa!" in gibberish), color flash. |
| Big collapse | Camera shake proportional to energy, dust clouds. |
| Appliance destroyed | Score floats up, parts fly, "clonk-ping" sound. |
| Last appliance | **Slow motion + zoom** on the last appliance falling (finale). |
| Win | Fruits cheer, leftover fruits hop out of the bowl and award bonus points. |
| Loss | The gang laughs, the blender hums triumphantly. No penalty, instant restart. |

### 13.3 Sound & music

- **Music:** Playful big band / swing style with kitchen percussion (pots, spoons,
  whisks as drums). Each world has a variation of the main theme (fridge:
  glockenspiel, oven: Latin, sink: calypso).
- **Voices:** Fruits and appliances speak gibberish. Each fruit has a recognizable
  launch cry.
- **Material sounds:** cardboard dull, glass clinking, metal clattering, porcelain
  ringing, jelly "boing".

---

## 14. Controls & Accessibility

### Controls

| Action | Touch | Mouse | Keyboard (optional) |
|---|---|---|---|
| Aim & pull | Drag from the fruit | Click + drag | Arrow keys (angle/power) |
| Launch | Release | Release | Space |
| Ability | Tap anywhere | Click anywhere | Space |
| Pan camera | Swipe (not on the slingshot) | Right-click drag | A/D |
| Zoom | Two-finger pinch | Mouse wheel | +/− |
| Cancel aim | Drag the fruit back into the band | same | Esc |
| Restart | Button top left | same | R |

### Accessibility

- **Color-blind mode:** Status effects additionally shown with icons (drop,
  lightning, flame), not just color.
- **Aim assist option:** Show the full trajectory (the level still counts, but a
  hint icon appears in the rating).
- **One-handed mode:** Ability via a button instead of tapping anywhere.
- **Reduced effects:** Camera shake and flashes can be turned off.
- **Subtitles** for story sequences (if text is used after all).
- **Skip:** After 5 losses a level can be skipped (without stars).

---

## 15. Implementation Notes

This section does not prescribe technology, but provides guardrails so the
content above can be implemented cleanly.

### 15.1 Architecture recommendations

- **Data-driven:** Fruits, enemies, materials, objects and levels are described
  as **data** (e.g. JSON), not code. New content should be possible without code
  changes as long as it uses existing behavior building blocks.
- **Behavior building blocks instead of one-off classes:** Abilities and
  appliance behaviors are composed from reusable building blocks (e.g. `split`,
  `burst_on_impact`, `boomerang`, `apply_status_cone`, `roll_forever`,
  `periodic_spawn`, `periodic_projectile`, `capture_fruit`).
- **Central status system:** One system manages all status effects and their
  interactions in a rule table (e.g. `wet + electric → short_circuit`).
- **Deterministic physics** with a fixed time step (e.g. 60 Hz). Important for
  the Daily Market (leaderboard), replays and automated tests.
- **Rest detection** for the end of a shot (all bodies below a speed threshold,
  or timeout).

### 15.2 Data model sketch (example)

```json
{
  "fruit": {
    "id": "watermelon",
    "mass": 4.0,
    "radius": 2.2,
    "restitution": 0.15,
    "friction": 0.6,
    "ability": {
      "trigger": "tap_or_impact",
      "behavior": "burst",
      "params": { "chunks": 3, "seeds": 12, "cone_deg": 90 },
      "leaves_status": { "type": "wet", "radius": 3.0, "duration": 8 }
    }
  }
}
```

```json
{
  "level": {
    "id": "w1-05",
    "world": 1,
    "archetype": "tower",
    "fruits": ["apple", "grape", "banana"],
    "slingshot": { "x": 4, "y": 2 },
    "camera": { "min_x": 0, "max_x": 60 },
    "stars": [30000, 55000, 80000],
    "objects": [
      { "type": "block", "material": "cardboard", "shape": "rect", "w": 1, "h": 4, "x": 40, "y": 2, "rot": 0 },
      { "type": "enemy", "id": "egg_cup", "x": 40, "y": 6.5 }
    ]
  }
}
```

### 15.3 Testability

- Every level should have a stored **reference solution** (a list of launch
  angles, powers and tap timings) that must lead to a win in automated tests.
  This way broken levels are caught immediately after physics changes.

---

## 16. Scope: MVP and Later Stages

### MVP ("vertical slice")

Goal: a playable core that proves the fun of shooting.

- Fork slingshot with aiming, pulling, half trajectory, tap in flight
- Fruits: **Apple, Grape, Watermelon, Banana, Lemon, Coconut, Kiwi**
- Materials: cardboard, wood, glass, metal
- Enemies: Egg Cup, Immersion Blender, Toaster
- Status effects: *wet*, *sour*/*blinded*, short circuit
- Tutorial + **World 1** (15 levels) with stars and score
- Basic juice (squash & stretch, camera, particles, sounds)

### Stage 2
- Worlds 2–3, bosses for Worlds 1–3, ripeness system, recipe book, combos, almanac

### Stage 3
- Worlds 4–6, all bosses, remaining fruits, Daily Market, Smoothie Sprint

### Stage 4
- Garden world, level editor, Kitchen Clash (2 players), Mirror Mode, cosmetics

---

## 17. Open Questions

1. **Platform first:** Browser (mouse) or mobile (touch)? Affects UI size and
   camera controls.
2. **Level order:** Should fruit order generally be fixed (classic), or should
   fruit basket levels with free choice be introduced earlier?
3. **Aggressive enemies:** How many appliances may actively "shoot back" (knife
   block, boss mechanics) without shifting the focus away from the player's own
   shooting? Suggestion: at most 1 such enemy per regular level.
4. **Language:** Gibberish voices and textless comics make localization possible
   with almost no translation. Should UI text be bilingual (DE/EN)?
5. **Monetization:** This document assumes a game without in-app purchases.
   Please confirm.
