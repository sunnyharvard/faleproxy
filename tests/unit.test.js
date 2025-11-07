const cheerio = require('cheerio');
const { sampleHtmlWithYale } = require('./test-utils');

describe('Yale to Fale replacement logic', () => {
  
  test('should replace Yale with Fale in text content', () => {
    const $ = cheerio.load(sampleHtmlWithYale);
    
    // Process text nodes in the body
    $('body *').contents().filter(function() {
      return this.nodeType === 3; // Text nodes only
    }).each(function() {
      // Replace text content but not in URLs or attributes
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
    
    const modifiedHtml = $.html();
    
    // Check text replacements - only when followed by University/College/Medical School
    expect(modifiedHtml).toContain('Fale University Test Page');
    expect(modifiedHtml).toContain('Welcome to Fale University');
    expect(modifiedHtml).toContain('Fale University is a private Ivy League');
    // "Yale was founded" should NOT be replaced (standalone Yale)
    expect(modifiedHtml).toContain('Yale was founded in 1701');
    
    // Check that URLs remain unchanged
    expect(modifiedHtml).toContain('https://www.yale.edu/about');
    expect(modifiedHtml).toContain('https://www.yale.edu/admissions');
    expect(modifiedHtml).toContain('https://www.yale.edu/images/logo.png');
    expect(modifiedHtml).toContain('mailto:info@yale.edu');
    
    // Check href attributes remain unchanged
    expect(modifiedHtml).toMatch(/href="https:\/\/www\.yale\.edu\/about"/);
    expect(modifiedHtml).toMatch(/href="https:\/\/www\.yale\.edu\/admissions"/);
    
    // Check that link text is replaced only when appropriate
    expect(modifiedHtml).toContain('>About Yale<');
    expect(modifiedHtml).toContain('>Yale Admissions<');
    
    // Check that alt attributes are not changed
    expect(modifiedHtml).toContain('alt="Yale Logo"');
  });

  test('should handle text that has no Yale references', () => {
    const htmlWithoutYale = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Hello World</h1>
        <p>This is a test page with no Yale references.</p>
      </body>
      </html>
    `;
    
    const $ = cheerio.load(htmlWithoutYale);
    
    // Apply the same replacement logic
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
    
    const modifiedHtml = $.html();
    
    // Content should remain the same (no Yale University/College/Medical School)
    expect(modifiedHtml).toContain('<title>Test Page</title>');
    expect(modifiedHtml).toContain('<h1>Hello World</h1>');
    expect(modifiedHtml).toContain('<p>This is a test page with no Yale references.</p>');
  });

  test('should handle case-insensitive replacements', () => {
    const mixedCaseHtml = `
      <p>YALE University, Yale College, and yale medical school are all part of the same institution.</p>
    `;
    
    const $ = cheerio.load(mixedCaseHtml);
    
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
    
    const modifiedHtml = $.html();
    
    expect(modifiedHtml).toContain('FALE University, Fale College, and fale medical school');
  });
});