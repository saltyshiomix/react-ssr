const { readFileSync, outputFileSync } = require('fs-extra');

const addShebang = (file) => {
  const shebang = `#!/usr/bin/env node

`;
  const content = readFileSync(file);
  outputFileSync(file, shebang + content.toString());
};

addShebang('react-ssr.js');
addShebang('react-ssr-dev.js');
