import Svg, { Circle, Path } from 'react-native-svg';
import { colors, moodColors } from '../../styling/theme';

export const MOOD_LABELS = [
  'Awful', 'Really low', 'Low', 'Down', 'Meh', 'Okay',
  'Fine', 'Good', 'Really good', 'Great', 'Amazing',
];

export default function MoodFace({ level, size = 110 }: { level: number; size?: number }) {
  const featureColor = level <= 2 ? colors.onDark : colors.text;
  // 0 = frown, 5 = flat line, 10 = big smile
  const curve = 50 + level * 3.6;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={46} fill={moodColors[level]} />
      <Circle cx={35} cy={40} r={5} fill={featureColor} />
      <Circle cx={65} cy={40} r={5} fill={featureColor} />
      <Path
        d={`M 30 68 Q 50 ${curve} 70 68`}
        stroke={featureColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}