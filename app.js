const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to fetch and modify content
app.post('/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the content from the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use cheerio to parse HTML and selectively replace text content, not URLs
    const $ = cheerio.load(html);
    
    // DELETE EVERYTHING FROM HERE DOWN (lines 27-50 in your original code)
    // and PASTE THE FIX BELOW:
    
    // Process text nodes in the body
    // Process text nodes in the body
    $('body *').contents().filter(function() {
      return this.nodeType === 3; // Text nodes only
    }).each(function() {
      // Replace text content but not in URLs or attributes
      const text = $(this).text();
      // Replace in specific order to preserve case correctly
const newText = text
  .replace(/YALE(\s+)University/g, 'FALE$1University')
  .replace(/YALE(\s+)College/g, 'FALE$1College')
  .replace(/YALE(\s+)Medical\s+School/g, 'FALE$1Medical School')
  .replace(/Yale(\s+)University/g, 'Fale$1University')
  .replace(/Yale(\s+)College/g, 'Fale$1College')
  .replace(/Yale(\s+)Medical\s+School/g, 'Fale$1Medical School')
  .replace(/yale(\s+)university/g, 'fale$1university')
  .replace(/yale(\s+)college/g, 'fale$1college')
  .replace(/yale(\s+)medical\s+school/g, 'fale$1medical school');
      if (text !== newText) {
        $(this).replaceWith(newText);
      }
    });

    // Process title separately
    const titleText = $('title').text();
const title = titleText
  .replace(/YALE(\s+)University/g, 'FALE$1University')
  .replace(/YALE(\s+)College/g, 'FALE$1College')
  .replace(/YALE(\s+)Medical\s+School/g, 'FALE$1Medical School')
  .replace(/Yale(\s+)University/g, 'Fale$1University')
  .replace(/Yale(\s+)College/g, 'Fale$1College')
  .replace(/Yale(\s+)Medical\s+School/g, 'Fale$1Medical School')
  .replace(/yale(\s+)university/g, 'fale$1university')
  .replace(/yale(\s+)college/g, 'fale$1college')
  .replace(/yale(\s+)medical\s+school/g, 'fale$1medical school');
    $('title').text(title);
    
    // KEEP EVERYTHING BELOW THIS (the return statement and error handling)
    return res.json({ 
      success: true, 
      content: $.html(),
      title: newTitle,  // Change 'title' to 'newTitle' here
      originalUrl: url
    });
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    return res.status(500).json({ 
      error: `Failed to fetch content: ${error.message}` 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Faleproxy server running at http://localhost:${PORT}`);
});
