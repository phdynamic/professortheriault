const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");
}

function extractAndCopyAssets(imsccPath, siteRoot) {
  const zip = new AdmZip(imsccPath);
  const tempDir = path.join(siteRoot, "_temp_imscc");

  console.log("Extracting .imscc archive...");
  zip.extractAllTo(tempDir, true);

  const imagesDir = path.join(siteRoot, "phil1301", "assets", "images");
  const handoutsDir = path.join(siteRoot, "phil1301", "assets", "handouts");
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(handoutsDir, { recursive: true });

  const filenameMap = {};

  const webResDir = path.join(tempDir, "web_resources");
  if (fs.existsSync(webResDir)) {
    copyAssetsRecursive(webResDir, imagesDir, handoutsDir, filenameMap, "");
  }

  console.log(`Copied ${Object.keys(filenameMap).length} asset files.`);
  return { tempDir, filenameMap };
}

function copyAssetsRecursive(sourceDir, imagesDir, handoutsDir, filenameMap, relativePath) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      copyAssetsRecursive(sourcePath, imagesDir, handoutsDir, filenameMap, relPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const normalized = normalizeFilename(entry.name);

    const isPdf = ext === ".pdf";
    const targetDir = isPdf ? handoutsDir : imagesDir;

    const skipExts = [".docx", ".pptx", ".zip", ".html"];
    if (skipExts.includes(ext)) continue;

    const targetPath = path.join(targetDir, normalized);

    let finalPath = targetPath;
    let counter = 1;
    while (fs.existsSync(finalPath)) {
      const base = path.basename(normalized, ext);
      finalPath = path.join(targetDir, `${base}-${counter}${ext}`);
      counter++;
    }

    fs.copyFileSync(sourcePath, finalPath);
    const finalName = path.basename(finalPath);

    filenameMap[relPath] = finalName;
    filenameMap[encodeURIComponent(entry.name).replace(/%20/g, "%20")] = finalName;
    filenameMap[decodeURIComponent(relPath)] = finalName;
  }
}

function cleanupTemp(tempDir) {
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("Cleaned up temp directory.");
}

module.exports = { extractAndCopyAssets, cleanupTemp, normalizeFilename };
