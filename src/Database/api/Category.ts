import Category from "../models/Category";

export default {
  async getCategories() {
    const categories = await Category.find();
    const total = categories.length;

    return {
      total,
      categories,
    };
  },

  async addCategory(categoryDetails: any) {

    return Category.create(
      categoryDetails
    );
  },

  async seedCategory() {
    const categories = [
      { name: 'fashion' },
      { name: 'sneakers' },
      { name: 'electronics' },
      { name: 'mobile phones' }
    ];

    return Promise.all(categories.map(async (category) => {
      await this.addCategory(category);

      return `added '${category.name}' to category collection`;
    }));
  }
};
