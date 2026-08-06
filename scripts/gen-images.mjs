import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const root = 'src/assets';

// Helper: build a fashion-style placeholder SVG
function fashionSvg({
  bg = '#FAF9F6',
  fg = '#1f1f1f',
  accent = '#C8A97E',
  label,
  sub = '',
  shape = 'garment',
  w = 800,
  h = 1000,
}) {
  const shapes = {
    garment: `
      <path d="M300 300 L240 360 L200 520 L240 540 L260 460 L260 760 L540 760 L540 460 L560 540 L600 520 L560 360 L500 300 L460 340 L400 360 L340 340 Z" fill="${fg}" opacity="0.92"/>
      <rect x="385" y="300" width="30" height="60" rx="14" fill="${accent}" opacity="0.85"/>
    `,
    dress: `
      <path d="M320 300 L260 380 L240 760 L560 760 L540 380 L480 300 L440 340 L400 360 L360 340 Z" fill="${fg}" opacity="0.92"/>
      <path d="M320 300 L400 360 L480 300 L460 260 L340 260 Z" fill="${accent}" opacity="0.8"/>
    `,
    pants: `
      <path d="M300 300 L260 300 L240 760 L380 760 L400 460 L420 760 L560 760 L540 300 L500 300 Z" fill="${fg}" opacity="0.92"/>
      <rect x="395" y="300" width="10" height="460" fill="${accent}" opacity="0.5"/>
    `,
    shirt: `
      <path d="M280 320 L240 380 L240 740 L560 740 L560 380 L520 320 L460 360 L400 300 L340 360 Z" fill="${fg}" opacity="0.92"/>
      <rect x="385" y="320" width="30" height="40" rx="6" fill="${accent}" opacity="0.7"/>
    `,
    tshirt: `
      <path d="M290 340 L250 400 L250 720 L550 720 L550 400 L510 340 L460 380 L400 320 L340 380 Z" fill="${fg}" opacity="0.92"/>
    `,
    jacket: `
      <path d="M280 300 L220 380 L220 760 L380 760 L380 420 L420 420 L420 760 L580 760 L580 380 L520 300 L460 340 L400 300 L340 340 Z" fill="${fg}" opacity="0.92"/>
      <line x1="400" y1="300" x2="400" y2="420" stroke="${accent}" stroke-width="4" opacity="0.7"/>
    `,
    hoodie: `
      <path d="M270 360 L230 420 L230 760 L570 760 L570 420 L530 360 L470 380 L400 300 L330 380 Z" fill="${fg}" opacity="0.92"/>
      <path d="M330 300 Q400 240 470 300 L470 360 Q400 320 330 360 Z" fill="${accent}" opacity="0.7"/>
    `,
    shoes: `
      <path d="M180 560 Q160 520 220 500 L520 480 Q620 480 640 540 L640 620 L180 620 Z" fill="${fg}" opacity="0.92"/>
      <path d="M180 560 Q160 520 220 500 L260 495 L260 560 Z" fill="${accent}" opacity="0.7"/>
      <ellipse cx="410" cy="620" rx="240" ry="20" fill="#000" opacity="0.06"/>
    `,
    sneaker: `
      <path d="M160 580 Q150 520 230 510 L420 500 Q480 500 500 540 L520 580 L560 590 Q580 600 560 620 L160 620 Z" fill="${fg}" opacity="0.95"/>
      <path d="M160 580 Q150 520 230 510 L260 505 L260 580 Z" fill="${accent}" opacity="0.75"/>
      <circle cx="300" cy="560" r="6" fill="${accent}"/>
      <circle cx="340" cy="560" r="6" fill="${accent}"/>
      <circle cx="380" cy="560" r="6" fill="${accent}"/>
    `,
    boot: `
      <path d="M220 300 L260 300 L280 560 L600 560 L620 620 L220 620 Z" fill="${fg}" opacity="0.92"/>
      <rect x="220" y="560" width="400" height="30" fill="${accent}" opacity="0.6"/>
    `,
    accessory: `
      <rect x="300" y="380" width="200" height="280" rx="20" fill="${fg}" opacity="0.92"/>
      <rect x="340" y="340" width="120" height="60" rx="30" fill="${accent}" opacity="0.8"/>
      <circle cx="400" cy="500" r="40" fill="${accent}" opacity="0.5"/>
    `,
    scarf: `
      <path d="M260 300 Q400 240 540 300 L500 520 Q400 580 300 520 Z" fill="${accent}" opacity="0.85"/>
      <path d="M260 300 Q400 240 540 300 L520 360 Q400 320 280 360 Z" fill="${fg}" opacity="0.7"/>
    `,
    hero: `
      <rect x="0" y="0" width="${w}" height="${h}" fill="${fg}"/>
      <path d="M0 ${h*0.35} L${w} ${h*0.2} L${w} ${h} L0 ${h} Z" fill="${accent}" opacity="0.25"/>
      <path d="M0 ${h*0.55} L${w*0.6} ${h*0.4} L${w} ${h*0.6} L${w} ${h} L0 ${h} Z" fill="${fg}" opacity="0.4"/>
      <ellipse cx="${w*0.5}" cy="${h*0.45}" rx="${w*0.18}" ry="${h*0.22}" fill="${accent}" opacity="0.3"/>
    `,
    offer: `
      <rect x="0" y="0" width="${w}" height="${h}" fill="${fg}"/>
      <path d="M0 0 L${w*0.5} 0 L${w*0.3} ${h} L0 ${h} Z" fill="${accent}" opacity="0.2"/>
      <circle cx="${w*0.7}" cy="${h*0.5}" r="${w*0.2}" fill="${accent}" opacity="0.15"/>
    `,
    magazine: `
      <rect x="0" y="0" width="${w}" height="${h}" fill="${bg}"/>
      <rect x="60" y="80" width="${w-120}" height="${h-160}" fill="${fg}" opacity="0.9"/>
      <rect x="60" y="80" width="${w-120}" height="60" fill="${accent}" opacity="0.8"/>
    `,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${shapes[shape] || shapes.garment}
  <text x="${w/2}" y="${h - 60}" text-anchor="middle" font-family="serif" font-size="28" fill="${fg}" opacity="0.7" font-weight="500">${label}</text>
  ${sub ? `<text x="${w/2}" y="${h - 30}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="${fg}" opacity="0.4">${sub}</text>` : ''}
</svg>`;
}

const items = [
  // Hero & banners
  { path: 'banners/hero.svg', shape: 'hero', label: 'VeXRClothes', sub: 'پوشاک وکس آر', w: 1600, h: 1000, fg: '#1a1a1a', accent: '#C8A97E' },
  { path: 'banners/offer.svg', shape: 'offer', label: 'SPECIAL OFFER', sub: 'تا ٪۴۰ تخفیف', w: 1600, h: 900, fg: '#141414', accent: '#C8A97E' },

  // Categories
  { path: 'categories/women.svg', shape: 'dress', label: 'زنانه', sub: 'Women', w: 800, h: 1000, fg: '#2a2a2a', accent: '#C8A97E' },
  { path: 'categories/men.svg', shape: 'jacket', label: 'مردانه', sub: 'Men', w: 800, h: 1000, fg: '#1f1f1f', accent: '#C8A97E' },
  { path: 'categories/shoes.svg', shape: 'sneaker', label: 'کفش', sub: 'Shoes', w: 800, h: 1000, fg: '#1a1a1a', accent: '#C8A97E' },

  // Women products
  { path: 'products/w-blazer.svg', shape: 'garment', label: 'بلیزر کرم', sub: 'Women · Blazer', fg: '#d9c4a3', accent: '#1f1f1f' },
  { path: 'products/w-dress.svg', shape: 'dress', label: 'مانتو مینیمال', sub: 'Women · Dress', fg: '#2a2a2a', accent: '#C8A97E' },
  { path: 'products/w-shirt.svg', shape: 'shirt', label: 'شومیز ابریشمی', sub: 'Women · Top', fg: '#f0e8d8', accent: '#b8915f' },
  { path: 'products/w-pants.svg', shape: 'pants', label: 'شلوار کتان', sub: 'Women · Pants', fg: '#3a3a3a', accent: '#C8A97E' },
  { path: 'products/w-coat.svg', shape: 'jacket', label: 'پالتو چارکول', sub: 'Women · Coat', fg: '#1f1f1f', accent: '#C8A97E' },
  { path: 'products/w-scarf.svg', shape: 'scarf', label: 'شال کرپ', sub: 'Women · Accessory', fg: '#b8915f', accent: '#f0e8d8' },
  { path: 'products/w-set.svg', shape: 'garment', label: 'مانتو شلوار ست', sub: 'Women · Set', fg: '#333333', accent: '#C8A97E' },
  { path: 'products/w-top.svg', shape: 'tshirt', label: 'تاپ نخی', sub: 'Women · Top', fg: '#e7d3b8', accent: '#1f1f1f' },

  // Men products
  { path: 'products/m-shirt.svg', shape: 'shirt', label: 'پیراهن مردانه', sub: 'Men · Shirt', fg: '#f3e9da', accent: '#333333' },
  { path: 'products/m-tshirt.svg', shape: 'tshirt', label: 'تیشرت برزیلی', sub: 'Men · T-Shirt', fg: '#1f1f1f', accent: '#C8A97E' },
  { path: 'products/m-pants.svg', shape: 'pants', label: 'شلوار جین', sub: 'Men · Pants', fg: '#2a3a4a', accent: '#C8A97E' },
  { path: 'products/m-jacket.svg', shape: 'jacket', label: 'ژکت چرمی', sub: 'Men · Jacket', fg: '#1a1a1a', accent: '#8a6a3e' },
  { path: 'products/m-hoodie.svg', shape: 'hoodie', label: 'هودی چارکول', sub: 'Men · Hoodie', fg: '#2a2a2a', accent: '#C8A97E' },
  { path: 'products/m-sweater.svg', shape: 'garment', label: 'سویشرت نرم', sub: 'Men · Sweater', fg: '#4a4a4a', accent: '#C8A97E' },

  // Shoes
  { path: 'products/s-white.svg', shape: 'sneaker', label: 'اسنیکرز سفید', sub: 'Shoes · Sneaker', fg: '#f0ece4', accent: '#1f1f1f' },
  { path: 'products/s-black.svg', shape: 'shoes', label: 'کفش چرم مشکی', sub: 'Shoes · Leather', fg: '#141414', accent: '#666666' },
  { path: 'products/s-boot.svg', shape: 'boot', label: 'بوت زمستانی', sub: 'Shoes · Boot', fg: '#3a2a1a', accent: '#C8A97E' },
  { path: 'products/s-sandal.svg', shape: 'sneaker', label: 'صندل تابستانی', sub: 'Shoes · Sandal', fg: '#C8A97E', accent: '#1f1f1f' },

  // Magazine
  { path: 'magazine/m1.svg', shape: 'magazine', label: 'استایل مینیمال', sub: 'استایل', w: 1000, h: 700, fg: '#1f1f1f', accent: '#C8A97E' },
  { path: 'magazine/m2.svg', shape: 'magazine', label: 'راهنمای کفش', sub: 'راهنما', w: 1000, h: 700, fg: '#2a2a2a', accent: '#b8915f' },
  { path: 'magazine/m3.svg', shape: 'magazine', label: 'ترکیب رنگ', sub: 'مجله', w: 1000, h: 700, fg: '#333333', accent: '#C8A97E' },
];

for (const item of items) {
  const fullPath = join(root, item.path);
  mkdirSync(join(root, item.path.split('/').slice(0, -1).join('/')), { recursive: true });
  const svg = fashionSvg(item);
  writeFileSync(fullPath, svg, 'utf-8');
  console.log('wrote', item.path);
}
console.log('Done:', items.length, 'images');
