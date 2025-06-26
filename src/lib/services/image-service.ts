// services/image-service.ts
import { toJpeg, toPng, toSvg } from "html-to-image";

export type ImageFormat = "png" | "jpeg" | "svg";

export class ImageService {
  static async generateImage(
    elementId: string,
    format: ImageFormat = "png",
    options?: {
      quality?: number;
      width?: number;
      height?: number;
      backgroundColor?: string;
    }
  ): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const defaultOptions = {
      quality: 0.92,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      ...options,
    };

    try {
      switch (format) {
        case "png":
          return await toPng(element, defaultOptions);
        case "jpeg":
          return await toJpeg(element, defaultOptions);
        case "svg":
          return await toSvg(element, defaultOptions);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error(`Failed to generate ${format.toUpperCase()} image`);
    }
  }

  static async downloadImage(
    elementId: string,
    filename: string,
    format: ImageFormat = "png",
    options?: {
      quality?: number;
      width?: number;
      height?: number;
      backgroundColor?: string;
    }
  ): Promise<void> {
    try {
      const dataUrl = await this.generateImage(elementId, format, options);
      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  }

  static async getImageBlob(
    elementId: string,
    format: ImageFormat = "png",
    options?: {
      quality?: number;
      width?: number;
      height?: number;
      backgroundColor?: string;
    }
  ): Promise<Blob> {
    try {
      const dataUrl = await this.generateImage(elementId, format, options);
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error("Error creating image blob:", error);
      throw error;
    }
  }
}
