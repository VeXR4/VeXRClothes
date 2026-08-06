import heroImage from '@/assets/banners/hero.svg';
import offerImage from '@/assets/banners/offer.svg';
import womenCat from '@/assets/categories/women.svg';
import menCat from '@/assets/categories/men.svg';
import shoesCat from '@/assets/categories/shoes.svg';
import m1 from '@/assets/magazine/m1.jpg';
import m2 from '@/assets/magazine/m2.jpg';
import m3 from '@/assets/magazine/m3.jpg';
import wBlazer from '@/assets/products/w-blazer.jpg';
import wDress from '@/assets/products/w-dress.jpg';
import wShirt from '@/assets/products/w-shirt.jpg';
import wPants from '@/assets/products/w-pants.jpg';
import wCoat from '@/assets/products/w-coat.jpg';
import wScarf from '@/assets/products/w-scarf.jpg';
import wSet from '@/assets/products/w-set.jpg';
import wTop from '@/assets/products/w-top.jpg';
import mShirt from '@/assets/products/m-shirt.jpg';
import mTshirt from '@/assets/products/m-tshirt.jpg';
import mPants from '@/assets/products/m-pants.jpg';
import mJacket from '@/assets/products/m-jacket.jpg';
import mHoodie from '@/assets/products/m-hoodie.jpg';
import mSweater from '@/assets/products/m-sweater.jpg';
import sWhite from '@/assets/products/s-white.jpg';
import sBlack from '@/assets/products/s-black.jpg';
import sBoot from '@/assets/products/s-boot.jpg';
import sSandal from '@/assets/products/s-sandal.jpg';

const map: Record<string, string> = {
  'banners/hero.svg': heroImage,
  'banners/offer.svg': offerImage,
  'categories/women.svg': womenCat,
  'categories/men.svg': menCat,
  'categories/shoes.svg': shoesCat,
  'magazine/m1.jpg': m1,
  'magazine/m2.jpg': m2,
  'magazine/m3.jpg': m3,
  'products/w-blazer.jpg': wBlazer,
  'products/w-dress.jpg': wDress,
  'products/w-shirt.jpg': wShirt,
  'products/w-pants.jpg': wPants,
  'products/w-coat.jpg': wCoat,
  'products/w-scarf.jpg': wScarf,
  'products/w-set.jpg': wSet,
  'products/w-top.jpg': wTop,
  'products/m-shirt.jpg': mShirt,
  'products/m-tshirt.jpg': mTshirt,
  'products/m-pants.jpg': mPants,
  'products/m-jacket.jpg': mJacket,
  'products/m-hoodie.jpg': mHoodie,
  'products/m-sweater.jpg': mSweater,
  'products/s-white.jpg': sWhite,
  'products/s-black.jpg': sBlack,
  'products/s-boot.jpg': sBoot,
  'products/s-sandal.jpg': sSandal,
};

export function img(path: string | null | undefined): string {
  if (!path) return '';
  if (map[path]) return map[path];
  return path;
}