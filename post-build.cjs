const fs = require("fs");
const path = require("path");

// Source    and target directories
const distFolder = path.join(__dirname, "dist");
const targetPublicFolder = path.join(__dirname, "../server/public");
const targetViewsFolder = path.join(__dirname, "../server/src/views");

// Function to move index.html to views folder and all other files to public
const moveFiles = (source, target, moveHtml = false) => {
  fs.readdir(source, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const sourceFile = path.join(source, file);
      const targetFile = path.join(target, file);

      fs.stat(sourceFile, (err, stat) => {
        if (err) throw err;

        if (stat.isFile()) {
          // Move index.html to views folder
          if (moveHtml && file === "index.html") {
            fs.rename(
              sourceFile,
              path.join(targetViewsFolder, "spa-main.html"),
              (err) => {
                if (err) throw err;
                console.log(`Moved: ${file} to spa-main.html`);
              }
            );
          } else {
            // Move all other files to public folder
            fs.rename(sourceFile, targetFile, (err) => {
              if (err) throw err;
              console.log(`Moved: ${file} to ${target}`);
            });
          }
        } else if (stat.isDirectory()) {
          // Create target directory if it doesn't exist
          if (!fs.existsSync(targetFile)) {
            fs.mkdirSync(targetFile, { recursive: true });
          }
          moveFiles(sourceFile, targetFile, moveHtml);
        }
      });
    });
  });
};

// Ensure the target directories exist
if (fs.existsSync(targetPublicFolder)) {
  fs.rmSync(targetPublicFolder, { recursive: true });
}
fs.mkdirSync(targetPublicFolder, { recursive: true });

if (!fs.existsSync(targetViewsFolder)) {
  fs.mkdirSync(targetViewsFolder, { recursive: true });
}

// Move all files from dist to public and index.html to views
moveFiles(distFolder, targetPublicFolder, true);
