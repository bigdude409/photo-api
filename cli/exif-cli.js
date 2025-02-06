#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ExifImage = require('exif').ExifImage;
const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

const directory = process.argv[2];
const userEmail = process.argv[3];
const userPassword  = process.argv[4];

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const LOGIN_API_URL = process.env.LOGIN_API_URL;
const MEDIA_API_URL = process.env.MEDIA_API_URL;

if (!directory) {
  console.error('Please provide a directory name.');
  process.exit(1);
}

if (!userEmail) {
    console.error('Please provide a user email.');
    process.exit(1);
}

if (!userPassword) {
    console.error('Please provide a user password.');
    process.exit(1);
}

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Login to set the cookie
    await loginAndSetCookie();
    
    // Process the directory and extract Exif data
    await processDirectory(directory);
    
    // Post the Exif data
   
    
  } catch (error) {
    console.error('Error during execution:', error.message);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main();

function processDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error(`Error reading directory ${dir}:`, err);
        return reject(err);
      }

      const promises = files.map(file => {
        const filePath = path.join(dir, file);
        return new Promise((resolve, reject) => {
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error(`Error stating file ${filePath}:`, err);
              return reject(err);
            }

            if (stats.isDirectory()) {
              processDirectory(filePath).then(resolve).catch(reject);
            } else if (path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.jpeg') {
              extractExifData(filePath).then(resolve).catch(reject);
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(promises).then(resolve).catch(reject);
    });
  });
}

async function insertExifDataToDB(exifData, filePath) {
  try {
    const database = client.db();
    const collection = database.collection('media');
    const document = { src: path.basename(filePath), exifData };
    await collection.insertOne(document);
    console.log(`EXIF data inserted into MongoDB for ${filePath}`);
  } catch (error) {
    console.error(`Error inserting EXIF data into MongoDB for ${filePath}:`, error.message);
  }
}

function extractExifData(filePath) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: filePath }, async function (error, exifData) {
        if (error) {
          console.error(`Error reading EXIF data from ${filePath}:`, error.message);
          return reject(error);
        } else {
          const jsonFilePath = filePath.replace(/\.jpg$/i, '.json');
          const filteredExifData = {
            make: exifData.image.Make,
            model: exifData.image.Model,
            exposureTime: exifData.exif.ExposureTime,
            fNumber: exifData.exif.FNumber,
            iso: exifData.exif.ISO,
            focalLength: (exifData.exif.FocalLength),
            dateTaken: exifData.exif.DateTimeOriginal,
            location: exifData.gps ? `${exifData.gps.GPSLatitude}, ${exifData.gps.GPSLongitude}` : undefined,
            shutterSpeed: exifData.exif.ShutterSpeedValue
          };
          filteredExifData.fileName = path.basename(filePath);
          fs.writeFile(jsonFilePath, JSON.stringify(exifData, null, 2), async (err) => {
            if (err) {
              console.error(`Error writing JSON file ${jsonFilePath}:`, err);
              return reject(err);
            } else {
              console.log(`EXIF data saved to ${jsonFilePath}`);
              await postExifData(filteredExifData);
              resolve();
            }
          });
        }
      });
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
      reject(error);
    }
  });
}

// Function to login and set the cookie
async function loginAndSetCookie() {
    try {
        await axios.post(LOGIN_API_URL, {
            email: userEmail,
            password: userPassword
        }, {
            withCredentials: true // This will allow cookies to be sent and received
        });
        console.log('Logged in and cookie set');
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

// Function to transform Exif data
function transformExifData(exifData) {
    return {
        images: [
            {
                src: exifData.fileName,
                alt: exifData.fileName,
                exifData: exifData
            }
        ]
    };
}

// Function to post Exif data
async function postExifData(exifData) {
    try {
        const transformedData = transformExifData(exifData);
        console.log(JSON.stringify(transformedData));
        const response = await axios.post(MEDIA_API_URL + '/679c03e92016fbb94ebe84e4', transformedData, {
            withCredentials: true // Ensure cookies are sent with the request
        });
        console.log('Exif data posted successfully:', response.data);
    } catch (error) {
        console.error('Error posting Exif data:', error);
        throw error;
    }
} 
