const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '50mb' })); // to handle base64 image data

// Serve public folder
app.use(express.static(path.join(__dirname, 'public')));

// API to save snapshot
app.post('/save-snapshot', (req, res) => {
    const imgData = req.body.image.replace(/^data:image\/png;base64,/, '');
    const filename = `snapshot_${Date.now()}.png`;
    const filepath = path.join(__dirname, 'snapshots', filename);

    fs.writeFile(filepath, imgData, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save snapshot');
        }
        console.log(`Snapshot saved: ${filename}`);
        res.json({ success: true, filename });
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
const cron = require('node-cron');

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Cron job running every minute:', new Date().toLocaleString());
});