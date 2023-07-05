const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
  const category = await Category.findAll({
    include: [{ model: Product}]
  });
  res.status(200).json(category);
  } catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id', async (req, res) => {
  try{
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]
    });

    if (!category) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  const category = Category.create ({category_name:req.body.category_name})
  res.status(200).json(category)
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
