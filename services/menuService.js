const CATEGORY_ORDER = [
  'salads',
  'wraps & sandwiches',
  'wraps',
  'sandwiches',
  'mains',
  'main course',
  'sides',
  'fruit & yogurt cups',
  'fruit',
  'desserts',
  'beverages',
];

const MENU_HIGHLIGHTS = [
  { title: 'Fresh Ingredients', detail: 'Seasonal produce and balanced flavor.' },
  { title: 'Custom Menus', detail: 'Built around guest count and service style.' },
  { title: 'Reliable Delivery', detail: 'Prepared for smooth setup and event timing.' },
];

const MENU_OCCASIONS = ['Corporate lunches', 'Weddings', 'Birthdays', 'Private parties'];
const MENU_BADGES = [
  { title: 'Fresh Ingredients', shortLabel: 'Fresh', icon: 'leaf' },
  { title: 'Hygienic Preparation', shortLabel: 'Hygienic', icon: 'shield' },
  { title: 'On-Time Delivery', shortLabel: 'On-Time', icon: 'clock' },
  { title: 'Custom Menus', shortLabel: 'Custom', icon: 'cutlery' },
];
const CUSTOM_PACKAGES = [
  'Corporate Events',
  'Birthdays & Celebrations',
  'Weddings & Engagements',
  'School & Institutions',
  'Private Parties',
];

function normalizeCategory(category = '') {
  return category.trim().toLowerCase();
}

function titleCaseCategory(category = '') {
  return category.replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeStatus(status = 'available') {
  return String(status || 'available').trim().toLowerCase();
}

function normalizeMenuItem(item = {}) {
  const category = item.category?.trim() || 'Signature Specials';
  const normalizedPrice = Number(item.price);
  const identifier = item.id || item._id;

  return {
    id: String(identifier),
    name: item.name?.trim() || 'Untitled dish',
    category,
    categoryKey: normalizeCategory(category),
    description: item.description?.trim() || 'Freshly prepared for your event.',
    price: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
    status: normalizeStatus(item.status),
    imageUrl: item.imageUrl || '',
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt.toISOString().slice(0, 10)
        : String(item.createdAt || new Date().toISOString().slice(0, 10)).slice(0, 10),
    featured: normalizeStatus(item.status) === 'featured',
  };
}

function sortSections(left, right) {
  const leftIndex = CATEGORY_ORDER.indexOf(left.categoryKey);
  const rightIndex = CATEGORY_ORDER.indexOf(right.categoryKey);

  if (leftIndex === -1 && rightIndex === -1) {
    return left.category.localeCompare(right.category);
  }

  if (leftIndex === -1) {
    return 1;
  }

  if (rightIndex === -1) {
    return -1;
  }

  return leftIndex - rightIndex;
}

function buildMenuSections(items) {
  return Object.values(
    items.reduce((groups, item) => {
      if (!groups[item.categoryKey]) {
        groups[item.categoryKey] = {
          id: item.categoryKey || 'signature-specials',
          category: item.category,
          categoryKey: item.categoryKey,
          title: titleCaseCategory(item.category),
          items: [],
        };
      }

      groups[item.categoryKey].items.push(item);
      return groups;
    }, {}),
  )
    .sort(sortSections)
    .map((section) => ({
      ...section,
      items: section.items.sort((left, right) => {
        if (left.price !== right.price) {
          return left.price - right.price;
        }

        return left.name.localeCompare(right.name);
      }),
    }));
}

function filterMenuItems(items, filters = {}) {
  const query = filters.q?.trim().toLowerCase();
  const category = normalizeCategory(filters.category || '');
  const status = filters.status ? normalizeStatus(filters.status) : '';

  return items.filter((item) => {
    if (category && item.categoryKey !== category) {
      return false;
    }

    if (status && item.status !== status) {
      return false;
    }

    if (query) {
      const haystack = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      return haystack.includes(query);
    }

    return true;
  });
}

function buildPublicMenuPayload(rawItems = [], filters = {}) {
  const normalizedItems = rawItems.map(normalizeMenuItem);
  const filteredItems = filterMenuItems(normalizedItems, filters);
  const sections = buildMenuSections(filteredItems);
  const featuredItems = filteredItems.filter((item) => item.featured).slice(0, 3);
  const showcaseItems = featuredItems.length > 0 ? featuredItems : filteredItems.slice(0, 3);
  const prices = filteredItems.map((item) => item.price).filter((price) => price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    hero: {
      eyebrow: 'Fresh Bites Menu',
      title: 'Our Menu',
      description:
        'Freshly prepared dishes for office lunches, celebrations, weddings, and private events.',
    },
    highlights: MENU_HIGHLIGHTS,
    badges: MENU_BADGES,
    occasions: MENU_OCCASIONS,
    customPackages: CUSTOM_PACKAGES,
    categories: sections.map((section) => ({
      id: section.id,
      title: section.title,
      itemCount: section.items.length,
    })),
    featuredItems: showcaseItems,
    sections,
    stats: {
      sectionCount: sections.length,
      itemCount: filteredItems.length,
      startingPrice: minPrice,
    },
    contact: {
      phone: '0710 500813',
      email: 'hello@freshbites.ke',
      website: 'www.freshbites.ke',
      footerHeading: 'Fresh. Tasty. Affordable.',
      footerTagline: 'Healthy catering for every occasion.',
    },
  };
}

module.exports = {
  CATEGORY_ORDER,
  buildPublicMenuPayload,
  filterMenuItems,
  normalizeMenuItem,
};
