#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExifImage = require('exif').ExifImage;

const directory = process.argv[2];

if (!directory) {
  console.error('Please provide a directory name.');
  process.exit(1);
}

function processDirectory(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${filePath}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(filePath);
        } else if (path.extname(file).toLowerCase() === '.jpg') {
          extractExifData(filePath);
        }
      });
    });
  });
}

function extractExifData(filePath) {
  try {
    new ExifImage({ image: filePath }, function (error, exifData) {
      if (error) {
        console.error(`Error reading EXIF data from ${filePath}:`, error.message);
      } else {
        const jsonFilePath = filePath.replace(/\.jpg$/i, '.json');
        fs.writeFile(jsonFilePath, JSON.stringify(exifData, null, 2), (err) => {
          if (err) {
            console.error(`Error writing JSON file ${jsonFilePath}:`, err);
          } else {
            console.log(`EXIF data saved to ${jsonFilePath}`);
          }
        });
      }
    });
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

processDirectory(directory); 