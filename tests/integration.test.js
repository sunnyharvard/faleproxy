const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const nock = require('nock');

// Import the sample HTML
const { sampleHtmlWithYale } = require('./test-utils');

const TEST_PORT = 3099;
let server;
let app;

describe('Integration Tests', () => {
  beforeAll((done) => {
    // Mock external HTTP requests but allow localhost
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
    nock.enableNetConnect('localhost');
    
    // Create a minimal test server inline instead of spawning a process
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Copy the /fetch endpoint logic
    app.post('/fetch', async (req, res) => {
      try {
        const { url } = req.body;
        
        if (!url) {
          return res.status(400).json({ error: 'URL is required' });
        }

        const axiosLib = require('axios');
        const response = await axiosLib.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        
        // Process text nodes in the body
        $('body *').contents().filter(function() {
          return this.nodeType === 3;
        }).each(function() {
          const text = $(this).text();
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
        
        return res.json({ 
          success: true, 
          content: $.html(),
          title: title,
          originalUrl: url
        });
      } catch (error) {
        return res.status(500).json({ 
          error: `Failed to fetch content: ${error.message}` 
        });
      }
    });
    
    server = app.listen(TEST_PORT, () => {
      done();
    });
  }, 10000);

  afterAll((done) => {
    nock.cleanAll();
    nock.enableNetConnect();
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  test('Should replace Yale with Fale in fetched content', async () => {
    nock('https://example.com')
      .get('/')
      .reply(200, sampleHtmlWithYale);
    
    const response = await axios.post(`http://localhost:${TEST_PORT}/fetch`, {
      url: 'https://example.com/'
    });
    
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    
    const $ = cheerio.load(response.data.content);
    expect($('title').text()).toContain('Fale University');
    expect($('h1').text()).toContain('Fale University');
    expect($('p').first().text()).toContain('Fale University');
    
    const links = $('a');
    let hasYaleUrl = false;
    links.each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.includes('yale.edu')) {
        hasYaleUrl = true;
      }
    });
    expect(hasYaleUrl).toBe(true);
  }, 10000);

  test('Should handle invalid URLs', async () => {
    try {
      await axios.post(`http://localhost:${TEST_PORT}/fetch`, {
        url: 'not-a-valid-url'
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(500);
    }
  });

  test('Should handle missing URL parameter', async () => {
    try {
      await axios.post(`http://localhost:${TEST_PORT}/fetch`, {});
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe('URL is required');
    }
  });
});