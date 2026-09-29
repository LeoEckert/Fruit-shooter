# Wütendes Obst – Game Design Document

> Version 0.1 · Stand: 2026-09-29 · Status: Konzept (noch keine Implementierung)
>
> English version: [GAME_DESIGN.md](GAME_DESIGN.md)
>
> Dieses Dokument beschreibt Features, Inhalte und Regeln des Spiels. Es ist die
> Grundlage für die Implementierung durch weitere Agenten. Zahlenwerte sind
> Startwerte fürs Balancing, keine festen Vorgaben.

---

## Inhalt

1. [Vision & Pitch](#1-vision--pitch)
2. [Story & Welt](#2-story--welt)
3. [Core-Mechanik: Die Gabel-Schleuder](#3-core-mechanik-die-gabel-schleuder)
4. [Die Früchte](#4-die-früchte)
5. [Die Mixer-Gang (Gegner)](#5-die-mixer-gang-gegner)
6. [Baumaterialien & Objekte](#6-baumaterialien--objekte)
7. [Statuseffekte & Kettenreaktionen](#7-statuseffekte--kettenreaktionen)
8. [Welten & Levelstruktur](#8-welten--levelstruktur)
9. [Bosskämpfe](#9-bosskämpfe)
10. [Punkte, Sterne & Bewertung](#10-punkte-sterne--bewertung)
11. [Progression & Meta-Spiel](#11-progression--meta-spiel)
12. [Zusätzliche Spielmodi](#12-zusätzliche-spielmodi)
13. [Game Feel, Grafik & Sound](#13-game-feel-grafik--sound)
14. [Steuerung & Barrierefreiheit](#14-steuerung--barrierefreiheit)
15. [Hinweise für die Implementierung](#15-hinweise-für-die-implementierung)
16. [Umfang: MVP und Ausbaustufen](#16-umfang-mvp-und-ausbaustufen)
17. [Offene Fragen](#17-offene-fragen)

---

## 1. Vision & Pitch

**Ein Satz:** Physik-Schleuderspiel in 2D, in dem wütendes Obst mit einem
Einmachgummi-Katapult die Küchengeräte-Festungen der Mixer-Gang zum Einsturz
bringt, bevor es morgen früh zu Smoothie verarbeitet wird.

**Säulen des Designs**

| Säule | Bedeutung |
|---|---|
| **Schießen ist alles** | Jede Mechanik baut auf dem Schuss auf. Kein Laufen, kein Bauen, keine Menüs im Level. Zielen, loslassen, im Flug einmal tippen. |
| **Chaos mit Ursache** | Einstürze und Kettenreaktionen sind spektakulär, aber nachvollziehbar. Wer das Level versteht, kann das Chaos planen. |
| **Küchenlogik** | Jede Regel ergibt im Alltag Sinn: Saft macht nass, nasse Toaster schlagen Funken, Eis rutscht, Honig klebt. Spieler sollen Wechselwirkungen erraten können. |
| **Albern, nie gemein** | Slapstick statt Gewalt. Geräte gehen kaputt, fallen um, klappern, jammern. Obst platzt in Saft, nicht in Blut. |
| **Kurz und wiederholbar** | Ein Level dauert 30 bis 90 Sekunden. Neustart ist sofort möglich. |

**Zielgruppe:** Gelegenheitsspieler ab 8 Jahren, Mobile (Touch) und Browser
(Maus). Querformat.

---

## 2. Story & Welt

### Ausgangslage

Es ist Sonntagabend. In der Obstschale liegen die Früchte und hören, wie die
Küchengeräte im Regal flüstern: Morgen um 7 Uhr ist „Smoothie-Montag". Die
Mixer-Gang unter ihrem Anführer, dem **Pürierer** (ein alter Standmixer mit
Chromhaube), hat sich im Küchenregal verschanzt, Festungen aus Müslipackungen,
Einmachgläsern und Schneidebrettern gebaut und das beste Obst schon in Gläser
gesperrt.

Die Früchte schlagen zurück. Opa Apfel spannt ein Einmachgummi zwischen zwei
Gabeln, die in einem Korken stecken, und die Schlacht beginnt.

### Erzählstruktur

- Die Story läuft in **kurzen Comic-Zwischensequenzen** (3–5 Standbilder, ohne
  Text oder mit wenigen Sprechblasen in Kauderwelsch) zwischen den Welten.
- Jede Welt endet mit einem **Bosskampf** gegen ein Mitglied der Mixer-Gang.
- Übergeordneter Zeitdruck: Jede Welt zeigt eine **Küchenuhr**, die von 20:00
  bis 07:00 läuft. Rein erzählerisch, kein Gameplay-Timer.

### Die Welt-Uhr (Kapitel)

| Uhrzeit | Kapitel | Ereignis |
|---|---|---|
| 20:00 | Prolog | Die Früchte belauschen die Gang. Tutorial. |
| 22:00 | Welt 1 | Angriff auf die Arbeitsplatte. |
| 00:00 | Welt 2 | Der Kühlschrank wird geöffnet – gefangene Beeren befreien. |
| 02:00 | Welt 3 | Der Backofen heizt auf. |
| 03:30 | Welt 4 | Überschwemmung im Spülbecken. |
| 05:00 | Welt 5 | Die Speisekammer und das Gewürzregal. |
| 06:30 | Welt 6 | Showdown auf dem Küchenregal gegen den Pürierer. |
| 07:00 | Epilog | Der Mensch kommt in die Küche, alles steht still. Er sieht nur Chaos und macht Toast. |

### Nebenfiguren

- **Opa Apfel** – Anführer, erklärt im Tutorial alles, trägt eine Lesebrille.
- **Die Gefangenen** – in jedem Level eingesperrte Früchte in Einmachgläsern.
  Befreien ist optional und bringt Bonus (siehe [10](#10-punkte-sterne--bewertung)).
- **Die Fruchtfliege** – fliegt als Maskottchen durchs Menü, gibt Tipps, wenn
  ein Level dreimal hintereinander verloren wurde.

---

## 3. Core-Mechanik: Die Gabel-Schleuder

### Aufbau

Zwei Gabeln stecken in einem Weinkorken, dazwischen ist ein rotes Einmachgummi
gespannt. Die Schleuder steht links im Level, die Festung rechts.

### Ablauf eines Schusses

1. **Laden:** Die nächste Frucht hüpft automatisch aus der Obstschale in das Gummi.
2. **Spannen:** Spieler zieht die Frucht vom Gummi weg. Zugrichtung = umgekehrte
   Abschussrichtung. Zuglänge = Kraft (begrenzt auf einen maximalen Radius).
3. **Zielhilfe:** Während des Ziehens zeigt eine gepunktete Linie die **erste
   Hälfte** der Flugbahn. Die zweite Hälfte bleibt geheim (Skill-Anteil).
4. **Loslassen:** Die Frucht fliegt, das Gummi schnalzt hörbar zurück.
5. **Fähigkeit:** Einmal tippen während des Flugs löst die Spezialfähigkeit aus
   (je Frucht verschieden, siehe [4](#4-die-früchte)). Nur einmal pro Schuss.
6. **Ruhephase:** Die Kamera folgt der Frucht und wartet, bis sich alle Objekte
   beruhigt haben (Geschwindigkeit unter Schwelle für 1,5 s, maximal 8 s).
7. **Auswertung:** Sind alle Geräte der Mixer-Gang kaputt → Sieg. Sonst nächste
   Frucht. Keine Frucht mehr → Niederlage.

### Physik-Grundregeln

- Starre 2D-Körper mit Schwerkraft, Reibung, Rückprall und Masse.
- **Schaden = Aufprallenergie** (relative Geschwindigkeit² × Masse, skaliert).
  Jedes Objekt hat Lebenspunkte. Schaden an Objekten entsteht durch Früchte,
  durch andere fallende Objekte und durch Stürze.
- Geräte der Mixer-Gang nehmen auch Schaden, wenn sie **umfallen oder
  herunterfallen**. Ein Stupser von der Kante ist ein legitimer Kill.
- Früchte bleiben nach dem Schuss als physikalische Objekte liegen, bis der
  nächste Schuss startet. Dann verschwinden sie mit einem „Plopp" (keine
  unbegrenzten Körper im Level).

### Schleuder-Extras (werden im Spielverlauf freigeschaltet)

| Extra | Wirkung |
|---|---|
| **Doppelgummi** | Einmal pro Level: +30 % Abschusskraft für einen Schuss. |
| **Löffel-Katapult** | Alternative Schleuder in manchen Levels: hoher Bogen, fest eingestellte Kraft, nur Winkel wählbar. |
| **Bewegliche Schleuder** | In manchen Levels steht die Schleuder auf einem Rollbrett und kann vor dem Schuss auf einer Schiene verschoben werden. |
| **Zweite Schleuder** | Einzelne Levels haben zwei Schleudern (links unten, links oben), Spieler wählt vor jedem Schuss. |

---

## 4. Die Früchte

### 4.1 Überblick

Alle Werte relativ zum Apfel (= 1,0).

| Frucht | Masse | Größe | Rückprall | Fähigkeit (Tippen im Flug) | Stark gegen | Schwach gegen |
|---|---|---|---|---|---|---|
| **Apfel** | 1,0 | 1,0 | mittel | keine – Standardschuss | Pappe, Holz | Metall |
| **Wassermelone** | 4,0 | 2,2 | niedrig | platzt beim Aufprall, Kerne als Schrot | Wände, Stapel | hohe Ziele (schwerer Bogen) |
| **Traube** | 0,4 × 5 | 0,5 | mittel | zerfällt in 5 Beeren (Fächer) | Glas, verteilte Ziele | Metall, Holz |
| **Banane** | 0,8 | 1,2 | niedrig | Bumerang-Kurve zurück | Ziele hinter Deckung | offene Ziele |
| **Zitrone** | 0,9 | 0,9 | mittel | spritzt Saft im Kegel, Gegner geblendet | Gegnergruppen, Metall (Rost) | Stabile Bauwerke |
| **Kokosnuss** | 2,5 | 1,1 | hoch | Tippen macht sie noch härter + Extra-Sprung | Stein, Metall | – (aber langsam) |
| **Kiwi** | 0,7 | 0,8 | niedrig | rollt nach Landung unaufhaltsam weiter | Bodenziele, Gänge | Türme |

### 4.2 Die Startfrüchte im Detail

#### Apfel – „Der Zuverlässige"
- **Rolle:** Standardschuss, erste Frucht im Spiel, Referenz für alle Werte.
- **Fähigkeit:** Keine. Dafür am genauesten vorhersehbar.
- **Upgrade-Idee (Reife-System):** Ab Reifestufe 3 hinterlässt er beim Aufprall
  eine Delle, die das getroffene Objekt dauerhaft um 10 % schwächt.
- **Charakter:** Grimmig, rote Backen, Stielfrisur.

#### Wassermelone – „Die Walze"
- **Flug:** Schwer, flacher Bogen, braucht viel Zug.
- **Aufprall (automatisch):** Beim ersten starken Aufprall (Schwelle) platzt
  sie. Das Fruchtfleisch zerfällt in 3 große Stücke (physikalisch, wirken wie
  kleine Äpfel), dazu 12 Kerne als Schrot im 90°-Kegel in Flugrichtung.
- **Tippen im Flug:** Löst das Platzen **sofort** aus – Kerne regnen dann von
  oben herab („Kernhagel"), gut gegen Gegner in offenen Etagen.
- **Nebeneffekt:** Hinterlässt eine **rosa Saftpfütze** (Statuseffekt *nass*,
  siehe [7](#7-statuseffekte--kettenreaktionen)).

#### Traube – „Die Salve"
- **Flug:** Leicht, schnell.
- **Tippen im Flug:** Zerfällt in **5 Beeren**, die sich in einem Fächer von
  ±15° verteilen und die Restgeschwindigkeit übernehmen.
- **Besonderheit:** Beeren sind stark gegen **Glas** (Glas zerspringt schon bei
  geringer Energie, wenn es von kleinen, harten Objekten getroffen wird).
- **Zweites Tippen (Upgrade):** Beeren platzen und machen alles in kleinem
  Radius *klebrig*.

#### Banane – „Der Bumerang"
- **Flug:** Normaler Bogen, rotiert sichtbar.
- **Tippen im Flug:** Die Banane beschleunigt und fliegt eine **Kurve zurück
  nach links** (Halbkreis nach oben). Trifft so Ziele von hinten, z. B. Geräte,
  die hinter einer Wand in Richtung Schleuder geschützt sind.
- **Regel:** Die Kurvenrichtung ist immer gleich (gegen den Uhrzeigersinn), der
  Radius hängt von der Geschwindigkeit beim Tippen ab. Schnell = weit.
- **Nach dem Aufprall:** Hinterlässt eine **Bananenschale** als Objekt.
  Gegner, die darauf treten oder rutschen, fallen um (Slapstick-Garantie).

#### Zitrone – „Die Saure"
- **Tippen im Flug:** Spritzt einen **Saftstrahl im 60°-Kegel nach vorne unten**
  (Reichweite ca. 4 Apfelbreiten).
- **Effekt auf Gegner:** Getroffene Geräte werden *geblendet* für 4 s: Sie
  kneifen die Augen zu, drehen sich, stolpern ein paar Schritte in zufällige
  Richtung (kleiner Impuls). Auf Kanten führt das oft zum Absturz.
- **Effekt auf Metall:** Macht Metallobjekte *sauer* → sie **rosten** in 3 s
  und verlieren 50 % ihrer Lebenspunkte.
- **Zitrone selbst:** Macht wenig Aufprallschaden.

#### Kokosnuss – „Der Stein"
- **Flug:** Schwer, sehr hoher Rückprall, verliert pro Aufprall nur 20 %
  Geschwindigkeit.
- **Passiv:** Prallt bis zu **4-mal** ab, bevor sie liegen bleibt.
- **Tippen im Flug:** Die Kokosnuss wird für 2 s **steinhart** (Masse ×2) und
  bekommt einen kleinen Impuls nach unten – ideal, um von oben durch Etagen zu
  brechen.
- **Einzige Frucht, die Stein und Metall zuverlässig zerstört.**

#### Kiwi – „Der Roller"
- **Flug:** Klein, flach.
- **Nach der Landung:** Rollt **unaufhaltsam weiter** mit konstanter
  Geschwindigkeit, klettert kleine Stufen, schiebt kleine Objekte weg und
  durchbricht Pappe.
- **Tippen im Flug oder beim Rollen:** Richtungswechsel (einmal). Gut in
  Tunneln und Kellern unter der Festung.
- **Stopp:** Bleibt stehen, wenn sie gegen eine Wand trifft, die sie nicht
  durchbricht, oder nach 6 s.

### 4.3 Neue Früchte (Erweiterungen)

Werden über die Welten freigeschaltet. Jede Welt führt 1–2 neue Früchte ein.

| Frucht | Fähigkeit | Idee dahinter |
|---|---|---|
| **Chilischote** | Tippen: Nachbrenner – schießt gerade in Zielrichtung und **entzündet** beim Aufprall brennbare Objekte (Pappe, Holz, Öl). | Feuer-Kettenreaktionen, Welt 3 (Backofen). |
| **Ananas** | Tippen: Bleibt kurz in der Luft stehen, dann feuert sie ihre **Blätter wie Wurfsterne** in 3 Richtungen. Beim Aufprall: kleine Explosion (Handgranaten-Optik). | Die „Bombe" des Spiels. |
| **Kirschen** | Zwei Kirschen an einem Stiel. Tippen: **Stiel reißt**, beide fliegen getrennt – eine nach oben, eine nach unten. | Zwei Ziele mit einem Schuss. |
| **Erdbeere** | Tippen: Wirft ihre **Samen als Klebepunkte** nach unten. Getroffene Objekte werden kurz *klebrig* und kleben aneinander. | Stabilisiert/verklebt – überraschend taktisch (siehe Rätsel-Levels). |
| **Granatapfel** | Beim Aufprall: **Clusterbombe** – platzt in 20 Kerne, die in alle Richtungen springen und selbst noch einmal abprallen. | Chaos pur, spät im Spiel. |
| **Avocado** | Tippen: Wirft ihren **Kern** nach vorne (schwer, schnell), die leere Hülle fliegt weiter. | Präzisionsschuss mit Rest. |
| **Blaubeeren** | Kommen als **Dreierpack** in einem Schuss, jede Beere einzeln per Tippen „abfeuerbar" (Mini-Kanone, 3 Tipps). | Mehrfach-Tippen als Variation. |
| **Durian** | Tippen: Setzt eine **Stinkwolke** frei. Gegner in der Wolke fliehen (bewegen sich von der Wolke weg) – oft über die Kante. | Kontrollfrucht. |
| **Pflaume** | Tippen: **Schrumpft** sich zur Dörrpflaume (halbe Größe, dreifache Dichte) und fliegt durch Lücken. | Präzisionsfrucht für enge Löcher. |
| **Mango** | Tippen: Gleitet wie ein **Papierflieger** in flachem Winkel weit nach vorne. | Reichweite für riesige Levels. |
| **Orange** | Tippen: Schält sich – die Schale fliegt als **Schutzschild** vor ihr her und bricht Glas, die Orange selbst rollt weiter. | Zweistufiger Durchbruch. |
| **Maracuja** | Passiv: Wird bei jedem Aufprall **schneller** statt langsamer (bis 3 Abpraller). | Flipper-Level. |

**Geheime Frucht:** **Die Goldene Birne** – wird durch das Sammeln aller
Rezeptkarten (siehe [11](#11-progression--meta-spiel)) freigeschaltet. Tippen:
Alles im Bildschirm wird für 2 s in **Zeitlupe** versetzt, und die Birne kann
einmal neu ausgerichtet werden (zweites Zielen mitten im Flug).

### 4.4 Frucht-Reihenfolge und Obstschale

- **Standard:** Jedes Level legt die **Reihenfolge** der Früchte fest (wie im
  Vorbild). Die Obstschale links neben der Schleuder zeigt alle kommenden Früchte.
- **Ab Welt 3 – „Obstkorb-Levels":** Einzelne Levels erlauben, die **Reihenfolge
  frei zu wählen** (Tippen auf eine Frucht in der Schale lädt sie).
- **Übrige Früchte = Bonuspunkte** (siehe [10](#10-punkte-sterne--bewertung)).
  Beim Sieg hüpfen sie jubelnd aus der Schale.

### 4.5 Frucht-Kombos

Wenn eine Frucht einen Effekt trifft, den eine frühere Frucht hinterlassen hat,
entsteht eine **Kombo** mit Bonuspunkten und einem kurzen Schriftzug.

| Kombo | Auslöser | Wirkung |
|---|---|---|
| **Obstsalat** | 3 verschiedene Früchte liegen innerhalb eines kleinen Radius | +5 000 Punkte, Konfetti aus Fruchtstücken |
| **Limonade** | Zitronensaft trifft Wassermelonen-Pfütze | Pfütze wird *sauer*: alles darin rostet/wird geblendet |
| **Flambiert** | Chili entzündet Bananenschale oder Saftpfütze mit Alkohol-Flasche | Stichflamme, großer Radius |
| **Kokos-Bowling** | Kokosnuss trifft liegende Kiwi | Kiwi bekommt doppelte Geschwindigkeit |
| **Rumtopf** | Kirsche landet in einem Einmachglas | Glas explodiert |
| **Bananensplit** | Banane fliegt durch die Kerne einer platzenden Wassermelone | Banane teilt sich in 3 Bumerangs |

Kombos sollen **entdeckt** werden. Sie werden nicht erklärt, sondern beim
ersten Auslösen im Rezeptbuch eingetragen.

---

## 5. Die Mixer-Gang (Gegner)

Die Gegner sind Küchengeräte mit Gesichtern (Knöpfe als Augen, Kabel als
Schwanz). Sie **greifen in den meisten Fällen nicht an** – sie sind die Ziele.
Einige Geräte haben aber **aktives Verhalten**, das die Festung verändert.
Dadurch entsteht Abwechslung, ohne dass der Spieler etwas anderes tun muss als
schießen.

### 5.1 Fußvolk

| Gerät | LP | Verhalten | Schwachstelle |
|---|---|---|---|
| **Eierbecher** | sehr niedrig | Passiv. Das „Schwein" des Spiels: klein, zahlreich, wackelig. | Umfallen reicht. |
| **Schneebesen** | niedrig | Dreht sich, wenn getroffen, und schleudert kleine Objekte weg. | Draht verbiegt leicht. |
| **Kaffeetasse** | niedrig | Passiv. Schwappt, wenn getroffen – macht Nachbarn *nass*. | Porzellan. |
| **Pürierstab** | mittel | Passiv, trägt einen Helm aus Messbecher. | Helm abschießen, dann schwach. |
| **Eierschneider** | mittel | Zerschneidet Früchte, die ihn **langsam** berühren (unter Geschwindigkeitsschwelle) – schnelle Treffer zerstören ihn. | Hart und schnell treffen. |
| **Käsereibe** | mittel | Früchte, die an ihr **entlangrutschen**, verlieren Masse (werden gerieben). | Kokosnuss. |

### 5.2 Spezialisten

| Gerät | LP | Verhalten |
|---|---|---|
| **Toaster** | hoch | Alle 5 s springt Toast heraus. Toast ist ein Objekt, das auf der Festung liegenbleibt (Füllmaterial). *Nass* → **Kurzschluss**: Explosion mit Funken. |
| **Saftpresse** | hoch | Fängt eine Frucht, die frontal auftrifft, und **presst sie aus** (Frucht verloren, Saftpfütze entsteht). Von oben oder hinten verwundbar – Banane! |
| **Handmixer** | mittel | Schwebt an seinem Kabel (hängt von der Decke). Pendelt. Kabel treffen → fällt runter. |
| **Wasserkocher** | mittel | Kocht nach 10 s über: **Dampfstoß** nach oben, der fliegende Früchte ablenkt. Getroffen: verbrüht Nachbarn mit heißem Wasser (Schaden). |
| **Mikrowelle** | sehr hoch | Tür öffnet und schließt sich im Takt. Offen = ein Fruchtschuss hinein schließt die Tür, nach 2 s **explodiert die Frucht** darin (großer Innenschaden). |
| **Waage** | mittel | Kippt Plattformen: Was auf einer Seite liegt, hebt die andere. Physikalisches Rätselelement. |
| **Staubsauger-Roboter** | mittel | Fährt auf dem Boden hin und her und **saugt liegende Früchte ein** (Kiwi-Konter). Schiebt kleine Objekte. |
| **Messerblock** | hoch | Schießt alle 6 s ein Messer waagerecht Richtung Schleuder. Trifft es eine Frucht **im Flug**, wird diese halbiert (zwei schwächere Hälften fliegen weiter). Einziger „schießender" Gegner. |
| **Kühlschrankmagnet** | niedrig | Zieht in kleinem Radius Metall an und hält Konstruktionen zusammen, bis er zerstört wird – dann fällt alles auseinander. |
| **Eiswürfelbereiter** | mittel | Friert Früchte ein, die ihn treffen (Frucht wird zum Eisblock: rutscht, schwer, bricht). |

### 5.3 Die Bosse (Überblick)

| Welt | Boss | Kurzbeschreibung |
|---|---|---|
| 1 | **Toast-Tyrann** | Riesiger Vierscheibentoaster, siehe [9](#9-bosskämpfe) |
| 2 | **Frostbeule** | Alter Kühlschrank mit Gefrierfach-Mund |
| 3 | **Madame Heißluft** | Heißluftfritteuse |
| 4 | **Kapitän Spülmaschine** | Spülmaschine als Schiff im Spülbecken |
| 5 | **Die Gewürzmühle** | Pfeffermühlen-Duo (Pfeffer & Salz) |
| 6 | **Der Pürierer** | Standmixer, Anführer der Gang |

### 5.4 Gegner-Reaktionen (Humor)

- Gegner **gucken** der Frucht mit den Augen nach, während sie fliegt.
- Wenn eine Frucht knapp vorbeifliegt: Erleichtertes Ausatmen (Dampfwölkchen).
- Wenn ein Gerät fällt, aber überlebt: Es bekommt Risse und ein Pflaster.
- Überlebende Geräte **lachen** nach einem verfehlten Schuss (Klappern).
- Kaputte Geräte zerfallen in Einzelteile (Schrauben, Federn, Knöpfe), die kurz
  herumhüpfen und dann verblassen.

---

## 6. Baumaterialien & Objekte

### 6.1 Grundmaterialien

| Material | Küchen-Optik | LP | Dichte | Besonderheit |
|---|---|---|---|---|
| **Pappe** | Müslipackungen, Eierkartons | niedrig | leicht | brennbar, wird *nass* weich (LP halbiert) |
| **Holz** | Schneidebretter, Kochlöffel, Zahnstocher | mittel | mittel | brennbar |
| **Glas** | Einmachgläser, Trinkgläser | niedrig | mittel | zerspringt bei harten, kleinen Treffern; Scherben sind harmlos |
| **Porzellan** | Teller, Tassen | niedrig–mittel | mittel | zerspringt in wenige große Teile, die weiterfallen |
| **Metall** | Töpfe, Pfannen, Dosen | hoch | schwer | rostet durch Zitrone; leitet Strom (Toaster!) |
| **Stein** | Mörser, Marmorbrett | sehr hoch | sehr schwer | nur Kokosnuss/Ananas effektiv |
| **Spaghetti** | ungekochte Spaghettibündel | sehr niedrig | sehr leicht | brechen, sobald man sie ansieht; *nass* → werden weich und hängen durch |
| **Wackelpudding** | Götterspeise-Blöcke | – (unzerstörbar) | mittel | extrem elastisch, Früchte prallen wie vom Trampolin ab |
| **Eis** | Eiswürfel, Eisplatten | mittel | mittel | fast keine Reibung; schmilzt bei Feuer zu Wasser (*nass*) |
| **Tupperdose** | Plastikdosen | mittel | leicht | unzerstörbar für kleine Früchte, federt; Deckel kann aufspringen |

### 6.2 Interaktive Objekte

| Objekt | Wirkung |
|---|---|
| **Sprudelflasche** | Getroffen oder geschüttelt: fliegt nach 1 s als **Rakete** in die Richtung, in die ihr Hals zeigt. |
| **Mehlsack** | Platzt in eine **Staubwolke**, die die Sicht auf einen Bereich 3 s lang verdeckt. Mehl + Feuer = **Staubexplosion**. |
| **Ölflasche** | Hinterlässt eine *rutschige* Fläche. Brennbar. |
| **Honigglas** | Macht alles in der Nähe *klebrig*. |
| **Gasherd-Flamme** | Dauerhafte Feuerquelle an festen Positionen. |
| **Popcorn-Tüte** | Bei Hitze: Popcorn **explodiert** in hunderte leichte Körner, die alles leicht anstupsen. |
| **Schneebesen-Feder / Springform** | Trampolin: schleudert Früchte hoch. |
| **Kochtopfdeckel** | Kann als Schild an einem Scharnier klappen. |
| **Wäscheklammer an Schnur** | Seile/Aufhängungen: Durchtrennen (Banane, Messer) lässt Objekte fallen. |
| **Nudelholz** | Rollt auf schrägen Flächen los, sobald es angestoßen wird. |
| **Salzstreuer** | Salz schmilzt Eis in einem kleinen Radius. |
| **Einmachglas mit Gefangenen** | Enthält eine gefangene Frucht. Glas zerstören = Befreiung (Bonus). |
| **Goldener Löffel** | Verstecktes Sammelobjekt in manchen Levels (Treffen = gesammelt). |

### 6.3 Umgebung

| Element | Wirkung |
|---|---|
| **Ventilator** | Konstante Windzone, lenkt Früchte ab (sichtbar durch Partikel). |
| **Dunstabzugshaube** | Sog nach oben in einem Bereich. |
| **Wasserhahn** | Wasserstrahl, macht alles darunter *nass* und drückt leichte Objekte nach unten. |
| **Förderband** (Spülmaschinenkorb / Brotschneidemaschine) | Bewegt Objekte und Gegner horizontal. |
| **Wasseroberfläche** (Spülbecken) | Auftrieb: leichte Früchte schwimmen, schwere sinken. Pappe saugt sich voll. |
| **Heiße Herdplatte** | Früchte, die darauf liegen bleiben, werden *gebacken* (siehe unten). |
| **Katzenpfote** | Easter Egg in manchen Levels: Eine Katze wischt nach 20 s Inaktivität über das Level. |

---

## 7. Statuseffekte & Kettenreaktionen

Statuseffekte machen Wechselwirkungen vorhersehbar. Jeder Effekt hat eine
klare Optik (Farbe/Partikel).

| Effekt | Optik | Quelle | Wirkung |
|---|---|---|---|
| **Nass** | blaue Tropfen | Wassermelone, Wasser, Kaffeetasse, geschmolzenes Eis | Pappe weich, Toaster/Elektrogeräte **Kurzschluss**, Feuer gelöscht |
| **Sauer** | gelbe Blasen | Zitrone | Gegner geblendet; Metall rostet (−50 % LP) |
| **Brennend** | Flammen | Chili, Herdflamme | Holz/Pappe verlieren LP über Zeit, Feuer springt auf Nachbarn über |
| **Klebrig** | goldene Fäden | Honig, Erdbeere, Traube (Upgrade) | Objekte kleben aneinander (Gelenk), Früchte bleiben haften |
| **Rutschig** | Glanz | Öl, Eis, Bananenschale | Reibung fast 0 |
| **Gefroren** | Eiskristalle | Eiswürfelbereiter, Gefrierfach | Objekt wird spröde (Glasverhalten), Früchte werden Eisblöcke |
| **Gebacken** | braune Kruste | Herdplatte, Backofen | Früchte werden härter (+Masse, −Rückprall); Pappe verkohlt |
| **Geblendet** | zusammengekniffene Augen | Zitrone, Mehlwolke | Gegner stolpern zufällig |
| **Unter Strom** | Blitze | Kurzschluss, Metall in Kontakt mit Toaster | Schaden über Zeit, springt über Metall weiter |

### Beispiel-Kettenreaktionen (Level-Design-Vorlagen)

1. **Der Kurzschluss:** Wassermelone platzt über dem Toaster → Toaster nass →
   Kurzschluss → Strom wandert durch Metalltöpfe → drei Pürierstäbe fallen.
2. **Das Feuerwerk:** Chili trifft Ölflasche → Öl brennt → Popcorn-Tüte darüber
   poppt → Körner stupsen die Sprudelflasche → Rakete fliegt in den Messerblock.
3. **Das Eisrutschen:** Salzstreuer umwerfen → Eisplatte schmilzt an einer
   Stelle → Turm kippt → rutscht über Eis bis zur Kante.
4. **Die Staubexplosion:** Traube zerstört Mehlsack → Wolke → Chili hinein → Boom.

---

## 8. Welten & Levelstruktur

### 8.1 Übersicht

Jede Welt hat **15 Levels + 1 Bosslevel + 3 Bonuslevels** (freigeschaltet über
Sterne). Pro Welt kommt **ein neues Kernthema**, das durch Material, Gegner und
Umgebung getragen wird.

| # | Welt | Thema / Mechanik | Neue Früchte | Neue Gegner / Objekte |
|---|---|---|---|---|
| 0 | **Die Obstschale** (Tutorial, 5 Levels) | Zielen, Spannen, Tippen | Apfel, Traube | Eierbecher, Pappe, Holz |
| 1 | **Die Arbeitsplatte** | Grundlagen, Glas, erste Kettenreaktionen | Banane, Wassermelone | Toaster, Schneebesen, Pürierstab, Glas |
| 2 | **Der Kühlschrank** | Eis, Rutschen, mehrere Etagen (Fächer) | Kiwi, Blaubeeren | Eiswürfelbereiter, Kühlschrankmagnet, Eis, Tupper |
| 3 | **Der Backofen** | Feuer, Hitze, Backen | Chilischote, Kokosnuss | Wasserkocher, Mikrowelle, Herdflamme, Popcorn |
| 4 | **Das Spülbecken** | Wasser, Auftrieb, Strömung | Zitrone, Orange | Saftpresse, Staubsauger-Roboter, Wasserhahn, Wasser |
| 5 | **Speisekammer & Gewürzregal** | Staub, Kleben, Verstecke, Seile | Erdbeere, Durian, Kirschen | Käsereibe, Waage, Mehl, Honig, Spaghetti |
| 6 | **Das Küchenregal** | Alles kombiniert, riesige Festungen | Ananas, Granatapfel | Messerblock, Eierschneider, Wackelpudding |
| ★ | **Der Garten** (Post-Game) | Grill, Wind, Rasensprenger | Mango, Maracuja, Avocado, Pflaume | Grillzange-Gang (Bonus-Fraktion) |

### 8.2 Level-Archetypen

Damit sich 100+ Levels unterscheiden, wird jedes Level einem Archetyp
zugeordnet. Die Welt gibt das Material vor, der Archetyp die Struktur.

| Archetyp | Beschreibung |
|---|---|
| **Der Turm** | Hoch, schmal, wackelig. Ein guter Treffer unten bringt alles zum Einsturz. |
| **Die Burg** | Breit, mehrschichtig, Gegner in Kammern. Braucht mehrere Schüsse. |
| **Der Bunker** | Flach, massiv, Gegner hinter Metall. Kokosnuss/Kiwi-Rätsel. |
| **Das Uhrwerk** | Eine vorbereitete Kettenreaktion. Ein präziser Schuss löst alles aus. |
| **Die Hängebrücke** | Objekte an Schnüren über Abgründen. |
| **Die Weitschuss-Arena** | Festung weit entfernt, Kamera muss zoomen, Wind. |
| **Das Versteck** | Gegner hinter der Festung, nur per Bumerang oder Abpraller erreichbar. |
| **Die Etagen** | Kühlschrankfächer, Regalböden – Gegner übereinander. |
| **Das Fließband** | Bewegliche Ziele. Timing ist Teil des Schusses. |

### 8.3 Level-Regeln

- Jedes Level definiert: Früchte (Reihenfolge), Gegner, Objekte, Umgebung,
  Kamera-Grenzen, Punkteschwellen für 1/2/3 Sterne.
- **Mindestens eine Lösung** mit weniger Früchten als verfügbar muss existieren
  (für 3 Sterne).
- Einführung neuer Elemente nach dem **Dreischritt:** (1) sicher zeigen, (2) mit
  Bekanntem kombinieren, (3) überraschend einsetzen.
- Jede Welt hat ein **„Sandkasten-Level"** mit übertrieben vielen Früchten und
  Kettenreaktionen – reiner Spaß, kaum Herausforderung.

---

## 9. Bosskämpfe

Bosse sind Mehrphasen-Level. Der Boss hat eine sichtbare **Lebensleiste**. Er
kann nur an **Schwachstellen** Schaden nehmen, die sich pro Phase ändern. Nach
jeder Phase baut die Gang die Festung teilweise neu auf (Animation). Früchte
werden pro Phase neu aufgefüllt, Gesamtpunkte zählen.

### Welt 1 – Toast-Tyrann
- **Phase 1:** Steht hinter einer Mauer aus Toastscheiben. Schleudert alle 4 s
  Toast, der als neue Deckung liegenbleibt. → Deckung schneller abbauen, als er
  nachlegt.
- **Phase 2:** Hebel an der Seite sichtbar. Treffer → er springt hoch und
  landet unsanft. → Nasse Früchte in die Schlitze = Kurzschluss-Schaden.
- **Phase 3:** Steht auf Wackelplatte über der Spüle. Umwerfen.

### Welt 2 – Frostbeule
- Öffnet sein Gefrierfach und **friert** fliegende Früchte in einem Kegel ein.
- Schwachstelle: der Kompressor hinten (Banane) und das Türscharnier (Kokosnuss).
- Phase 3: Die Tür steht offen und alles rutscht auf Eis; Salz nutzen.

### Welt 3 – Madame Heißluft
- Pustet heiße Luft: Windzone, die Früchte nach oben ablenkt und sie *backt*.
- Gebackene Früchte sind härter – der Spieler nutzt die Boss-Mechanik gegen sie.
- Schwachstelle: der Frittierkorb, der in Phase 2 herausfährt.

### Welt 4 – Kapitän Spülmaschine
- Schwimmt im Spülbecken, **schaukelt** mit den Wellen (bewegliches Ziel).
- Feuert Spülmaschinen-Tabs als Kanonenkugeln auf Schaumplattformen.
- Phase 2: Spülbeckenstöpsel treffen → Wasser läuft ab → das Schiff sitzt auf
  und kippt.

### Welt 5 – Die Gewürzmühle
- Zwei Bosse gleichzeitig (Pfeffer und Salz), verbunden durch eine Kette.
- Pfeffer macht niesen (Luftstoß, Früchte abgelenkt), Salz schmilzt Eis und
  macht Früchte schwer (salzig = Masse ×1,5).
- Beide müssen **innerhalb von 10 s** nacheinander besiegt werden, sonst mahlt
  der Überlebende den anderen wieder heil.

### Welt 6 – Der Pürierer
- **Phase 1:** Thront ganz oben auf dem Küchenregal in einer Festung aus allen
  Materialien. Klassischer Einsturz nötig.
- **Phase 2:** Er schaltet auf Stufe 3: Die Messer im Mixbecher drehen sich,
  **Sog** zieht alle Früchte in der Nähe in den Becher (Frucht verloren) →
  Kokosnuss oder gefrorene Früchte hineinschießen, die die Messer **blockieren**.
- **Phase 3:** Deckel fliegt ab, Kabel liegt frei. Das Kabel zur Steckdose
  zieht sich durchs ganze Level – mit Banane durchtrennen oder mit Wasser in die
  Steckdose (Kurzschluss, finaler Knall, das Licht geht aus).
- **Epilog:** Das Licht geht an, der Mensch betritt die Küche.

---

## 10. Punkte, Sterne & Bewertung

| Aktion | Punkte |
|---|---|
| Gerät zerstört (Fußvolk) | 5 000 |
| Gerät zerstört (Spezialist) | 8 000 |
| Boss-Phase abgeschlossen | 25 000 |
| Objekt beschädigt | 10 pro LP-Schaden |
| Objekt zerstört | Pappe 500 · Holz 700 · Glas 600 · Metall 1 000 · Stein 1 500 |
| Gefangene Frucht befreit | 3 000 |
| Unbenutzte Frucht bei Sieg | 10 000 |
| Kombo ausgelöst | 2 000 – 5 000 (siehe Kombotabelle) |
| Goldener Löffel | 0 Punkte, aber Sammelobjekt |

**Multiplikator „Saftkette":** Werden innerhalb eines einzigen Schusses mehrere
Geräte zerstört, steigt ein Multiplikator (×1, ×1,5, ×2, ×3 ...). Anzeige als
wachsender Saftspritzer am Bildschirmrand.

**Sterne:** 1 Stern = Sieg. 2 und 3 Sterne über Punkteschwellen pro Level.

**Zusätzliche Level-Abzeichen** (optional, erscheinen im Level-Auswahlbildschirm):
- 🥄 Goldener Löffel gefunden
- 🫙 Alle Gefangenen befreit
- 🎯 Mit nur einer Frucht gewonnen („Ein-Frucht-Wunder")

---

## 11. Progression & Meta-Spiel

### 11.1 Weltkarte

Die Küche als **Übersichtskarte von der Seite**, Levels als Punkte entlang eines
Pfades über Arbeitsplatte, Kühlschrank, Ofen usw. Die Küchenuhr an der Wand
zeigt den Story-Fortschritt.

### 11.2 Reife-System (Frucht-Upgrades)

- Jede Frucht sammelt **Reifepunkte**, wenn sie eingesetzt wird und Schaden
  macht.
- 3 Reifestufen: *unreif → reif → vollreif*. Jede Stufe schaltet eine kleine,
  sichtbare Verbesserung frei (z. B. Traube: 6 statt 5 Beeren; Kiwi: rollt 2 s
  länger; Zitrone: größerer Kegel).
- **Wichtig:** Levels müssen auch mit unreifen Früchten 3-Sterne-fähig sein.
  Reife ist Komfort, kein Zwang. Im Wettbewerbsmodus (Tagesmarkt) sind alle
  Früchte auf Stufe *reif* normiert.

### 11.3 Rezeptbuch (Sammlung)

- Jede entdeckte **Kombo** wird als Rezept eingetragen (mit Illustration).
- Jede Welt versteckt **Rezeptkarten** (über Goldene Löffel und Bonuslevels).
- Vollständige Sammlung → Goldene Birne (siehe [4.3](#43-neue-früchte-erweiterungen)).

### 11.4 Kosmetik

- **Hüte & Accessoires** für Früchte (Kochmütze, Piratenhut, Sonnenbrille,
  Schnurrbart). Rein optisch, freigeschaltet über Sterne.
- **Schleuder-Skins:** Silberbesteck, Stäbchen, Kuchengabeln, Grillzangen.
- **Gummi-Farben:** mit Flugspur-Effekt (Regenbogen, Glitzer, Saftspritzer).
- **Keine Kaufwährung im Design vorgesehen.** Alles wird erspielt.

### 11.5 Obst-Almanach

Ein Nachschlagewerk mit allen Früchten, Gegnern und Materialien, das sich beim
ersten Begegnen füllt: Werte, Fähigkeit, ein kurzer witziger Steckbrief
(„Kokosnuss – Lieblingsbeschäftigung: Abprallen. Angst vor: nichts.").

---

## 12. Zusätzliche Spielmodi

| Modus | Beschreibung | Freischaltung |
|---|---|---|
| **Tagesmarkt** | Jeden Tag ein neues, generiertes Level mit fester Fruchtauswahl. Ein Versuch zählt für die Bestenliste, danach freies Üben. | nach Welt 1 |
| **Smoothie-Sprint** | Zeitangriff: 60 s, unendlich Äpfel, Festungen bauen sich nach jeder Zerstörung neu auf. Punkte sammeln. | nach Welt 2 |
| **Ein-Schuss-Rätsel** | 30 handgebaute Levels mit genau einer Frucht. Reine Uhrwerk-Kettenreaktionen. | nach Welt 3 |
| **Endlos-Regal** | Die Festung wird immer höher, die Kamera fährt nach oben. Jede zerstörte Etage gibt eine neue Frucht. Wie lange hältst du durch? | nach Welt 4 |
| **Küchenschlacht (lokal, 2 Spieler)** | Hot-Seat: Beide Spieler haben eine Festung und eine Schleuder an gegenüberliegenden Seiten. Obst gegen Geräte – Spieler 2 schießt mit **Geräten** (Toast, Tabs, Messer). Abwechselnd schießen. | nach Welt 5 |
| **Level-Editor** | Materialien, Gegner und Früchte aus dem Almanach platzieren, testen, als Code teilen (kurzer Text-String). | nach Welt 6 |
| **Spiegel-Modus** | Alle Levels gespiegelt, Schleuder rechts, Physik leicht erhöht. | nach Abschluss |

---

## 13. Game Feel, Grafik & Sound

### 13.1 Grafikstil

- **2D, handgezeichnet**, dicke Konturen, gesättigte Farben, leichte
  Papier-Textur. Seitenansicht, **keine** Perspektive.
- **Parallax-Hintergrund** mit 3 Ebenen (Küchenfliesen, Fenster mit Mond,
  Küchenschränke).
- Früchte haben **übertriebene Gesichter** mit wütenden Augenbrauen; die
  Augen reagieren auf Zielrichtung, Flug (zusammengekniffen) und Aufprall
  (Sterne).
- Beleuchtung erzählt die Uhrzeit: Welt 1 warmes Abendlicht, Welt 3 Glühen des
  Backofens, Welt 6 bläuliches Morgengrauen.

### 13.2 Juice (Rückmeldung)

| Moment | Effekt |
|---|---|
| Spannen | Gummi dehnt sich sichtbar, Knarzgeräusch steigt in der Tonhöhe, Frucht quetscht sich (Squash). |
| Abschuss | Schnalz-Sound, kleiner Kamera-Ruck, Frucht streckt sich (Stretch), Flugspur aus Saftpunkten. |
| Fähigkeit | Kurze Zeitlupe (0,1 s), Fruchtschrei („Hjaa!" in Kauderwelsch), Farbblitz. |
| Großer Einsturz | Kamera-Shake proportional zur Energie, Staubwolken. |
| Gerät zerstört | Punktezahl schwebt hoch, Einzelteile fliegen, Ton „Klonk-Pling". |
| Letztes Gerät | **Zeitlupe + Zoom** auf das letzte Gerät, das fällt (Finale). |
| Sieg | Früchte jubeln, übrige Früchte hüpfen aus der Schale und geben Bonuspunkte. |
| Niederlage | Die Gang lacht, der Mixer summt triumphierend. Keine Strafe, sofort Neustart. |

### 13.3 Sound & Musik

- **Musik:** Verspielter Big-Band-/Swing-Stil mit Küchenperkussion (Töpfe,
  Löffel, Schneebesen als Schlagzeug). Jede Welt hat eine Variation des
  Hauptthemas (Kühlschrank: Glockenspiel, Backofen: Latin, Spüle: Calypso).
- **Stimmen:** Früchte und Geräte sprechen Kauderwelsch. Jede Frucht hat einen
  wiedererkennbaren Ruf beim Abschuss.
- **Materialtöne:** Pappe dumpf, Glas klirrend, Metall scheppernd, Porzellan
  klingend, Wackelpudding „bloing".

---

## 14. Steuerung & Barrierefreiheit

### Steuerung

| Aktion | Touch | Maus | Tastatur (optional) |
|---|---|---|---|
| Zielen & Spannen | Ziehen von der Frucht | Klick + Ziehen | Pfeiltasten (Winkel/Kraft) |
| Abschuss | Loslassen | Loslassen | Leertaste |
| Fähigkeit | Tippen irgendwo | Klick irgendwo | Leertaste |
| Kamera verschieben | Wischen (nicht an der Schleuder) | Rechtsklick-Ziehen | A/D |
| Zoom | Zwei-Finger-Pinch | Mausrad | +/− |
| Abbrechen (Zielen) | Frucht zurück ins Gummi ziehen | ebenso | Esc |
| Neustart | Button oben links | ebenso | R |

### Barrierefreiheit

- **Farbenblind-Modus:** Statuseffekte zusätzlich mit Symbolen (Tropfen, Blitz,
  Flamme), nicht nur Farbe.
- **Zielhilfe-Option:** Volle Flugbahn anzeigen (Level zählt weiterhin, aber
  Hinweis-Symbol in der Wertung).
- **Einhand-Modus:** Fähigkeit per Button statt irgendwo tippen.
- **Reduzierte Effekte:** Kamerawackeln und Blitze abschaltbar.
- **Untertitel** für Story-Sequenzen (falls doch Text verwendet wird).
- **Überspringen:** Nach 5 Niederlagen kann ein Level übersprungen werden
  (ohne Sterne).

---

## 15. Hinweise für die Implementierung

Dieser Abschnitt legt keine Technik fest, gibt aber Leitplanken, damit die
Inhalte oben sauber umsetzbar sind.

### 15.1 Architektur-Empfehlungen

- **Datengetrieben:** Früchte, Gegner, Materialien, Objekte und Levels werden
  als **Daten** (z. B. JSON) beschrieben, nicht als Code. Neue Inhalte sollen
  ohne Code-Änderung möglich sein, solange sie bekannte Verhaltensbausteine
  nutzen.
- **Verhaltensbausteine statt Einzelklassen:** Fähigkeiten und Gerätverhalten
  werden aus wiederverwendbaren Bausteinen kombiniert (z. B. `split`,
  `burst_on_impact`, `boomerang`, `apply_status_cone`, `roll_forever`,
  `periodic_spawn`, `periodic_projectile`, `capture_fruit`).
- **Statussystem zentral:** Ein System verwaltet alle Statuseffekte und ihre
  Wechselwirkungen in einer Regeltabelle (z. B. `nass + elektrisch → Kurzschluss`).
- **Deterministische Physik** mit festem Zeitschritt (z. B. 60 Hz). Wichtig
  für Tagesmarkt (Bestenliste), Replays und automatisierte Tests.
- **Ruhe-Erkennung** für das Schussende (alle Körper unter
  Geschwindigkeitsschwelle oder Timeout).

### 15.2 Datenmodell-Skizze (Beispiel)

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

### 15.3 Testbarkeit

- Jedes Level sollte eine gespeicherte **Referenzlösung** (Liste von
  Schusswinkeln, Kräften und Tipp-Zeitpunkten) haben, die in automatisierten
  Tests zum Sieg führen muss. So fallen kaputte Levels nach Physik-Änderungen
  sofort auf.

---

## 16. Umfang: MVP und Ausbaustufen

### MVP („Vertikaler Schnitt")

Ziel: Ein spielbarer Kern, der den Spaß des Schießens beweist.

- Gabel-Schleuder mit Zielen, Spannen, halber Flugbahn, Tippen im Flug
- Früchte: **Apfel, Traube, Wassermelone, Banane, Zitrone, Kokosnuss, Kiwi**
- Materialien: Pappe, Holz, Glas, Metall
- Gegner: Eierbecher, Pürierstab, Toaster
- Statuseffekte: *nass*, *sauer*/*geblendet*, Kurzschluss
- Tutorial + **Welt 1** (15 Levels) mit Sternen und Punkten
- Grundlegender Juice (Squash & Stretch, Kamera, Partikel, Sounds)

### Ausbaustufe 2
- Welten 2–3, Boss Welt 1–3, Reife-System, Rezeptbuch, Kombos, Almanach

### Ausbaustufe 3
- Welten 4–6, alle Bosse, restliche Früchte, Tagesmarkt, Smoothie-Sprint

### Ausbaustufe 4
- Garten-Welt, Level-Editor, Küchenschlacht (2 Spieler), Spiegel-Modus,
  Kosmetik

---

## 17. Offene Fragen

1. **Plattform zuerst:** Browser (Maus) oder Mobile (Touch)? Beeinflusst UI-Größe
   und Kamerasteuerung.
2. **Level-Reihenfolge:** Soll es grundsätzlich feste Frucht-Reihenfolgen geben
   (klassisch) oder werden Obstkorb-Levels mit freier Wahl früher eingeführt?
3. **Aggressive Gegner:** Wie viele Geräte dürfen aktiv „zurückschießen"
   (Messerblock, Boss-Mechaniken), ohne dass der Schwerpunkt vom eigenen
   Schießen weggeht? Vorschlag: maximal 1 solcher Gegner pro normalem Level.
4. **Sprache:** Kauderwelsch-Stimmen und textlose Comics ermöglichen
   Internationalisierung fast ohne Übersetzung. Sollen UI-Texte zweisprachig
   (DE/EN) sein?
5. **Monetarisierung:** Dieses Dokument geht von einem Spiel ohne
   In-App-Käufe aus. Bestätigen.
