# Logo Placement Guide

## Where to Put Your Logo

### Option 1: Public Directory (Recommended)
Place your logo file in: `/frontend/public/images/logo.png`

This is the recommended approach because:
- Files in the public directory are served directly
- No import statements needed
- Easy to reference with `/images/logo.png`
- Supports any image format (PNG, JPG, SVG, etc.)

### Option 2: Assets Directory
Place your logo file in: `/frontend/src/assets/images/logo.png`

If you use this approach, you'll need to import it in your component:
```javascript
import logo from './assets/images/logo.png';
```

## Supported Logo Formats
- PNG (recommended for logos with transparency)
- JPG/JPEG (for photographic logos)
- SVG (recommended for scalable vector logos)
- GIF (for animated logos)

## Logo Requirements
- **Recommended size**: 200px wide x 60px high (or similar aspect ratio)
- **File size**: Keep under 100KB for fast loading
- **Background**: Transparent PNG or white background
- **Name**: Use `logo.png` (or your preferred format extension)

## Current Implementation
The navigation bar is set up to:
1. Try to load the logo from `/images/logo.png`
2. Fall back to text "XR Media Plan" if the image fails to load
3. Scale the logo to 40px height automatically

## To Use Your Logo
1. Copy your logo file to `/frontend/public/images/logo.png`
2. If your logo has a different name, update the src in App.js:
   ```javascript
   src="/images/your-logo-name.png"
   ```

## Logo Styling
The logo styles are defined in `src/index.css` under `.logo-img` class. You can modify:
- Height (currently 40px)
- Max-width (currently 150px)
- Object-fit behavior
