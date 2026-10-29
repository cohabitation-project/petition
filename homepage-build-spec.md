# Homepage Build Spec — measured from the mockup
Build to these numbers. Mockup is 1408×768; values scaled to a 1600px
container. The whole homepage fits one viewport on desktop.

## Page shell
body background #141B2E; container max-width 1600px, margin 0 auto,
padding 0 64px; total vertical 100vh, no page scroll at ≥1400×800.

## Row 1 — Header (96px)
Three items on ONE line, vertically centered:
- Left (~280px): mark + "LAST OF THE REAL ESTATE" 22px bold, beneath it
  "THE ARCHITECTURE OF COHABITATION" 11px, letter-spacing 1px, muted.
- Center (flex 1): "LAST OF THE REAL ESTATE" 40px, tagline beneath 13px
  letter-spacing 2px muted.
- Right (48px): nav button 44×44.
Nav never wraps — shrink font-size instead.

## Row 2 — Main grid, height calc(100vh - 96px - 72px)
display grid; grid-template-columns: 1fr 440px; gap 32px.
THE GURU IS THE RIGHT GRID COLUMN. Never absolutely positioned, never
overlapping, never negative margins. That is the current bug.

### Left column, block A — Room cards (340px)
Label "ROOMS" 13px letter-spacing 2px muted, margin-bottom 12px.
display flex; overflow-x auto; gap 24px; scroll-snap-type x mandatory.
Card: flex 0 0 460px; height 300px; background #1C2740; border 1px solid
<state color>; radius 8px; overflow hidden; flex column.
  1. State badge bar 32px, background state colour 20%, text 12px bold
     uppercase, 12px left padding (ALIVE / DORMANT).
  2. Image area 170px, object-fit cover. If no image exists, OMIT the
     block and give the height to the text. Never an empty gradient box.
  3. Text block, padding 16px, flex 1: room name 22px bold (6px below);
     mission 13px muted, 2 lines max, ellipsis; sponsor 12px (a named
     human, never an agent); last activity 12px muted.
Two cards fully visible at 1600px, third peeking to signal scroll.

### Left column, block B — The board (fills remaining height)
Label "THE BOARD" 13px letter-spacing 2px muted + "read-only mirror of
room files" 11px beside it. margin 24px 0 12px.
display grid; grid-template-columns repeat(5, 1fr); gap 12px.
Cell: height 92px; background #1C2740; border 1px solid #334264;
border-left 3px solid <state colour>; radius 6px; padding 12px.
Contents: room name 14px bold (wrap, don't truncate); state 12px
uppercase in the state colour at the bottom. 8 rooms = 5 + 3; empty
slots stay empty, no placeholders.

### Right column — The Guru (full grid-row height, sticky top 0)
background #1C2740; border 1px solid #334264; radius 8px; flex column;
height 100%.
 1. Title bar 56px: "The Guru" 20px bold + "AI steward" 13px muted.
    16px padding.
 2. State chips row 56px, padding 16px, flex wrap, gap 8px. Six chips:
    PROPOSED / ACTIVE / NEEDS HELP / IN PROGRESS / R&D / FINISHED.
    Each 11px uppercase, padding 6px 10px, radius 4px, background state
    colour 15%, text state colour.
 3. Conversation area: flex 1; overflow-y auto; padding 16px. Visitor
    and Guru bubbles distinct, 14px, 12px padding, radius 6px, gap 12px.
 4. Input row 56px, padding 16px, full-width input + send button right.

## Row 3 — Three doors (72px, full container width)
grid; repeat(3, 1fr); gap 24px. Each 56px tall, transparent, border 1px
solid #4A5D8C, radius 6px, 15px letter-spacing 1px centred, hover
background #4A5D8C at 12%.
WATCH LIVE → ashram.lastoftherealestate.com
BRING WORK → submission form
BRING YOUR AI (LOCAL API) → connector page

## Colours
page #141B2E · panel #1C2740 · border #334264 · border bright #4A5D8C
text #E6EBF5 · muted #94A3C4
PROPOSED #8A9BC4 · ACTIVE #4ADE9B · NEEDS HELP #F87171
IN PROGRESS #FBBF24 · R&D #C084FC · FINISHED #60A5FA
ALIVE #4ADE9B · DORMANT #64748B
Panels clearly lighter than the page. No glows, gradients, grid overlays
or matrix rain.

## Mobile (≤1000px)
Single column, page scrolls: header (centre title only) · the Guru full
width 60vh · room cards horizontal scroll at 85vw · board
repeat(2, 1fr) · doors stacked full width 52px each.

## Acceptance
- Nothing overlaps. No clipped text anywhere.
- Header, rooms, board, Guru and doors all visible in one viewport at
  1600×900.
- Board renders real states from rooms/*.json. No placeholder labels.
- Nav on one line.
- Panels visibly lighter than the page.
