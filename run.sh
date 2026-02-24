#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting migration from Create React App to Vite...${NC}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the correct directory?${NC}"
    exit 1
fi

# Backup important files
echo -e "${YELLOW}📦 Creating backup...${NC}"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r src public package.json $BACKUP_DIR/ 2>/dev/null
echo -e "${GREEN}✅ Backup created in $BACKUP_DIR${NC}"

# Install Vite dependencies
echo -e "${YELLOW}📦 Installing Vite dependencies...${NC}"
npm install --save-dev vite @vitejs/plugin-react

# Remove react-scripts
echo -e "${YELLOW}🗑️  Removing react-scripts...${NC}"
npm uninstall react-scripts

# Create vite.config.js
echo -e "${YELLOW}⚙️  Creating Vite configuration...${NC}"
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
EOF

# Update package.json scripts
echo -e "${YELLOW}📝 Updating package.json scripts...${NC}"
# Use temporary file for macOS compatibility
tmp=$(mktemp)
node -e '
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json"));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = "vite";
pkg.scripts.start = "vite";
pkg.scripts.build = "vite build";
pkg.scripts.preview = "vite preview";
if (pkg.scripts.test) {
  // Keep test script if it exists
  console.log("Test script preserved");
}
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
' 
echo -e "${GREEN}✅ Scripts updated${NC}"

# Move and update index.html
echo -e "${YELLOW}📄 Moving and updating index.html...${NC}"
if [ -f "public/index.html" ]; then
    # Backup original index.html
    cp public/index.html public/index.html.backup
    
    # Create new index.html in root
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
EOF
    
    echo -e "${GREEN}✅ index.html created in root${NC}"
else
    echo -e "${RED}⚠️  public/index.html not found. You may need to create it manually.${NC}"
fi

# Check and update main entry file
echo -e "${YELLOW}🔍 Checking main entry file...${NC}"
if [ -f "src/index.js" ]; then
    echo -e "${GREEN}✅ Found src/index.js${NC}"
elif [ -f "src/index.jsx" ]; then
    echo -e "${GREEN}✅ Found src/index.jsx${NC}"
else
    echo -e "${RED}⚠️  No index.js or index.jsx found in src/${NC}"
fi

# Update environment variables
echo -e "${YELLOW}🔧 Checking for environment variables...${NC}"
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Found .env file. Remember to change REACT_APP_ to VITE_ prefixes${NC}"
    cp .env .env.backup
    echo -e "${GREEN}✅ .env backed up to .env.backup${NC}"
fi

# Create vite.svg favicon if it doesn't exist
if [ ! -f "public/vite.svg" ]; then
    echo -e "${YELLOW}🎨 Creating Vite favicon...${NC}"
    cat > public/vite.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 410 404" fill="none">
  <path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z" fill="url(#paint0_linear)"/>
  <path d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.7465 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855605 292.965 1.5744Z" fill="white"/>
  <defs>
    <linearGradient id="paint0_linear" x1="6.00017" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse">
      <stop stop-color="#41D1FF"/>
      <stop offset="1" stop-color="#BD34FE"/>
    </linearGradient>
  </defs>
</svg>
EOF
    echo -e "${GREEN}✅ Vite favicon created${NC}"
fi

# Summary and next steps
echo -e "\n${GREEN}✨ Migration complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Review the changes made to your project"
echo "2. Check your .env file and rename REACT_APP_ variables to VITE_"
echo "3. Update any process.env references to import.meta.env"
echo "4. Run npm install to ensure all dependencies are installed"
echo "5. Start your dev server with: npm run dev"
echo -e "\n${YELLOW}⚠️  Important notes:${NC}"
echo "- If you use absolute imports, you may need to configure aliases in vite.config.js"
echo "- Check that all your images and assets are loading correctly"
echo "- Your original files are backed up in: $BACKUP_DIR"
echo -e "\n${GREEN}Happy coding! 🚀${NC}"