export interface MegaMenuTile {
  label: string;
  href: string;
}

export interface MegaMenuSection {
  label: string;
  href: string;
  links: { label: string; href: string }[];
  tiles: MegaMenuTile[];
}

export const NAV_SECTIONS: MegaMenuSection[] = [
  {
    label: "Women",
    href: "/products?category=women",
    links: [
      { label: "New arrivals", href: "/products?category=women&ordering=-created" },
      { label: "Ready-to-wear", href: "/products?category=women-rtw" },
      { label: "Outerwear", href: "/products?category=women-outerwear" },
      { label: "Accessories", href: "/products?category=women-accessories" },
    ],
    tiles: [
      { label: "The Tailored Edit", href: "/products?category=women-rtw" },
      { label: "Evening", href: "/products?category=women-evening" },
    ],
  },
  {
    label: "Men",
    href: "/products?category=men",
    links: [
      { label: "New arrivals", href: "/products?category=men&ordering=-created" },
      { label: "Tailoring", href: "/products?category=men-tailoring" },
      { label: "Outerwear", href: "/products?category=men-outerwear" },
      { label: "Accessories", href: "/products?category=men-accessories" },
    ],
    tiles: [
      { label: "Winter Tailoring", href: "/products?category=men-tailoring" },
      { label: "Essentials", href: "/products?category=men-essentials" },
    ],
  },
  {
    label: "Accessories",
    href: "/products?category=accessories",
    links: [
      { label: "Bags", href: "/products?category=bags" },
      { label: "Shoes", href: "/products?category=shoes" },
      { label: "Jewelry", href: "/products?category=jewelry" },
    ],
    tiles: [{ label: "Leather Goods", href: "/products?category=bags" }],
  },
];

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Women", href: "/products?category=women" },
      { label: "Men", href: "/products?category=men" },
      { label: "Accessories", href: "/products?category=accessories" },
      { label: "New arrivals", href: "/products?ordering=-created" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Contact", href: "/help/contact" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns", href: "/help/returns" },
      { label: "FAQ", href: "/help/faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Careers", href: "/company/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
];
