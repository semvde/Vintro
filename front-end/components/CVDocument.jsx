import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

import { Font } from "@react-pdf/renderer";

Font.register({
    family: "Poppins",
    src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
});

Font.register({
    family: "Bebas Neue",
    src: "https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneue/BebasNeue-Regular.ttf",
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontFamily: "Poppins",
    },

    h1: {
        fontFamily: "Bebas Neue",
        fontSize: 28,
    },

    h2: {
        fontFamily: "Bebas Neue",
        fontSize: 20,
    },

    h3: {
        fontFamily: "Bebas Neue",
        fontSize: 16,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#408DD4",
        padding: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        color: "white",
    },

    avatar: {
        width: 80,
        height: 80,
    },

    section: {
        paddingVertical: 12,
        fontSize: 12,
    },

    smallText: {
        fontSize: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    bottomSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#408DD4",
        padding: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        color: "white",
    },

    column: {
        width: "48%",
    },

    listItem: {
        marginBottom: 6,
    },
});

export function CVDocument({ data }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Image src={data.image} style={styles.avatar} />

                    <View>
                        <Text style={styles.h1}>{data.name}</Text>

                        <Text style={styles.smallText}>{data.email}</Text>
                        <Text style={styles.smallText}>{data.phoneNumber}</Text>
                    </View>
                </View>

                {/* SUMMARY + EXPERIENCE + EDUCATION */}
                <View style={styles.section}>
                    <Text>{data.summary}</Text>

                    <Text style={styles.h2}>Werkervaring</Text>

                    {data.workExperience?.map((job, i) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <View style={styles.row}>
                                <Text style={styles.h3}>{job.company}</Text>
                                <Text style={styles.smallText}>{job.period}</Text>
                            </View>
                            <Text>{job.description}</Text>
                        </View>
                    ))}

                    <Text style={styles.h2}>Educatie</Text>

                    {data.educationLevel?.map((edu, i) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <View style={styles.row}>
                                <Text style={styles.h3}>{edu.school}</Text>
                                <Text style={styles.smallText}>{edu.period}</Text>
                            </View>
                            <Text>{edu.degree}</Text>
                        </View>
                    ))}
                </View>

                {/* EXACT YOUR BOTTOM SECTION */}
                <View style={styles.bottomSection}>

                    <View style={styles.column}>
                        <Text style={styles.h3}>Vaardigheden</Text>

                        {data.skills.map((skill) => (
                            <Text key={skill} style={styles.listItem}>
                                • {skill}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.column}>
                        <Text style={styles.h3}>Sterke punten</Text>

                        {data.strengths.map((s) => (
                            <Text key={s} style={styles.listItem}>
                                • {s}
                            </Text>
                        ))}
                    </View>

                </View>

            </Page>
        </Document>
    );
}