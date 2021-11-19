import { ImageData, LabelName, LabelPolygon } from "../../../store/labels/types";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { GeneralSelector } from "../../../store/selectors/GeneralSelector";
import { ImageRepository } from "../../imageRepository/ImageRepository";
import {
    COCOAnnotation, COCOBBox,
    COCOCategory,
    COCOImage,
    COCOInfo,
    COCOObject,
    COCOSegmentation
} from "../../../data/labels/COCO";
import { flatten } from "lodash";
import { IPoint } from "../../../interfaces/IPoint";
import imageService from "../../../services/image.service";

export type LabelDataMap = { [key: string]: number; }

export class COCOCloudExporter {
    public static export(): void {
        console.log("Saving annotation to cloud...")
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const projectName: string = GeneralSelector.getProjectName();
        const COCOObject: COCOObject = COCOCloudExporter.mapImagesDataToCOCOObject(imagesData, labelNames, projectName);
        const content: string = JSON.stringify(COCOObject);
        let folderID = localStorage.getItem('currentImagesFolderID')
        let data = {
            data: content,
            folderID: folderID
        }
        imageService.create(data);
    }

    private static mapImagesDataToCOCOObject(
        imagesData: ImageData[],
        labelNames: LabelName[],
        projectName: string
    ): COCOObject {
        return {
            "info": COCOCloudExporter.getInfoComponent(projectName),
            "images": COCOCloudExporter.getImagesComponent(imagesData),
            "annotations": COCOCloudExporter.getAnnotationsComponent(imagesData, labelNames),
            "categories": COCOCloudExporter.getCategoriesComponent(labelNames)
        }
    }

    public static getInfoComponent(description: string): COCOInfo {
        return {
            "description": description
        }
    }

    public static getCategoriesComponent(labelNames: LabelName[]): COCOCategory[] {
        return labelNames.map((labelName: LabelName, index: number) => {
            return {
                "id": index + 1,
                "name": labelName.name
            }
        })
    }

    public static getImagesComponent(imagesData: ImageData[]): COCOImage[] {
        return imagesData
            .filter((imagesData: ImageData) => imagesData.loadStatus)
            .filter((imagesData: ImageData) => imagesData.labelPolygons.length !== 0)
            .map((imageData: ImageData, index: number) => {
                const image: HTMLImageElement = ImageRepository.getById(imageData.id);
                return {
                    "id": index + 1,
                    "width": image.width,
                    "height": image.height,
                    "file_name": imageData.fileData.name
                }
            })
    }

    public static getAnnotationsComponent(imagesData: ImageData[], labelNames: LabelName[]): COCOAnnotation[] {
        const labelsMap: LabelDataMap = COCOCloudExporter.mapLabelsData(labelNames);
        let id = 0;
        const annotations: COCOAnnotation[][] = imagesData
            .filter((imagesData: ImageData) => imagesData.loadStatus)
            .filter((imagesData: ImageData) => imagesData.labelPolygons.length !== 0)
            .map((imageData: ImageData, index: number) => {
                return imageData.labelPolygons.map((labelPolygon: LabelPolygon) => {
                    return {
                        "id": id++,
                        "iscrowd": 0,
                        "image_id": index + 1,
                        "category_id": labelsMap[labelPolygon.labelId],
                        "segmentation": COCOCloudExporter.getCOCOSegmentation(labelPolygon.vertices),
                        "bbox": COCOCloudExporter.getCOCOBbox(labelPolygon.vertices),
                        "area": COCOCloudExporter.getCOCOArea(labelPolygon.vertices)
                    }
                })
            })
        return flatten(annotations);
    }

    public static mapLabelsData(labelNames: LabelName[]): LabelDataMap {
        return labelNames.reduce((data: LabelDataMap, label: LabelName, index: number) => {
            data[label.id] = index + 1;
            return data;
        }, {})
    }

    public static getCOCOSegmentation(vertices: IPoint[]): COCOSegmentation {
        const points: number[][] = vertices.map((point: IPoint) => [point.x, point.y]);
        return [flatten(points)];
    }

    public static getCOCOBbox(vertices: IPoint[]): COCOBBox {
        let xMin: number = vertices[0].x;
        let xMax: number = vertices[0].x;
        let yMin: number = vertices[0].y;
        let yMax: number = vertices[0].y;
        for (const vertex of vertices) {
            if (xMin > vertex.x) xMin = vertex.x;
            if (xMax < vertex.x) xMax = vertex.x;
            if (yMin > vertex.y) yMin = vertex.y;
            if (yMax < vertex.y) yMax = vertex.y;
        }
        return [xMin, yMin, xMax - xMin, yMax - yMin];
    }

    public static getCOCOArea(vertices: IPoint[]): number {
        let area = 0;
        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; i++) {
            area += (vertices[j].x + vertices[i].x) * (vertices[j].y - vertices[i].y);
            j = i;
        }
        return Math.abs(area / 2);
    }
}