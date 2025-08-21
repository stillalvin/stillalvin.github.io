const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle clean URLs
app.get('/*', (req, res, next) => {
    if (!req.path.includes('.')) {
        const filePath = path.join(__dirname, req.path + '.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                next(); // If file doesn't exist, move to next middleware (404 handler)
            }
        });
    } else {
        next();
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages/404.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 