const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [{model: Product}]
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

// CREATE category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name
    })
    res.status(200).json(category);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

//UPDATE category
router.put('/:id', async (req, res) => {
  try {
    const category= await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    res.status(200).json("Updated Sucessfully")
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  const category = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });
  
  res.json(category);
});

module.exports = router;
