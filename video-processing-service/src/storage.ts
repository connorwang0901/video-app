import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "cn-yt-raw-videos";
const processedVideoBucketName = "cn-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
      ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") // 360p
        .on("end", function () {
          console.log("Processing finished successfully");
          resolve();
        })
        .on("error", function (err: any) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
  }

export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
      .file(fileName)
      .download({
        destination: `${localRawVideoPath}/${fileName}`,
      });
  
    console.log(
      `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
  }
  
  export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
  
    // Upload video to the bucket
    await storage.bucket(processedVideoBucketName)
      .upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName,
      });
    console.log(
      `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );
  
    // Set the video to be publicly readable
    await bucket.file(fileName).makePublic();
  }

  function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file at ${filePath}`, err);
            reject(err);
          } else {
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      } else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
  }

  export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
  }
  
  export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
  }

  function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); 
      console.log(`Directory created at ${dirPath}`);
    }
  }