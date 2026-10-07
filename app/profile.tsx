import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
	return (
		<View style={styles.container}>
			<Text style={styles.eyebrow}>WELCOME</Text>
			<Text style={styles.title}>Your profile starts here.</Text>
			<Text style={styles.subtitle}>
				Create a space that reflects who you are and what makes you unique.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
		backgroundColor: '#F7F4FF',
	},
	eyebrow: {
		marginBottom: 12,
		color: '#7657D9',
		fontSize: 14,
		fontWeight: '700',
		letterSpacing: 2,
	},
	title: {
		color: '#211A35',
		fontSize: 32,
		fontWeight: '700',
		textAlign: 'center',
	},
	subtitle: {
		maxWidth: 320,
		marginTop: 16,
		color: '#6D6780',
		fontSize: 16,
		lineHeight: 24,
		textAlign: 'center',
	},
});
