const { uploadToBlob } = require('../utils/blobUpload');

/**
 * Handle individual file upload
 */
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, buffer } = req.file;
        const folder = req.body.folder || 'uploads';

        const url = await uploadToBlob(originalname, buffer, folder);

        res.status(200).json({
            message: 'File uploaded successfully',
            url,
            filename: originalname
        });
    } catch (error) {
        console.error('Upload controller error:', error);
        res.status(500).json({
            message: 'Error uploading file',
            error: error.message
        });
    }
};

/**
 * Handle multiple files upload
 */
const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const folder = req.body.folder || 'uploads';
        const uploadPromises = req.files.map(file =>
            uploadToBlob(file.originalname, file.buffer, folder)
                .then(url => ({ filename: file.originalname, url }))
        );

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            message: 'Files uploaded successfully',
            files: results
        });
    } catch (error) {
        console.error('Multiple upload controller error:', error);
        res.status(500).json({
            message: 'Error uploading files',
            error: error.message
        });
    }
};

module.exports = {
    uploadFile,
    uploadMultipleFiles,
};
