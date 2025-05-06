const path = require("path");
const fs = require("fs");
const semver = require("semver");
const bundleService = require("../models/bundle.model");
const appService = require("../models/app.model");
const https = require('https');

const BASE_STORAGE_DIR = path.join(__dirname, "../storage/bundles");

async function downloadFileFromUrl(fileUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https
      .get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download file: ${response.statusCode}`)
          );
        }

        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

const uploadBundle = async ({
  orgId,
  deploymentKey,
  version,
  file,
  platform,
  identifier,
  res
}) => {
  if (!file) {
    return { error: "No bundle file uploaded." };
  }
  try {
    const existing = await bundleService.findOne({
      orgId,
      deploymentKey,
      version
    });
    const app = await appService.findOne({ identifier });
    if (!app || existing) {
      return "Error";
    }
    const targetDir = path.join(
      BASE_STORAGE_DIR,
      orgId,
      deploymentKey,
      version
    );
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const bundlePath = path.join(targetDir, "index.android.bundle");
    // fs.renameSync(file.path, bundlePath);
    await downloadFileFromUrl(file.path, bundlePath);
    await bundleService.create({
      orgId,
      deployment: deploymentKey,
      version,
      filePath: bundlePath,
      uploadedAt: new Date(),
      platform,
      app,
      channel: "staging"
    });
    return {
      message: "✅ Bundle uploaded successfully.",
      bundle: {
        orgId,
        deploymentKey,
        version,
        path: bundlePath
      }
    };
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to upload bundle." });
  }
};

const checkForUpdates = async (orgId, deploymentKey, currentVersion) => {
  const dir = path.join(BASE_STORAGE_DIR, orgId, deploymentKey);

  if (!fs.existsSync(dir)) {
    throw new Error(
      `Deployment directory not found for ${orgId} / ${deploymentKey}`
    );
  }
  const versions = fs
    .readdirSync(dir)
    .map((file) => path.basename(file, ".zip"))
    .filter((v) => semver.valid(v))
    .sort(semver.rcompare);

  const latestVersion = versions[0];
  const updateAvailable = semver.gt(latestVersion, currentVersion);
  return {
    updateAvailable,
    latestVersion
  };
};

const getLatestBundle = async (orgId, deploymentKey, version) => {
  const filePath = path.join(
    BASE_STORAGE_DIR,
    orgId,
    deploymentKey,
    version,
    "index.android.bundle"
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Bundle version ${version} not found for ${orgId} / ${deploymentKey}`
    );
  }
  return filePath;
};

module.exports = {
  getLatestBundle,
  uploadBundle,
  checkForUpdates
};
