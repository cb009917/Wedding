# Image Optimization Guide

## Why Optimize Images

Optimized images significantly improve website performance:
- **Faster load times** - Smaller files load quicker, especially on mobile
- **Better UX** - Visitors don't wait for large images to download
- **Improved SEO** - Google prioritizes fast-loading sites
- **Reduced bandwidth** - Lower hosting costs and data usage

**Target metrics:**
- Gallery images: 100-300KB each (JPEG at 80-85% quality)
- Total page size: Under 3MB including all assets
- Largest Contentful Paint (LCP): Under 2.5s
- First Contentful Paint (FCP): Under 1.8s

## Image Specifications by Use Case

### Gallery Photos
- **Format:** JPEG (photos), PNG (graphics with transparency)
- **Dimensions:** 1200px width (maintains quality on most screens)
- **Quality:** 80-85% JPEG compression
- **File size:** 100-300KB per image
- **Aspect ratio:** Maintain original or use consistent ratio (4:3 or 16:9)

### Open Graph Image (Social Sharing)
- **Filename:** `og-image.jpg`
- **Dimensions:** 1200x630px (Facebook/LinkedIn recommended)
- **Format:** JPEG or PNG
- **File size:** Under 1MB
- **Location:** `public/og-image.jpg`
- **Content:** Couple photo or wedding graphic with readable text

### Favicons
- **Sizes needed:** 16x16, 32x32, 180x180 (Apple touch icon)
- **Format:** PNG or ICO
- **Location:** `public/` directory
- **Design:** Simple, recognizable (initials, rings, heart)

## Optimization Tools

### Online Tools (Free, No Installation)

**1. TinyPNG/TinyJPG** (https://tinypng.com/)
- Drag-and-drop interface
- Excellent compression with minimal quality loss
- Batch processing up to 20 images
- **Recommended for most users**

**2. Squoosh** (https://squoosh.app/)
- Google's image optimization tool
- Advanced quality/size controls
- Side-by-side comparison
- Supports WebP, AVIF formats

**3. ImageOptim Online** (https://imageoptim.com/online)
- Simple batch processing
- Lossless and lossy options

### Desktop Applications

- **ImageOptim** (Mac) - Free, drag-and-drop, excellent compression
- **FileOptimizer** (Windows) - Free, supports many formats
- **RIOT** (Windows) - Free, visual comparison tool

### Command Line Tools

**ImageMagick** (batch resize and compress):
```bash
# Resize to 1200px width, maintain aspect ratio
convert input.jpg -resize 1200x -quality 85 output.jpg

# Batch process all JPEGs in a directory
for img in *.jpg; do
  convert "$img" -resize 1200x -quality 85 "optimized/$img"
done
```

**mozjpeg** (better JPEG compression):
```bash
cjpeg -quality 85 -outfile output.jpg input.jpg
```

**cwebp** (convert to WebP):
```bash
cwebp -q 85 input.jpg -o output.webp
```

## Responsive Images Strategy

### Using srcset and sizes

Provide multiple image sizes for different screen resolutions:

```javascript
// In weddingData.js
export const galleryPhotos = [
  {
    id: 1,
    src: '/photos/ceremony-1-800.jpg',
    srcset: '/photos/ceremony-1-400.jpg 400w, /photos/ceremony-1-800.jpg 800w, /photos/ceremony-1-1200.jpg 1200w',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    alt: 'Ceremony moment',
  },
];
```

```jsx
// In PhotoGallery.jsx
<img
  src={photo.src}
  srcSet={photo.srcset}
  sizes={photo.sizes}
  alt={photo.alt}
  loading="lazy"
/>
```

**Browser automatically selects** the appropriate image based on screen size and resolution.

### Using picture with WebP

Provide modern WebP format with JPEG fallback:

```javascript
// In weddingData.js
export const galleryPhotos = [
  {
    id: 1,
    src: '/photos/ceremony-1.jpg',
    sources: [
      {
        type: 'image/webp',
        srcset: '/photos/ceremony-1-400.webp 400w, /photos/ceremony-1-800.webp 800w, /photos/ceremony-1-1200.webp 1200w',
      },
    ],
    srcset: '/photos/ceremony-1-400.jpg 400w, /photos/ceremony-1-800.jpg 800w, /photos/ceremony-1-1200.jpg 1200w',
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
    alt: 'Ceremony moment',
  },
];
```

```jsx
// In PhotoGallery.jsx
<picture>
  {photo.sources?.map((source, i) => (
    <source key={i} type={source.type} srcSet={source.srcset} />
  ))}
  <img
    src={photo.src}
    srcSet={photo.srcset}
    sizes={photo.sizes}
    alt={photo.alt}
    loading="lazy"
  />
</picture>
```

## WebP Format Benefits

**Advantages:**
- 20-30% smaller than JPEG at same quality
- Supported by all modern browsers (95%+ coverage)
- Better compression algorithm

**How to create WebP:**
- Use Squoosh (https://squoosh.app/)
- Use cwebp command-line tool
- Use online converters

**Implementation:**
- Always provide JPEG/PNG fallback
- Use `<picture>` element for graceful degradation
- Modern browsers use WebP, older browsers use JPEG

## Step-by-Step Workflow

### 1. Collect and Select Photos
- Choose best photos for gallery
- Quality over quantity (10-20 key moments)

### 2. Resize Images
Using online tool (TinyPNG):
1. Upload images
2. Download compressed versions

Using ImageMagick:
```bash
mkdir optimized
for img in *.jpg; do
  convert "$img" -resize 1200x -quality 85 "optimized/$img"
done
```

### 3. Create Multiple Sizes (Optional, for srcset)
```bash
# Create 400px, 800px, and 1200px versions
for img in *.jpg; do
  convert "$img" -resize 400x -quality 85 "optimized/${img%.jpg}-400.jpg"
  convert "$img" -resize 800x -quality 85 "optimized/${img%.jpg}-800.jpg"
  convert "$img" -resize 1200x -quality 85 "optimized/${img%.jpg}-1200.jpg"
done
```

### 4. Create WebP Versions (Optional)
```bash
for img in optimized/*.jpg; do
  cwebp -q 85 "$img" -o "${img%.jpg}.webp"
done
```

### 5. Rename with Descriptive Names
- Good: `ceremony-vows.jpg`, `reception-dance.jpg`
- Bad: `IMG_1234.jpg`, `DSC00056.jpg`

### 6. Place in public/photos/
```bash
cp optimized/*.jpg public/photos/
cp optimized/*.webp public/photos/  # if using WebP
```

### 7. Update weddingData.js
```javascript
export const galleryPhotos = [
  {
    id: 1,
    src: '/photos/ceremony-vows.jpg',
    alt: 'Exchanging wedding vows',
    caption: 'Our vows to each other',
  },
  // ... more photos
];
```

## Performance Testing

### Chrome DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Enable **Network throttling** (Fast 3G or Slow 3G)
4. Reload page and observe:
   - Total page size
   - Image load times
   - LCP (Largest Contentful Paint)

### Lighthouse Audit

1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Performance** category
4. Click **Analyze page load**
5. Review metrics:
   - Performance score (target: 90+)
   - FCP (target: <1.8s)
   - LCP (target: <2.5s)
   - Image optimization opportunities

### PageSpeed Insights

1. Visit https://pagespeed.web.dev/
2. Enter your deployed site URL
3. Review both Mobile and Desktop scores
4. Check "Opportunities" section for image optimization suggestions

### Performance Targets

- **Performance Score:** 90+ (Lighthouse)
- **First Contentful Paint:** <1.8s
- **Largest Contentful Paint:** <2.5s
- **Total Page Size:** <3MB (including all images)
- **Individual Images:** 100-300KB each

## Best Practices

### Do:
- ✅ Optimize all images before uploading
- ✅ Use descriptive filenames
- ✅ Maintain consistent aspect ratios
- ✅ Test on mobile devices and slow connections
- ✅ Use lazy loading (already implemented)
- ✅ Provide alt text for accessibility
- ✅ Consider WebP for 20-30% smaller files

### Don't:
- ❌ Upload original camera files (often 5-10MB each)
- ❌ Use unnecessarily large dimensions (4000px+ width)
- ❌ Over-compress (quality below 70% shows artifacts)
- ❌ Use PNG for photos (much larger than JPEG)
- ❌ Forget to test performance after adding images
- ❌ Use generic filenames (IMG_1234.jpg)

## Troubleshooting

### Images Not Loading
- **Check file paths** in `weddingData.js` (should start with `/photos/`)
- **Verify files exist** in `public/photos/` directory
- **Check file extensions** match (case-sensitive on some systems)

### Slow Loading
- **Check individual file sizes** (should be <300KB)
- **Use Chrome DevTools Network tab** to identify large files
- **Re-optimize large images** with higher compression

### Quality Issues
- **Images look pixelated:** Increase quality setting (85-90%) or dimensions (1600px width)
- **Images look blurry on high-DPI screens:** Increase dimensions (1600px width) or provide 2x versions
- **Balance quality and file size** based on your needs

### srcset Not Working
- **Verify multiple sizes exist** in `public/photos/`
- **Check srcset syntax** (format: `url width, url width, ...`)
- **Test with Chrome DevTools** device emulation at different screen sizes

## Additional Resources

- **Web.dev Image Optimization:** https://web.dev/fast/#optimize-your-images
- **MDN Responsive Images:** https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- **Can I Use WebP:** https://caniuse.com/webp
- **Image Optimization Tools:** https://www.shopify.com/blog/image-optimization-tools
- **Lighthouse Documentation:** https://developers.google.com/web/tools/lighthouse

## Quick Reference

**Resize and compress:**
```bash
convert input.jpg -resize 1200x -quality 85 output.jpg
```

**Create multiple sizes:**
```bash
convert input.jpg -resize 400x -quality 85 output-400.jpg
convert input.jpg -resize 800x -quality 85 output-800.jpg
convert input.jpg -resize 1200x -quality 85 output-1200.jpg
```

**Convert to WebP:**
```bash
cwebp -q 85 input.jpg -o output.webp
```

**Batch process:**
```bash
for img in *.jpg; do
  convert "$img" -resize 1200x -quality 85 "optimized/$img"
done
```
