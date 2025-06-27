// 📁 src/lib/services/image-generator.ts
import { toJpeg, toPng, toSvg } from "html-to-image";

export type ImageFormat = "png" | "jpeg" | "svg";

export class ImageGeneratorService {
  static async generateImage(
    element: HTMLElement,
    format: ImageFormat = "png",
    options?: {
      quality?: number;
      width?: number;
      height?: number;
      backgroundColor?: string;
    }
  ): Promise<string> {
    const defaultOptions = {
      quality: 1,
      backgroundColor: "#ffffff",
      pixelRatio: 2, // For high DPI displays
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
    element: HTMLElement,
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
      const dataUrl = await this.generateImage(element, format, options);
      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  }

  static async generateImageBlob(
    element: HTMLElement,
    format: ImageFormat = "png",
    options?: {
      quality?: number;
      width?: number;
      height?: number;
      backgroundColor?: string;
    }
  ): Promise<Blob> {
    try {
      const dataUrl = await this.generateImage(element, format, options);
      const response = await fetch(dataUrl);
      return await response.blob();
    } catch (error) {
      console.error("Error generating image blob:", error);
      throw error;
    }
  }
}
