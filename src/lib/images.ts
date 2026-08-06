import heroImage from '@/assets/banners/hero.svg';
import offerImage from '@/assets/banners/offer.svg';
import womenCat from '@/assets/categories/women.svg';
import menCat from '@/assets/categories/men.svg';
import shoesCat from '@/assets/categories/shoes.svg';
import m1 from '@/assets/magazine/m1.svg';
import m2 from '@/assets/magazine/m2.svg';
import m3 from '@/assets/magazine/m3.svg';
import wBlazer from '@/assets/products/w-blazer.svg';
import wDress from '@/assets/products/w-dress.svg';
import wShirt from '@/assets/products/w-shirt.svg';
import wPants from '@/assets/products/w-pants.svg';
import wCoat from '@/assets/products/w-coat.svg';
import wScarf from '@/assets/products/w-scarf.svg';
import wSet from '@/assets/products/w-set.svg';
import wTop from '@/assets/products/w-top.svg';
import mShirt from '@/assets/products/m-shirt.svg';
import mTshirt from '@/assets/products/m-tshirt.svg';
import mPants from '@/assets/products/m-pants.svg';
import mJacket from '@/assets/products/m-jacket.svg';
import mHoodie from '@/assets/products/m-hoodie.svg';
import mSweater from '@/assets/products/m-sweater.svg';
import sWhite from '@/assets/products/s-white.svg';
import sBlack from '@/assets/products/s-black.svg';
import sBoot from '@/assets/products/s-boot.svg';
import sSandal from '@/assets/products/s-sandal.svg';

const map: Record<string, string> = {
  'banners/hero.svg': heroImage,
  'banners/offer.svg': offerImage,
  'categories/women.svg': womenCat,
  'categories/men.svg': menCat,
  'categories/shoes.svg': shoesCat,
  'magazine/m1.svg': m1,
  'magazine/m2.svg': m2,
  'magazine/m3.svg': m3,
  'products/w-blazer.svg': wBlazer,
  'products/w-dress.svg': wDress,
  'products/w-shirt.svg': wShirt,
  'products/w-pants.svg': wPants,
  'products/w-coat.svg': wCoat,
  'products/w-scarf.svg': wScarf,
  'products/w-set.svg': wSet,
  'products/w-top.svg': wTop,
  'products/m-shirt.svg': mShirt,
  'products/m-tshirt.svg': mTshirt,
  'products/m-pants.svg': mPants,
  'products/m-jacket.svg': mJacket,
  'products/m-hoodie.svg': mHoodie,
  'products/m-sweater.svg': mSweater,
  'products/s-white.svg': sWhite,
  'products/s-black.svg': sBlack,
  'products/s-boot.svg': sBoot,
  'products/s-sandal.svg': sSandal,
};

export function img(path: string | null | undefined): string {
  if (!path) return '';
  if (map[path]) return map[path];
  return path;
}
