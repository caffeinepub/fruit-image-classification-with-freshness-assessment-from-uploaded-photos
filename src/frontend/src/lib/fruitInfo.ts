interface FruitInfo {
  name: string;
  description: string;
  varieties: string;
  taste: string;
  storage: string;
  ripenessIndicators: string;
}

const fruitDatabase: Record<string, FruitInfo> = {
  apple: {
    name: 'Apple',
    description: 'Apples are one of the most popular fruits worldwide, known for their crisp texture and sweet-tart flavor. They come in thousands of varieties, each with unique characteristics.',
    varieties: 'Gala, Fuji, Granny Smith, Honeycrisp, Red Delicious, Golden Delicious',
    taste: 'Ranges from sweet to tart depending on variety, with a crisp, juicy texture',
    storage: 'Store in the refrigerator for up to 4-6 weeks. Keep away from other produce as they emit ethylene gas.',
    ripenessIndicators: 'Firm to touch, vibrant color, no soft spots or bruises. Ripe apples should have a sweet aroma.',
  },
  banana: {
    name: 'Banana',
    description: 'Bananas are tropical fruits with a distinctive curved shape and creamy texture. They are rich in potassium and provide quick energy, making them a favorite among athletes.',
    varieties: 'Cavendish, Plantain, Lady Finger, Red Banana, Burro',
    taste: 'Sweet and creamy with a soft, smooth texture when ripe',
    storage: 'Store at room temperature. Refrigerate only when fully ripe to slow further ripening.',
    ripenessIndicators: 'Yellow skin with small brown spots indicates peak ripeness. Green bananas are unripe, while heavily spotted or brown bananas are overripe.',
  },
  orange: {
    name: 'Orange',
    description: 'Oranges are citrus fruits prized for their sweet-tart juice and high vitamin C content. They have a bright orange peel and segmented flesh that is both refreshing and nutritious.',
    varieties: 'Navel, Valencia, Blood Orange, Cara Cara, Mandarin',
    taste: 'Sweet and tangy with juicy, refreshing flesh',
    storage: 'Store at room temperature for up to a week, or refrigerate for 2-3 weeks.',
    ripenessIndicators: 'Heavy for their size, firm with slight give, vibrant orange color. Avoid oranges with soft spots or mold.',
  },
  strawberry: {
    name: 'Strawberry',
    description: 'Strawberries are beloved for their bright red color, juicy texture, and sweet flavor. These berries are rich in antioxidants and vitamin C, making them both delicious and nutritious.',
    varieties: 'Albion, Chandler, Seascape, Jewel, Camarosa',
    taste: 'Sweet and slightly tart with a juicy, tender texture',
    storage: 'Refrigerate unwashed in a breathable container. Use within 3-5 days for best quality.',
    ripenessIndicators: 'Bright red color throughout, fresh green caps, firm texture. Avoid berries with white or green areas, or signs of mold.',
  },
  grapes: {
    name: 'Grapes',
    description: 'Grapes are small, round fruits that grow in clusters. They come in various colors including green, red, and purple, and can be eaten fresh, dried as raisins, or used to make wine.',
    varieties: 'Thompson Seedless, Red Globe, Concord, Flame Seedless, Cotton Candy',
    taste: 'Sweet and juicy, with some varieties having a slight tartness',
    storage: 'Refrigerate unwashed in a perforated bag. Can last 1-2 weeks when properly stored.',
    ripenessIndicators: 'Plump and firmly attached to stems, consistent color, slight bloom (white coating). Avoid shriveled or brown grapes.',
  },
  peach: {
    name: 'Peach',
    description: 'Peaches are stone fruits with fuzzy skin and sweet, juicy flesh. They are a summer favorite, perfect for eating fresh or using in desserts and preserves.',
    varieties: 'Elberta, Redhaven, O\'Henry, Donut Peach, White Peach',
    taste: 'Sweet and juicy with a delicate, aromatic flavor',
    storage: 'Ripen at room temperature, then refrigerate for up to 5 days. Handle gently to avoid bruising.',
    ripenessIndicators: 'Slight give when gently pressed, sweet aroma, golden or rosy color. Avoid hard or overly soft peaches.',
  },
  pear: {
    name: 'Pear',
    description: 'Pears are sweet fruits with a distinctive bell shape and smooth texture. Unlike most fruits, pears ripen best off the tree, developing their characteristic buttery texture.',
    varieties: 'Bartlett, Anjou, Bosc, Comice, Asian Pear',
    taste: 'Sweet and juicy with a smooth, buttery texture when ripe',
    storage: 'Ripen at room temperature, then refrigerate for up to 5 days. Check daily for ripeness.',
    ripenessIndicators: 'Gentle give near the stem when pressed, sweet aroma. Color varies by variety. Avoid pears with bruises or overly soft spots.',
  },
  plum: {
    name: 'Plum',
    description: 'Plums are stone fruits with smooth skin that ranges from deep purple to golden yellow. They have a sweet-tart flavor and can be eaten fresh or dried as prunes.',
    varieties: 'Santa Rosa, Black Amber, Elephant Heart, Damson, Mirabelle',
    taste: 'Sweet-tart with juicy flesh, flavor intensifies when fully ripe',
    storage: 'Ripen at room temperature, then refrigerate for up to 5 days.',
    ripenessIndicators: 'Slight give when gently pressed, sweet aroma, vibrant color with slight bloom. Avoid hard or overly soft plums.',
  },
};

const genericInfo: FruitInfo = {
  name: 'Fruit',
  description: 'Fresh fruits are an essential part of a healthy diet, providing vitamins, minerals, fiber, and antioxidants. Each fruit has unique nutritional benefits and flavor profiles.',
  varieties: 'Thousands of fruit varieties exist worldwide',
  taste: 'Varies widely from sweet to tart, with diverse textures',
  storage: 'Most fruits should be stored in a cool, dry place or refrigerated. Avoid washing until ready to eat.',
  ripenessIndicators: 'Look for vibrant color, pleasant aroma, and appropriate firmness. Avoid fruits with bruises, mold, or off-odors.',
};

export function getFruitInfo(fruitType: string): FruitInfo {
  const normalizedType = fruitType.toLowerCase();
  return fruitDatabase[normalizedType] || genericInfo;
}
