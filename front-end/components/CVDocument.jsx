import {Document, Page, Text, View, Image, StyleSheet,} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: "#408dd4",
        color: "white",
        padding: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    avatar: {
        width: 80,
        height: 80,
    },

    headerInfo: {
        flexDirection: "column",
    },

    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },

    content: {
        marginTop: 16,
    },

    summary: {
        fontSize: 11,
        marginBottom: 16,
        lineHeight: 1.5,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 8,
    },

    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },

    primaryTag: {
        backgroundColor: "#408dd4",
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },

    secondaryTag: {
        backgroundColor: "#68b55e",
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
});

export function CVDocument({ data }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={data.image} style={styles.avatar} />

                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{data.name}</Text>
                        <Text>[Email]</Text>
                        <Text>[Nummer]</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.summary}>
                        {data.summary}
                    </Text>

                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.tagContainer}>
                        {data.skills.map((skill) => (
                            <Text key={skill} style={styles.primaryTag}>
                                {skill}
                            </Text>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Strengths</Text>
                    <View style={styles.tagContainer}>
                        {data.strengths.map((strength) => (
                            <Text key={strength} style={styles.secondaryTag}>
                                {strength}
                            </Text>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.tagContainer}>
                        {data.interests.map((interest) => (
                            <Text key={interest} style={styles.primaryTag}>
                                {interest}
                            </Text>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
}