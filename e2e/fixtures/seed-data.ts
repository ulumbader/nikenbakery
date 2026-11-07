export const SEED_DATA = {
  admin: {
    username: "testadmin",
    password: "testadmin12345",
  },
  categories: [
    { name: "Cake", slug: "cake" },
    { name: "Brownies & Bars", slug: "brownies-bars" },
    { name: "Cookies", slug: "cookies" },
    { name: "Pastry", slug: "pastry" },
  ],
  products: {
    inStock: {
      name: "Strawberry Shortcake",
      slug: "strawberry-shortcake",
      defaultPrice: 185000,
      firstVariantLabel: "Diameter 16 cm",
      secondVariantLabel: "Diameter 20 cm",
      secondVariantPrice: 265000,
    },
    outOfStock: {
      name: "Lemon Bars",
      slug: "lemon-bars",
      status: "soldout",
    },
    preorder: {
      name: "Mille Crepes",
      slug: "mille-crepes",
      status: "preorder",
      leadTimeText: "H-2",
    },
  },
  phone: "081234567890",
  phoneFormatted: "6281234567890",
};
