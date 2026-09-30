# Wütendes Obst (Angry Fruit)

Ein 2D-Schleuderspiel im Stil von Angry Birds: Wütendes Obst schießt sich mit
einem Einmachgummi zwischen zwei Gabeln auf die Festungen der Mixer-Gang.

Dieser Stand ist die **Basis-Engine**: eine Schleuder, ein Projektil (Apfel),
ein Material (Holz) und die Physik. Das Spielkonzept steht in
[`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) (Demo) und
[`docs/GAME_DESIGN_FULL.md`](docs/GAME_DESIGN_FULL.md) (alle Ideen).

## Starten

```bash
npm install
npm run dev      # Entwicklungsserver, Adresse steht im Terminal
npm test         # Tests (Logik + Physik-Simulation ohne Grafik)
npm run build    # Typprüfung + Produktions-Build nach dist/
```

**Steuerung:** Apfel mit Maus oder Finger nach hinten ziehen, zielen,
loslassen. Zurück ins Gummi ziehen bricht ab. `R` oder der Knopf oben links
startet neu.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `src/game/` | Spielinhalte und Ablauf: Projektile, Materialien, Level-Daten, Schleuder-Mathematik, `Game` (Laden, Zielen, Fliegen, Punkte) |
| `src/engine/` | Technik ohne Grafik: Physikwelt (planck.js/Box2D), Schaden, Kamera, Partikel |
| `src/render/` | Canvas-Zeichnung: Hintergrund, Blöcke, Früchte, Schleuder, HUD |
| `tests/` | Vitest: Schaden, Schleuder, Level-Daten, Physik-Simulation mit Referenzschuss |

Physik läuft mit fester Schrittweite (60 Hz). Schaden entsteht aus dem
Aufprall-Impuls zwischen Körpern; Impulse unter einer Schwelle (ruhende Stapel)
richten keinen Schaden an.

## Erweitern

- **Neues Projektil:** Eintrag in `src/game/projectiles.ts` und eine
  Zeichenfunktion in `src/render/fruit.ts` (`DRAWERS`). Im Level unter
  `projectiles` eintragen.
- **Neues Material:** Eintrag in `src/game/materials.ts` (Dichte, Reibung,
  Lebenspunkte, Farben). Blöcke im Level mit `material: "<id>"` anlegen.
- **Neues Level:** `LevelDef` in `src/game/level.ts` anlegen. Blöcke sind
  Rechtecke mit Mittelpunkt, Breite, Höhe und optionaler Drehung, in Metern.
