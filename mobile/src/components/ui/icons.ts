// Flat geometric Unicode glyphs. The ︎ suffix (text variation selector-15)
// forces text presentation instead of emoji on iOS/Android. React Native renders
// these as crisp, single-color shapes. Always pair with an explicit color style.

export const ICON = {
  flame:   '▲︎', // ▲ upward triangle — streak / growth
  diamond: '◆︎', // ◆ solid diamond   — Brain Bucks / reward
  star:    '★︎', // ★ solid star       — lesson node
  circle:  '●︎', // ● solid circle     — practice / focus node
  box:     '■︎', // ■ solid square     — chest node
  lines:   '≡︎', // ≡ three lines      — guidebook / book
  trophy:  '★︎', // ★ solid star       — trophy (top of path)
  check:   '✓︎', // ✓ check mark       — completed state
  up:      '▲︎', // ▲ upward triangle  — price up
  down:    '▼︎', // ▼ downward triangle — price down
} as const;

export type IconName = keyof typeof ICON;
