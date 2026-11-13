import { Modal, View, Pressable, Text, ScrollView, StyleSheet } from 'react-native';
import { fonts, colors } from '../../styling/theme';

import HelpLinks from './helpLinks';

type Section = { title: string; body: string[] };

const SECTIONS: Section[] = [
  {
    title: 'Why I built Inner Hero',
    body: [
      "I grew up through the COVID-19 pandemic, from late middle school into early high school, and I saw how quickly mental health can slip when everything around you changes.",
      "In my second college English class, I wrote a seven-page essay on men's mental health and the stigma around it. The research stuck with me—especially how many young people struggle quietly because they feel like they can't talk about it.",
      "When I came to Neumont and took that same class, I turned the topic into a capstone idea: Inner Hero. My degree is in software and game development, and most of my experience is in game engines. Expo was new to me. I wanted my first real app to be about something that matters.",
      "Inner Hero takes the sense of adventure from games and leaves out the pressure. There are no streaks to protect and no points to chase—just small quests at your own pace. Taking care of yourself shouldn't feel like a chore.",
    ],
  },
  {
    title: 'How it works',
    body: [
      "Inner Hero is built around quests. Each one is a short set of steps—a written reflection, a mood check-in, a slider to rate how you're feeling. Some quests unlock after you finish others, and some you can repeat whenever you want.",
      "Your answers stay on your device. I don't collect them, and you can delete everything from the menu at any time.",
    ],
  },
  {
    title: 'Why there are no streaks or points',
    body: [
      "I left streaks and points out on purpose. Self-determination theory says people stay motivated when they feel in control of their choices, capable, and connected to others. Pressure works against that.",
      "Research on rewards backs this up. Deci, Koestner, and Ryan found that external rewards can wear down people's interest in an activity for its own sake. Streaks and points are external rewards, so I built Inner Hero without them.",
      "Come back whenever you want. You won't lose anything.",
    ],
  },
  {
    title: 'Where the quests come from',
    body: [
      "I didn't invent the exercises in Inner Hero. Every quest is built from a technique that comes out of published research on mental wellness, and I stay as close to the original source as I can.",
      "Each quest names the approach it's based on, so you can see where it came from and look it up yourself.",
      "These are short, self-guided versions of techniques that are usually taught over weeks or with a professional. Think of them as practice, not the full treatment.",
    ],
  },
  {
    title: 'Why it looks like a notebook',
    body: [
      "I didn't want Inner Hero to look like a clinic or a scoreboard. Parchment, ink, and handwriting are meant to feel like a personal journal—somewhere you can write honestly.",
      "It also fits my degree. When I decided to pull elements from game development, I realized I could make the app an adventurer's notebook. As you journey through Inner Hero in search of your inner hero, each quest becomes an entry in your journal.",
      "These choices came from research, but I didn't invent them from nothing. Studies have found that people tend to judge attractive designs as easier to use, and that appealing visual design is linked to whether young people keep using mental health apps. Writing about your thoughts and feelings has small but real benefits in research, and handwriting-style type tends to feel more personal than machine type. I haven't found a study that tests this exact notebook look, so treat it as a reasoned choice, not a proven one.",
    ],
  },
];

const SOURCES: string[] = [
  'Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227-268.',
  'Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627-668.',
  'Lejuez, C. W., Hopko, D. R., Acierno, R., Daughters, S. B., & Pagoto, S. L. (2011). Ten year revision of the brief behavioral activation treatment for depression: Revised treatment manual. Behavior Modification, 35(2), 111-161.',
  'Frattaroli, J. (2006). Experimental disclosure and its moderators: A meta-analysis. Psychological Bulletin, 132(6), 823-865.',
  'Tractinsky, N., Katz, A. S., & Ikar, D. (2000). What is beautiful is usable. Interacting with Computers, 13(2), 127-145.',
  'Garrido, S., Doran, B., Oliver, E., & Boydell, K. (2024). Desirable design: What aesthetics are important to young people when designing a mental health app? Health Informatics Journal, 30(4).',
  'Schroll, R., Schnurr, B., & Grewal, D. (2018). Humanizing products with handwritten typefaces. Journal of Consumer Research, 45(3), 648-672.',
  'Cheng, V. W. S., Davenport, T., Johnson, D., Vella, K., & Hickie, I. B. (2019). Gamification in apps and technologies for improving mental health and well-being: Systematic review. JMIR Mental Health, 6(6), e13717.',
  'Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). The motivational pull of video games: A self-determination theory approach. Motivation and Emotion, 30(4), 347-363.',
];

export default function AboutModal({
  isAboutVisible,
  setIsAboutVisible,
}: {
  isAboutVisible: boolean;
  setIsAboutVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      visible={isAboutVisible}
      animationType="slide"
      onRequestClose={() => setIsAboutVisible(false)}
    >
      <View style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>About Inner Hero</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close about page"
            onPress={() => setIsAboutVisible(false)}
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
  pressed: {
    opacity: 0.78,
  },
});