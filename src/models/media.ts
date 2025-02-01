import mongoose, { Schema, Document } from 'mongoose';

export interface ExifData {
    make?: string;
    model?: string;
    exposureTime?: string;
    fNumber?: string;
    iso?: number;
    focalLength?: string;
    dateTaken?: string;
    location?: string;
    shutterSpeed?: string;
}

interface ImageWithExifProps {
    src: string;
    alt: string;
    exifData: ExifData;
}

interface IMedia extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    images: ImageWithExifProps[];
}

const MediaSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{
        src: { type: String, required: true },
        alt: { type: String, required: true },
        exifData: {
            make: String,
            model: String,
            exposureTime: String,
            fNumber: String,
            iso: Number,
            focalLength: String,
            dateTaken: String,
            location: String,
            shutterSpeed: String
        }
    }]
});

const Media = mongoose.model<IMedia>('Media', MediaSchema);

export default Media; 