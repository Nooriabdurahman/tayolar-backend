const { put } = require('@vercel/blob');

/**
 * Uploads a file to Vercel Blob storage.
 * @param {string} filename - The original name of the file.
 * @param {Buffer} buffer - The file buffer.
 * @param {string} [folder='uploads'] - The folder to store the file in.
 * @returns {Promise<string>} - The URL of the uploaded file.
 */
const uploadToBlob = async (filename, buffer, folder = 'uploads') => {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('BLOB_READ_WRITE_TOKEN is not defined in environment variables');
        }

        const pathname = `${folder}/${Date.now()}-${filename}`;
        const blob = await put(pathname, buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return blob.url;
    } catch (error) {
        console.error('Vercel Blob Upload Error:', error);
        throw error;
    }
};

module.exports = {
    uploadToBlob,
};
