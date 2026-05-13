const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src')
];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remove shadows
  content = content.replace(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g, '');
  content = content.replace(/\bshadow\b/g, '');
  content = content.replace(/\bdrop-shadow(-\[.*?\]|-[a-z0-9]+)?\b/g, '');

  // Remove transitions & animations
  content = content.replace(/\btransition(-[a-zA-Z0-9]+)?\b/g, '');
  content = content.replace(/\bduration-[0-9]+\b/g, '');
  content = content.replace(/\bease-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\banimate-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\btransform\b/g, '');
  content = content.replace(/\bhover:scale-[0-9]+\b/g, '');
  content = content.replace(/\bhover:-translate-[a-zA-Z0-9\-]+\b/g, '');

  // Remove gradients
  content = content.replace(/\bbg-gradient-to-[a-z]+\b/g, '');
  content = content.replace(/\bfrom-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\bto-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\bvia-[a-zA-Z0-9\-]+\b/g, '');

  // Remove blur/glass
  content = content.replace(/\bbackdrop-blur(-[a-z]+)?\b/g, '');
  content = content.replace(/\bbg-white\/[0-9]+\b/g, 'bg-white');

  // Remove rings
  content = content.replace(/\bfocus:ring-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\bfocus:ring\b/g, '');
  content = content.replace(/\bring-[a-zA-Z0-9\-]+\b/g, '');
  content = content.replace(/\bring\b/g, '');

  // Simplify rounding
  content = content.replace(/\brounded-(xl|2xl|3xl|full|lg|md|sm)\b/g, 'rounded-none');
  content = content.replace(/\brounded\b/g, 'rounded-none');

  // Simplify background colors
  content = content.replace(/\bbg-slate-[0-9]+\b/g, 'bg-white');
  content = content.replace(/\bbg-gray-[0-9]+\b/g, 'bg-white');
  content = content.replace(/\bbg-blue-[1-4]00\b/g, 'bg-white'); // light blue bg -> white
  
  // Make borders sharp and distinct
  content = content.replace(/\bborder-slate-[1-4]00\b/g, 'border-black');
  content = content.replace(/\bborder-gray-[1-4]00\b/g, 'border-black');

  // Cleanup multiple spaces inside classNames
  content = content.replace(/className="([^"]*)"/g, (match, p1) => {
    return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      // Only go into pages and components
      if (file.includes('pages') || file.includes('components')) {
        walk(file);
      }
    } else { 
      processFile(file);
    }
  });
}

directories.forEach(dir => {
  if (dir.endsWith('src')) {
     processFile(path.join(dir, 'App.tsx'));
  } else {
     walk(dir);
  }
});
