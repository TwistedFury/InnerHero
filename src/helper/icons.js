import { NotebookPen, Footprints, CalendarCheck, CircleHelp, ArrowUpRight, Bookmark,
  ChessKnight, UserShield, Shield, Edit, Menu
 } from 'lucide-react-native';

const registry = {
  'notebook-pen': NotebookPen,
  'footprints': Footprints,
  'calendar-check': CalendarCheck,
  'arrow-up-right': ArrowUpRight,
  'bookmark': Bookmark,
  'chess-knight': ChessKnight,
  'user-shield': UserShield,
  'shield': Shield,
  'edit': Edit,
  'menu': Menu
};

export function getIcon(name) {
  return registry[name] ?? CircleHelp; // fallback so a typo doesn't crash
}