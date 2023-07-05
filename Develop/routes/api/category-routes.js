const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
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

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  Category.update(
    {
      id: req.params.id,
      location_name: req.params.location_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.json(updatedCategory);
});

router.delete('/:id', async (req, res) => {
  const deletedCategory = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });
  
  res.json(deletedBook);
});

module.exports = router;
