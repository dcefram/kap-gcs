"use strict";
const { Storage } = require("@google-cloud/storage");

const CONTENT_TYPES = new Map([
  [".gif", "image/gif"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".apng", "image/apng"],
]);

const action = async (ctx) => {
  const filePath = await ctx.filePath();

  ctx.setProgress("Uploading...");

  const storage = new Storage({
    projectId: ctx.config.get("projectId"),
    keyFilename: ctx.config.get("keyFilename"),
  });

  const bucket = storage.bucket(ctx.config.get("bucket"));

  // upload file
  const [file] = await bucket.upload(filePath, { public: true });

  const publicUrl = file.publicUrl();

  ctx.copyToClipboard(publicUrl);
  ctx.notify("Google Cloud Storage Public URL copied to clipboard");
};

const gcp = {
  title: "Upload to GCP",
  formats: ["gif", "mp4", "webm", "apng"],
  config: {
    projectId: {
      title: "Project ID",
      type: "string",
      required: true,
    },
    keyFilename: {
      title: "Key Filename",
      type: "string",
      required: true,
    },
    bucket: {
      title: "Bucket Name",
      type: "string",
      required: true,
    },
  },
  action,
};

exports.shareServices = [gcp];
