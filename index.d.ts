/// <reference types="node" />

declare class FlashCapture {
    constructor(apiKey: string);

    /**
     * Submit a screenshot job and wait for it to complete.
     */
    capture(
        url: string, 
        options?: FlashCapture.CaptureOptions, 
        timeout?: number
    ): Promise<FlashCapture.CaptureResult>;

    /**
     * Download the image buffer for a completed job.
     */
    download(jobId: string): Promise<Buffer>;

    /**
     * All-in-one: Capture and save the file to disk.
     */
    captureAndSave(
        url: string, 
        outputPath: string, 
        options?: FlashCapture.CaptureOptions
    ): Promise<FlashCapture.CaptureResult & { localPath: string }>;
}

declare namespace FlashCapture {
    export interface CaptureOptions {
        fullPage?: boolean;
        width?: number;
        height?: number;
        type?: 'png' | 'jpeg';
        quality?: number; // 0-1 (jpeg only)
        darkMode?: boolean;
        delay?: number; // seconds
        hideElements?: string[]; // CSS selectors
        userAgent?: string;
    }

    export interface CaptureResult {
        id: string;
        status: 'DONE' | 'ERROR' | 'IN_PROGRESS';
        downloadUrl: string;
    }
}

export = FlashCapture;