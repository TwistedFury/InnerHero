export const colors = {
  bg: '#F3E9D2',          // parchment page (unchanged)
  surface: '#FBF5E6',     // card / entry paper (was pure white)
  border: '#CDB891',      // aged paper edge
  text: '#2B2118',        // ink
  muted: '#4d3a2ad2',       // faded ink
  primary: '#7A4A2B',     // leather (buttons, highlights, active borders)
  primaryDark: '#3E2616', // dark leather (dark cards)
  tint: '#EADCBB',        // icon tile + tag background
  onDark: '#F6EBD3',      // text on dark leather
  onDarkMuted: '#C9B493', // quieter text on dark leather
  sand: '#E9D5A8',        // milestone card (a bit golder so it stands out from the page)

  // New
  seal: '#8C2F2B',        // wax red, for special moments
  moss: '#4F6B4A',        // completed / growth
  gold: '#B8862B',        // stitching, icons, progress fill
  track: '#D9C7A0',       // empty part of a progress bar
  dangerSoft: '#F0D9D0',  // soft red background for delete buttons
  onDarkFaint: '#A8946F', // inactive tab labels and icons on dark leather
};

// Mood 0 to 10: dusk blue → lantern gold. Use moodColors[number].
export const moodColors = [
  '#3F4F6B', '#4A5E7A', '#5B7089', '#6E8296', '#8A9AA0', '#A8A99A',
  '#C2B27E', '#D1B25E', '#D9AC45', '#DEA82F', '#E0A526',
];

export const fonts = {
  serif: 'Lora_500Medium',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansBold: 'Inter_600SemiBold',

  // New: only work once you add and load them (steps below)
  heading: 'IMFellEnglish_400Regular',
  handwriting: 'Caveat_400Regular',
  handwritingBold: 'Caveat_700Bold',
};