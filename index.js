const axios = require('axios');
const fs = require('fs');
const path = require('path');

class FlashCapture {
    /**
     * @param {string} apiKey - Your RapidAPI Key
     */
    constructor(apiKey) {
        if (!apiKey) throw new Error("FlashCapture: API Key is required.");
        
        this.apiKey = apiKey;
        this.baseURL = 'https://flashcapture.p.rapidapi.com';
        this.host = 'flashcapture.p.rapidapi.com';
        
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': this.host,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Submit a screenshot job and wait for completion.
     * @param {string} url - The URL to capture
     * @param {object} options - Capture options (width, fullPage, etc.)
     * @param {number} [timeout=60] - Max wait time in seconds
     * @returns {Promise<object>} The job result including ID and status
     */
    async capture(url, options = {}, timeout = 60) {
        try {
            // 1. Submit Job
            const { data: job } = await this.client.post('/capture', { url, options });
            const jobId = job.id;

            // 2. Poll for completion
            const startTime = Date.now();
            
            while (Date.now() - startTime < timeout * 1000) {
                const { data: statusData } = await this.client.get(`/status/${jobId}`);
                
                if (statusData.status === 'DONE') {
                    return {
                        id: jobId,
                        status: 'DONE',
                        // On reconstruit l'URL de téléchargement car elle n'est plus dans le /status
                        downloadUrl: `${this.baseURL}/download/${jobId}` 
                    };
                }
                
                if (statusData.status === 'ERROR') {
                    throw new Error(`FlashCapture Job Failed: ${statusData.error}`);
                }

                // Wait 2 seconds before next check
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            throw new Error('FlashCapture Timeout: Job took too long to complete.');

        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Download the image to a buffer
     * @param {string} jobId 
     * @returns {Promise<Buffer>}
     */
    async download(jobId) {
        try {
            const response = await this.client.get(`/download/${jobId}`, {
                responseType: 'arraybuffer'
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Helper: Capture and save directly to disk
     * @param {string} url 
     * @param {string} outputPath 
     * @param {object} options 
     */
    async captureAndSave(url, outputPath, options = {}) {
        const result = await this.capture(url, options);
        const buffer = await this.download(result.id);
        fs.writeFileSync(outputPath, buffer);
        return { ...result, localPath: outputPath };
    }

    _handleError(error) {
        if (error.response) {
            return new Error(`API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        return error;
    }
}

module.exports = FlashCapture;