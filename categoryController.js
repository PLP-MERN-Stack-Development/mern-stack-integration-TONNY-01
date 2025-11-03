const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const cat = new Category({ name, slug });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
