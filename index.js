"use strict";
const { Storage } = require("@google-cloud/storage");

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

  let publicUrl = file.publicUrl();

  if (ctx.config.get("alias")) {
    const lastIndexOfSep = publicUrl.lastIndexOf("/");
    publicUrl = `${ctx.config.get("alias")}${publicUrl.slice(
      lastIndexOfSep + 1
    )}`;
  }

  ctx.copyToClipboard(publicUrl);
  ctx.notify("Google Cloud Storage Public URL copied to clipboard");
};

const gcs = {
  title: "Upload to GCS",
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
    alias: {
      title: "Alias",
      type: "string",
      required: false,
    },
  },
  action,
};

exports.shareServices = [gcs];
