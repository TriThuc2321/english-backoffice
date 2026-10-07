const UrlHelper = {
  convertUrlToId: (query?: string) => {
    if (!query) return '';

    return query.split('-').slice(-5).join('-');
  },
  convertTitleToSlug: (title: string) => {
    if (!title) return '';

    return title
      .toLowerCase()
      .normalize('NFD') // Normalize Unicode to split diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .replace(/đ/g, 'd') // Replace Vietnamese "đ"
      .replace(/Đ/g, 'D')
      .replace(/[?,:%'"“”\b`’‘&+()]/g, '') // Remove unwanted punctuation
      .replace(/[-\s]+/g, '-') // Replace spaces and consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens
  },
};

export default UrlHelper;
