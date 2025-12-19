const express = require('express');
const path = require('path');
const fs = require('fs');
const fileupload = require('express-fileupload');

let initial_path = __dirname; // serve project root (where HTML/CSS/JS/img live)

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

// ensure uploads folder exists
const uploadsDir = path.join(initial_path, 'uploads');
if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    let file = req.files.image;
    let date = Date.now();
    // make filename safe
    let imagename = date + "-" + file.name.replace(/\s+/g, '_');
    // image upload path
    let uploadPath = path.join(uploadsDir, imagename);

    // create upload
    file.mv(uploadPath, (err) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: "Upload failed" });
        } else{
            // return a usable URL path for client
            return res.json({ url: `/uploads/${imagename}` });
        }
    })
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.status(404).json({ error: "404 Not Found" });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
})