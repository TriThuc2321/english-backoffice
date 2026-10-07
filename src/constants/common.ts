export const ROW_PER_PAGES = ['10', '20', '30', '50'];

export const ROW_PER_PAGE_OPTIONS = ROW_PER_PAGES.map((page) => ({
  key: page,
  label: page,
}));

export const DEFAULT_PARAM = { page: 1, take: 10 };
