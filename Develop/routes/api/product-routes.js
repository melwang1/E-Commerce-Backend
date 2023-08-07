const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category },
      { model: Tag, through: ProductTag }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category },
      { model: Tag, through: ProductTag }]
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//UPDATE product
// router.put('/:id', (req, res) => {
//   const product = Product.update (req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       return ProductTag.findAll({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
      
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
//       if (req.body.tagIds) {

//         const newProductTags = req.body.tagIds

//           .filter((tag_id) => !productTagIds.includes(tag_id))
//           .map((tag_id) => {
//             return {
//               product_id: req.params.id,
//               tag_id,
//             };
//           });

//         var productTagsToRemove = productTags
//           .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//           .map(({ id }) => id);

//         return Promise.all([
//           ProductTag.destroy({ where: { id: productTagsToRemove }}),
//           ProductTag.bulkCreate(newProductTags),
//           res.json("Update Sucessful")
//         ]);
//       }

//     })
//     .then((updatedProductTags) => {
//       if (!updatedProductTags) {

//         res.json(updatedProductTags)
//       }
//     })

//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     })

// });

router.put('/:id', (req, res) => {
  // update product data

  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      if (req.body.tagIds) {

        const newProductTags = req.body.tagIds

          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        var productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove }}),
          ProductTag.bulkCreate(newProductTags),
          res.json("Update Sucess")
        ]);
      }

    })
    .then((updatedProductTags) => {
      if (!updatedProductTags) {


        res.json(updatedProductTags || "Updated Sucessfully")
      }
    })


    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    })

});

//DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deletedProduct) {
      res.status(404).json({ message: 'Deleted Successfully!' });
      return;
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
