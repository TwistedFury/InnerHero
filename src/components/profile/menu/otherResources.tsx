import { Linking, Modal, View, Pressable, Text, ScrollView, StyleSheet } from 'react-native';
import { fonts, colors } from '../../../styling/theme';

import HelpLinks from '../helpLinks';

type LinkItem = { label: string; url: string };
type Section = { title: string; body: string[]; links: LinkItem[] };

const SECTIONS: Section[] = [
  {
    title: 'Guided meditation',
    body: [
      'A guided meditation walks you through the practice with a voice, so you do not need to know what you are doing. Short ones are a good place to start.',
      'UCLA Mindful offers free recordings from 3 to 19 minutes, with transcripts. They include a breathing meditation, a body scan for sleep, and a practice for working with difficult feelings.',
      'Studies of mindfulness programs find small but real improvements in anxiety and low mood. The effects are modest, and it does not help everyone.',
      'Some people find that meditation stirs up difficult feelings. If a practice leaves you feeling worse, stop and take a break.',
    ],
    links: [
      { label: 'UCLA Mindful: free guided meditations', url: 'https://www.uclahealth.org/marc/mindful-meditations' },
      { label: 'UCLA Mindful: getting started videos', url: 'https://www.uclahealth.org/programs/marc/free-guided-meditations/getting-started' },
      { label: 'MeditOceans: ocean meditations (Monterey Bay Aquarium)', url: 'https://www.youtube.com/playlist?list=PLq_DVMr7CmlJ3DJothjCJNylwgyrB72V6' },
      // TODO: add the official Plum Village and SF Zen Center channel links once you have copied them
    ],
  },
  {
    title: 'Calming music',
    body: [
      'Across many studies, listening to relaxing music is linked to lower stress and anxiety. Slow, gentle music is a good place to start.',
      'Research has not found one genre that beats the others, so pick whatever feels calming to you. Music is one helpful option among several, not a cure.',
    ],
    links: [],
  },
  {
    title: 'Sounds of nature',
    body: [
      'Recordings of flowing water and birdsong may help your body settle. In studies, listeners had lower heart rates and less stress.',
      'The evidence is mixed on how stressed people say they feel, so treat this as a gentle tool and not a guarantee.',
    ],
    links: [],
  },
];

const SOURCES: string[] = [
  'Goyal, M., et al. (2014). Meditation programs for psychological stress and well-being: A systematic review and meta-analysis. JAMA Internal Medicine, 174(3), 357-368.',
  'National Center for Complementary and Integrative Health. Meditation and mindfulness: Effectiveness and safety. nccih.nih.gov/health/meditation-and-mindfulness-effectiveness-and-safety',
  'Van Dam, N. T., et al. (2025). Incidence and predictors of meditation-related unusual experiences and adverse effects in a representative sample of meditators in the United States. Clinical Psychological Science, 13(3), 632-648.',
  'de Witte, M., et al. (2020). Effects of music interventions on stress-related outcomes: A systematic review and two meta-analyses. Health Psychology Review, 14(2), 294-324.',
  'Is music listening an effective intervention for reducing anxiety? A systematic review and meta-analysis of controlled studies. (2022). doi:10.1177/10298649211046979',
  'Buxton, R. T., et al. (2021). A synthesis of health benefits of natural sounds and their distribution in national parks. PNAS, 118(14), e2013097118.',
  'The effect of exposure to natural sounds on stress reduction: A systematic review and meta-analysis. (2024). Stress, 27(1), 2402519.',
];

export default function OtherResourcesModal({
  isOTRVisible,
  setIsOTRVisible,
}: {
  isOTRVisible: boolean;
  setIsOTRVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      visible={isOTRVisible}
      animationType="slide"
      onRequestClose={() => setIsOTRVisible(false)}
    >
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Other Resources</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close other resources"
            onPress={() => setIsOTRVisible(false)}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>{"x"}</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.card}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.body.map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}

              {section.links.map((item) => (
                <Pressable
                  key={item.url}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(item.url).catch(() => {})}
                  style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
                >
                  <Text style={styles.linkText}>{item.label} →</Text>
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Please note</Text>
            <HelpLinks showDivider={false} large />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sources</Text>
            {SOURCES.map((source, index) => (
              <Text key={index} style={styles.source}>
                {source}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: 56,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  closeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  closeText: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 28,
    lineHeight: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    marginBottom: 8,
  },
  paragraph: {
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  source: {
    color: colors.muted,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  linkRow: {
    paddingVertical: 10,
  },
  linkText: {
    color: colors.seal,
    fontFamily: fonts.sans,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.78,
  },
});