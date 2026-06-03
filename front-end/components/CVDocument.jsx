import {Document, Page, Text, View } from "@react-pdf/renderer";

export function CVDocument({ data }) {
    return (
        <Document>
            <Page>
                <View>
                    <Text >{data.name}</Text>
                </View>

                <View>
                    <Text >{data.summary}</Text>
                </View>
            </Page>
        </Document>
    );
}