# Angry Fruit – Demo Design Document

> Version 0.2 · Date: 2026-09-29 · Status: build target
>
> This is the **demo**: a short intro plus one playable world. It is what gets
> implemented now. All other ideas (more worlds, fruits, bosses, modes) live in
> [GAME_DESIGN_FULL.md](GAME_DESIGN_FULL.md) and are out of scope for the demo.
> Numbers are starting values for balancing.

---

## 1. Pitch

A 2D physics slingshot game. The fruit in the bowl is going to be turned into
smoothie tomorrow morning, so it fights back: it fires itself from a rubber band
slingshot at the fortresses of the **Blender Gang**, a crew of kitchen appliances.

**Pillars**
- **Shooting is everything.** Aim, release, tap once in flight. Nothing else.
- **Chaos with a cause.** Collapses and chain reactions follow kitchen logic
  (juice makes things wet, wet toasters short-circuit).
- **Enemies never shoot back.** Appliances are targets. They only affect fruit
  through contact or passive zones.
- **Silly, never mean.** Slapstick, juice instead of blood.
- **Short and replayable.** 30–90 s per level, instant restart.

**Demo length:** about 20–30 minutes. Platform: browser (mouse) and touch,
landscape.

---

## 2. Demo Structure

| Part | Content | Length |
|---|---|---|
| **Intro cutscene** | Story setup in 4 comic panels | ~30 s, skippable |
| **Tutorial** | 3 short levels in the fruit bowl | ~3 min |
| **World 1: The Countertop** | 10 levels | ~15–20 min |
| **Boss: Toast Tyrant** | 1 multi-phase level | ~3 min |
| **Outro** | 2 panels + "To be continued" teaser | ~20 s |

### Intro cutscene (4 panels, gibberish speech bubbles, no text needed)
1. Sunday evening. The fruits relax in the fruit bowl.
2. On the shelf, the appliances whisper. A calendar shows "Smoothie Monday".
   The Pulverizer (the blender) grins.
3. The fruits are shocked. Grandpa Apple stands up angrily.
4. He sticks two forks into a cork and stretches a rubber band between them.
   Title card: **Angry Fruit**.

### Outro (2 panels)
1. The Toast Tyrant lies in pieces. The fruits cheer.
2. On the top shelf the Pulverizer switches on, its blades spinning.
   "To be continued…"

---

## 3. Core Mechanic: The Fork Slingshot

Two forks in a wine cork with a red rubber band between them, on the left of the
level. The fortress is on the right.

1. **Load:** The next fruit hops from the fruit bowl into the band.
2. **Pull:** Drag the fruit away. Drag direction = opposite of launch direction,
   drag length = power (capped).
3. **Aim assist:** A dotted line shows the **first half** of the trajectory.
4. **Release:** The fruit flies, the band snaps back.
5. **Ability:** Tap once in flight to trigger the fruit's ability.
6. **Settle:** Wait until everything stops moving (below speed threshold for
   1.5 s, max 8 s).
7. **Result:** All appliances destroyed → win. Otherwise next fruit. No fruit
   left → loss.

**Physics rules**
- Rigid 2D bodies with gravity, friction, bounce and mass.
- Damage = impact energy. Every object has hit points.
- Appliances also take damage from falling or tipping over.
- **Fruit order is fixed** per level and shown in the fruit bowl.
- Used fruits vanish with a "plop" when the next shot starts.

---

## 4. Fruits

| Fruit | Mass | Ability (tap in flight) | Strong against |
|---|---|---|---|
| **Apple** | 1.0 | None – reliable standard shot | cardboard, wood |
| **Grape** | 0.4 × 5 | Splits into 5 berries in a ±15° fan | glass, spread-out targets |
| **Banana** | 0.8 | Boomerang: curves back to the left and hits targets from behind. Leaves a slippery banana peel. | targets behind cover |
| **Watermelon** | 4.0 | Bursts on impact (or on tap) into 3 chunks + 12 seeds as buckshot. Leaves a *wet* puddle. | walls, stacks |
| **Lemon** | 0.9 | Sprays juice in a 60° cone: enemies *blinded* and stumble; metal *rusts* (−50% HP) | groups, metal |
| **Kiwi** | 0.7 | Keeps rolling after landing (6 s), breaks cardboard. Tap: change direction once. | ground targets, tunnels |
| **Coconut** | 2.5 | Bounces up to 4 times. Tap: rock hard for 2 s (mass ×2) + downward push. | stone, metal |

---

## 5. Enemies (the Blender Gang)

Appliances with faces. They never attack.

| Appliance | HP | Behavior |
|---|---|---|
| **Egg Cup** | very low | Passive, small and wobbly. Tipping over is enough. |
| **Coffee Mug** | low | Passive. Sloshes when hit and makes neighbors *wet*. |
| **Whisk** | low | Spins when hit and flings small objects away. |
| **Immersion Blender** | medium | Wears a measuring-cup helmet. Knock it off first. |
| **Toaster** | high | Pops up toast every 5 s that lands as extra cover. *Wet* → short circuit explosion. |

**Humor details:** Eyes follow the flying fruit, a relieved puff of steam on a
near miss, band-aids when damaged, rattling laughter after a missed shot.

---

## 6. Materials, Objects & Status Effects

**Materials**

| Material | Look | HP | Special |
|---|---|---|---|
| **Cardboard** | Cereal boxes | low | Softens when *wet* (HP halved) |
| **Wood** | Cutting boards, spoons | medium | – |
| **Glass** | Mason jars | low | Shatters from small, hard hits (grapes) |
| **Metal** | Pots, cans | high | Rusts from lemon; conducts short circuits |

**Objects**
- **Soda bottle:** When hit, flies as a rocket after 1 s.
- **Mason jar with captive fruit:** Break it to free the fruit (bonus points).

**Status effects**

| Effect | Source | Result |
|---|---|---|
| **Wet** | Watermelon, coffee mug | Cardboard softens, toasters short-circuit |
| **Blinded** | Lemon | Enemies stumble randomly for 4 s |
| **Rusted** | Lemon on metal | Metal loses 50% HP |
| **Electrified** | Short circuit | Damage that jumps along touching metal |
| **Slippery** | Banana peel | Almost no friction |

---

## 7. Levels

### Tutorial – The Fruit Bowl
| Level | Teaches | Fruits |
|---|---|---|
| T1 | Pull and release | Apple ×3 |
| T2 | Materials break differently | Apple ×2 |
| T3 | Tap in flight | Grape ×2 |

Grandpa Apple shows each step with a hand/arrow animation. No walls of text.

### World 1 – The Countertop
Each new element is introduced safely first, then combined.

| Level | New element | Fruits |
|---|---|---|
| 1-1 | Tall tower, knock it over | Apple, Apple, Grape |
| 1-2 | Glass jars | Grape, Grape, Apple |
| 1-3 | **Banana** – enemy hidden behind a wall | Banana, Banana, Apple |
| 1-4 | **Watermelon** – wide wall | Watermelon, Apple, Grape |
| 1-5 | **Toaster** + wet = short circuit | Watermelon, Banana, Apple |
| 1-6 | **Lemon** – enemies on a ledge | Lemon, Lemon, Apple |
| 1-7 | **Kiwi** – tunnel under the fortress | Kiwi, Kiwi, Grape |
| 1-8 | **Coconut** – metal bunker | Coconut, Lemon, Apple |
| 1-9 | Soda bottle chain reaction | Apple, Grape, Watermelon |
| 1-10 | Big castle, everything combined | all 7, one each |

Each level has 1 mason jar with a captive fruit (optional).

### Boss – Toast Tyrant
A giant four-slice toaster with a health bar. Fruit is refilled each phase.
1. **Phase 1:** Hides behind a toast wall and pops up new toast every 4 s as cover.
   Break the cover faster than it grows.
2. **Phase 2:** Its slots are open. Wet fruit (watermelon) into the slots →
   short-circuit damage.
3. **Phase 3:** Stands on a wobbly board over the sink edge. Knock it off.

---

## 8. Score & Stars

| Action | Points |
|---|---|
| Appliance destroyed | 5,000 (Toaster 8,000) |
| Object destroyed | Cardboard 500 · Wood 700 · Glass 600 · Metal 1,000 |
| Captive fruit freed | 3,000 |
| Unused fruit on win | 10,000 each |
| Boss phase completed | 25,000 |

- **Juice Chain:** Several appliances destroyed in one shot → multiplier ×1.5, ×2, ×3.
- **Stars:** 1 = win, 2 and 3 via score thresholds per level.
- Level select screen shows stars per level. Progress is saved locally.

---

## 9. Feel, Art & Sound

- **Art:** 2D hand-drawn look, thick outlines, bright colors, side view. Fruits
  have angry eyebrows; eyes react to aiming, flight and impact.
- **Juice:** Squash & stretch on pull and launch, short slow motion on ability,
  camera shake on big collapses, slow motion + zoom on the last appliance falling.
- **Sound:** Creaking band while pulling, snap on release, material-specific
  impact sounds, gibberish voices, playful swing music with kitchen percussion.
- **Win/loss:** Fruits cheer / the gang laughs. Instant restart, no penalty.

---

## 10. Controls & Accessibility

| Action | Mouse / Touch |
|---|---|
| Aim & launch | Drag from the fruit, release |
| Ability | Click / tap anywhere |
| Pan & zoom | Right-drag / swipe, mouse wheel / pinch |
| Cancel aim | Drag fruit back into the band |
| Restart | Button (or R) |

- Status effects use icons, not only color.
- Camera shake can be turned off.
- After 5 losses a level can be skipped.

---

## 11. Implementation Notes

- **Data-driven:** Fruits, enemies, materials and levels defined as JSON.
- **Abilities as reusable building blocks** (`split`, `burst`, `boomerang`,
  `status_cone`, `roll`, `hard_bounce`).
- **One status system** with a rule table (`wet + toaster → short_circuit`).
- **Fixed time step physics** so levels behave the same every time.
- **Each level stores a reference solution** that an automated test replays to
  make sure the level is still winnable.

---

## 12. Out of Scope for the Demo

Everything else from [GAME_DESIGN_FULL.md](GAME_DESIGN_FULL.md), including:
more worlds and bosses, the 12 additional fruits, combos, ripeness upgrades,
recipe book, cosmetics and extra game modes.

**Decided:** enemies never shoot back · fixed fruit order · no monetization.
**Open:** Should the UI be bilingual (DE/EN)?
