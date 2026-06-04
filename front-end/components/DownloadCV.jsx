import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";

export function DownloadCVButton({ data }) {
    return (
        <div className={"bg-primary inline-block text-outline px-2 py-4 rounded-lg"}>
            <PDFDownloadLink document={<CVDocument data={data} />} fileName="cv.pdf">
                {({ loading }) =>
                    loading ? "PDF genereren..." : "Download CV"
                }
            </PDFDownloadLink>
        </div>
    );
}