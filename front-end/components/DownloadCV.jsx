import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";

export function DownloadCVButton({ data }) {
    return (
        <PDFDownloadLink document={<CVDocument data={data} />} fileName="cv.pdf">
            {({ loading }) =>
                loading ? "PDF genereren..." : "Download CV"
            }
        </PDFDownloadLink>
    );
}