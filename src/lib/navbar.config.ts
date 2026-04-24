export interface NavbarChild {
  name: string;
  path: string;
}

export interface NavbarItem {
  name: string;
  path: string;
  children?: NavbarChild[];
}

export const NAVBAR_MENU: NavbarItem[] = [
  {
    name: "Water Bottles",
    path: "/category/water-bottles",
    children: [
      { name: "Bottles", path: "/category/bottles" },
      { name: "Tumblers", path: "/category/tumblers" },
      { name: "Kids Bottles", path: "/category/kids" },
    ],
  },
  {
    name: "Toys & Games",
    path: "/category/toys",
    children: [
      { name: "Educational", path: "/category/educational" },
      { name: "Outdoor", path: "/category/outdoor" },
    ],
  },
  {
    name: "Gift Items",
    path: "/category/gifts",
  },
  {
    name: "Corporate Orders",
    path: "/corporate",
  },
];
