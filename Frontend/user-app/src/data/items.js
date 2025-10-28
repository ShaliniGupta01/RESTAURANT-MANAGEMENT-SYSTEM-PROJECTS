const ITEMS = [
  {
    id: "i1",
    name: "Marinara",
    price: 200,
    category: "Pizza",
    image: "",
    prep: 10,
    stock: 10,
  },
  {
    id: "i2",
    name: "Pepperoni",
    price: 300,
    category: "Pizza",
    image: "",
    prep: 15,
    stock: 5,
  },
  {
    id: "i3",
    name: "Capricciosa",
    price: 200,
    category: "Pizza",
    image: "",
    prep: 12,
    stock: 5,
  },
  {
    id: "i4",
    name: "Sicilian",
    price: 150,
    category: "Pizza",
    image: "",
    prep: 8,
    stock: 8,
  },
  // filler items
  ...Array.from({ length: 40 }).map((_, i) => ({
    id: `p${i + 10}`,
    name: `Item ${i + 10}`,
    price: 90 + (i % 5) * 20,
    category: ["Burger", "Pizza", "Drink", "French fries", "Veggies"][i % 5],
    image: "",
    prep: 8 + (i % 5),
    stock: 20,
  })),
];

export default ITEMS;
