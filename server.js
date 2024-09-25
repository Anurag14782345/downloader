const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST route to handle downloading the playlist
app.post('/download', (req, res) => {
    const playlistUrl = req.body.playlistUrl;

    if (!playlistUrl) {
        return res.status(400).send('No playlist URL provided');
    }

    // Set a default downloads path
    const downloadsPath = path.join(__dirname, 'downloads');
    
    // Create the downloads directory if it doesn't exist
    if (!fs.existsSync(downloadsPath)) {
        fs.mkdirSync(downloadsPath);
    }

    // Use yt-dlp to download the playlist
    // Format the output to create a directory based on the playlist name
    const command = `yt-dlp -o "${downloadsPath}/%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s" ${playlistUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${command}`);
            console.error(`Error: ${error.message}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send(`Error downloading playlist: ${error.message}`);
        }

        console.log(`Output: ${stdout}`);
        return res.send(`Playlist downloaded successfully! Check the "downloads" folder.`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
