import { AnnotationFormatType } from "../../../data/enums/AnnotationFormatType";
import { VGGExporter } from "./VGGExporter";
import { COCOExporter } from "./COCOExporter";
import { COCOCloudExporter } from "./COCOCloudExporter";

export class PolygonLabelsExporter {
    public static export(exportFormatType: AnnotationFormatType, destination): void {
        switch (exportFormatType) {
            case AnnotationFormatType.VGG:
                VGGExporter.export();
                break;
            case AnnotationFormatType.COCO:
                if (destination == "local") COCOExporter.export();
                else COCOCloudExporter.export();
                break;
            case AnnotationFormatType.COCOCloud:
                COCOCloudExporter.export();
                break;
            default:
                return;
        }
    }
}