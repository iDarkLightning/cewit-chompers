import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  let ingredients = ['mixed berries', 'peas', 'olive oil', 'tortillas', 'lettuce', 'chicken breast', 'cardamom syrup', 'tamarind', 'cottage cheese', 'cauliflower', 'oats', 'graham cracker crust', 'rice', 'basmati rice', 'balsamic glaze', 'bell peppers', 'capers', 'garlic', 'salt', 'water', 'chicken broth', 'balsamic vinegar', 'almonds', 'masala spices', 'tzatziki sauce', 'semolina', 'balsamic vinaigrette', 'popcorn', 'pancetta', 'mushroom', 'cheese', 'peanut oil', 'heavy cream', 'raw fish', 'oranges', 'peanuts', 'sugar', 'teriyaki sauce', 'cilantro', 'chicken wings', 'tamarind chutney', 'seaweed', 'cucumbers', 'cabbage', 'sesame oil', 'curry leaves', 'strawberries', 'mixed fruits', 'cocoa powder', 'grilled chicken', 'onion', 'bbq sauce', 'honey', 'vegetable oil', 'mustard', 'soybeans', 'dill', 'beef', 'pectin', 'kidney beans', 'curry powder', 'tofu', 'croutons', 'mango', 'fish fillets', 'manchurian sauce', 'yogurt', 'greek yogurt', 'rice vinegar', 'fajita seasoning', 'mutton', 'vegetable broth', 'cardamom', 'lemon zest', 'potato masala', 'arborio rice', 'apples', 'red onion', 'pav bun', 'cocoa butter', 'creamy sauce', 'noodles', 'lemon', 'syrup', 'ground beef', 'puff pastry', 'brussels sprouts', 'soy sauce', 'emulsifiers', 'maple syrup', 'black beans', 'nutmeg', 'tomatoes', 'mayonnaise', 'vinegar', 'orange sauce', 'granola', 'butternut squash', 'phyllo dough', 'oil', 'potatoes', 'lemon juice', 'tandoori spices', 'coffee', 'milk powder', 'avocado', 'mustard seeds', 'ratatouille vegetables', 'mushrooms', 'lamb', 'alfredo sauce', 'coconut milk', 'pumpkin', 'baking powder', 'chicken', 'icing', 'sausage', 'mixed vegetables', 'pesto sauce', 'potato', 'mozzarella', 'curry paste', 'vinaigrette', 'herbs', 'corn syrup', 'cucumber', 'tikka masala sauce', 'pizza dough', 'goat cheese', 'raisins', 'shrimp', 'tikka masala', 'quinoa', 'celery', 'pumpkin spice', 'parmesan cheese', 'chocolate', 'sour cream', 'breadcrumbs', 'buffalo sauce', 'romaine lettuce', 'chickpeas', 'brandy', 'buttermilk', 'butter', 'feta cheese', 'rose water', 'satay sauce', 'graham crackers', 'saffron syrup', 'tuna', 'kashmiri red chili', 'miso paste', 'whipped cream', 'biryani masala', 'ladyfingers', 'flour', 'eggs', 'tomato sauce', 'vegetables', 'mozzarella cheese', 'milk solids', 'shawarma spices', 'nuts', 'salmon', 'pork ribs', 'lime juice', 'egg', 'poppy seeds', 'shortcake', 'ham', 'kulcha bread', 'basil', 'lentil dumplings', 'salmon fillet', 'zucchini', 'ground meat', 'paneer', 'burrito seasoning', 'creamy tomato sauce', 'coconut oil', 'taco seasoning', 'lobster', 'sweet potatoes', 'spinach', 'blueberries', 'cocoa', 'bananas', 'lemon pepper seasoning', 'sushi rice', 'cod', 'caesar dressing', 'paprika', 'wheat flour', 'shawarma seasoning', 'bacon', 'cinnamon', 'marshmallows', 'portobello mushrooms', 'brown sugar', 'peanut butter', 'carrots', 'bread crumbs', 'dough', 'berries', 'beef broth', 'raspberries', 'ginger', 'chutney', 'pineapple', 'mascarpone cheese', 'enchilada sauce', 'cookies', 'fish', 'vanilla pudding mix', 'mint', 'marinara sauce', 'spices', 'fresh tomatoes', 'prawns', 'pastry', 'burger bun', 'pecans', 'almond milk', 'tomato broth', 'curry spices', 'pasta', 'caramel', 'nori ', 'lime', 'ghee', 'cream cheese', 'brie cheese', 'coffee liqueur', 'pepper', 'watermelon', 'fermented batter', 'bread', 'onions', 'olives', 'pav bread', 'cream', 'milk', 'vanilla extract', 'spiced water', 'turmeric', 'lentils', 'chole masala', 'eggplant', 'chili powder', 'seasonings', 'chocolate chips', 'pistachios', 'quail eggs', 'mango chutney', 'pomegranate seeds', 'provolone cheese', 'truffle oil', 'cranberry sauce', 'pesto aioli', 'sun-dried tomatoes', 'artichoke hearts', 'dijon mustard', 'coconut flakes', 'red curry paste', 'garam masala', 'gruyère cheese', 'anchovies', 'sourdough bread', 'sherry vinegar', 'tofu noodles', 'raspberry jam', 'bourbon', 'cilantro pesto', 'ghee-infused butter', 'smoked paprika', 'cashews', 'maple-glazed bacon', 'wasabi paste', 'hoisin sauce', 'prosciutto', 'lemon thyme', 'raspberry vinaigrette', 'szechuan peppercorns', 'red wine', 'bok choy', 'harissa paste', 'caramelized onions', 'dried figs', 'champagne vinegar', 'goat milk', 'sriracha sauce', 'chia seeds', 'saffron threads', 'cumin seeds', 'hazelnuts', 'champagne', 'brown rice', 'kimchi', 'za\'atar spice blend', 'tarragon', 'sweet chili sauce'];

  await prisma.ingredient.createMany({
    data: ingredients.map((str) => ({ name: str })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  }).catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });