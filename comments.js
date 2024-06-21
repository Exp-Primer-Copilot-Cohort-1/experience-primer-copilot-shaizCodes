// Create web server
// Create a server that listens on port 3000 and serves the comments.html file
// The comments.html file should have a form that allows users to submit comments
// When the form is submitted, the comment should be added to a list of comments
// The comments should be displayed on the page
// Use the fs module to read and write comments to a file called comments.json
// The comments should persist even after the server is restarted
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/comments') {
      fs.readFile(path.join(__dirname, 'comments.json'), (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal server error');
          return;
        }

        const comments = JSON.parse(data);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>');
        res.write('<html>');
        res.write('<head><title>Comments</title></head>');
        res.write('<body>');
        res.write('<h1>Comments</h1>');
        res.write('<ul>');
        for (const comment of comments) {
          res.write(`<li>${comment}</li>`);
        }
        res.write('</ul>');
        res.write('<form method="POST">');
        res.write('<label for="comment">Comment:</label>');
        res.write('<input type="text" id="comment" name="comment">');
        res.write('<button type="submit">Submit</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        res.end();
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const query = new URLSearchParams(body);
      const comment = query.get('comment');

      fs.readFile(path.join(__dirname, 'comments.json'), (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('