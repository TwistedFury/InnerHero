import { Pressable, Text, StyleSheet, View} from 'react-native';
import { useRouter, type RelativePathString } from 'expo-router';

import findQuest from '../helper/questFinder'
import { colors, fonts } from '../styling/theme';
import { getIcon } from '../helper/icons'

export default function ShowQuest(
    questCode: string, 
    pathToQuests: RelativePathString, 
    duration: string, 
    progressLabel: string,
)
{
    const router = useRouter();
    const quest = findQuest(questCode);

    /* 
    Icon types:
        · Icon = Quest Icon (footprints, notebook-pen, etc)
        · A_up_right = An arrow up and to the right, symbolizes that it redirects
        · Bookmark = Bookmark to symbolize that it is currently in progress
    */
    const Icon = getIcon(quest?.icon);
    const A_up_right = getIcon('arrow-up-right');
    const Bookmark = getIcon('bookmark');

    return (
        <Pressable
            onPress={() => router.navigate({
                pathname: pathToQuests,
                params: {
                    questCode: questCode
                }
            })}
            accessibilityRole="button"
            accessibilityLabel={`${quest?.name}, ${duration}`}
            style={({ pressed }) => [
            styles.card,
            quest && styles.cardActive,
            pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.topRow}>
                <View style={styles.tag}><Text style={styles.tagText}>{quest?.tag}</Text></View>
                <Text style={styles.duration}>{duration}</Text>
            </View>

            <View style={styles.titleRow}>
                <View style={styles.iconTile}>
                  <Icon style={styles.icon}></Icon>
                </View>
                <Text style={styles.title}>{quest?.name}</Text>
                <A_up_right style={styles.icon}></A_up_right>
            </View>

            <Text style={styles.description}>{quest?.description}</Text>

            {progressLabel && (
            <View style={styles.progressRow}>
                <Bookmark style={styles.icon}></Bookmark>
                <Text style={styles.progressText}>{progressLabel}</Text>
            </View>
            )}

            <Text style={styles.source}>{quest?.theory}</Text>
        </Pressable>
    )
}

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  cardActive: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  cardPressed: {
    opacity: 0.92,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: colors.tint,
  },
  tagText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.primary,
  },
  duration: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconTile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.tint,
  },
  icon: {
    width: 22,
    height: 22,
    color: colors.primary,
    outlineWidth: 22,
  },
  title: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 17,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.primary,
  },
  source: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  }
});