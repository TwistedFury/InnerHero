import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../styling/theme';
import PaperSheet from '../paperSheet';

export default function EmptyQuestOptions() {
  return (
    <View style={styles.wrapper}>
      <PaperSheet seed="next-empty" style={styles.paper}>
        <Text style={styles.title}>Nothing pinned right now</Text>
        <Text style={styles.body}>
          {"You've been through everything that's open right now, and there's no rush to find the"}
          {" next thing. Anything you can come back to is on the Quest Board."}
        </Text>
      </PaperSheet>

      <View style={styles.pin} />
    </View>
  );
}

const styles = StyleSheet.create({
  // same breathing room as the other notes so the tilt isn't clipped
  wrapper: {
    marginTop: 16,
    marginBottom: 18,
    transform: [{ rotate: '-0.6deg' }],
  },
  paper: {
    padding: 20,
    paddingTop: 24,
  },
  pin: {
    position: 'absolute',
    top: 4,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.seal,
    borderWidth: 2,
    borderColor: '#5A1D1A',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 18,
  },
  body: {
    marginTop: 6,
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
});