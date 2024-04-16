const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/recipes');

// Setup route
const router = Router({prefix: '/recipe_website/v1/recipes'});

// Setup authentication and validation for routes
router.get('/', getAllRecipes);
router.post('/', bodyParser(), addRecipes);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateRecipes);
router.del('/:id([0-9]{1,})', deleteRecipes);


async function getAllRecipes(ctx) {
  // Checks if there are any recipes
  const result = await model.getAll();
  // If there are, return success, else failure
  if (result.length) {
    ctx.body = result;
    ctx.status = 200;
    console.log(`Successfully accessed all recipes`);
  } else {
    console.error(`No recipes`);
    ctx.body = {Message: `No recipes`};
    ctx.status = 404;
  }
}


async function getById(ctx) {
  // Checks if the id inputted exists
  const id = ctx.params.id;
  const result = await model.getById(id);
  // If it does, return success, else failure
  if (result.length) {
    const data = result[0];
    ctx.status = 200;
    ctx.body = data;
  } else {
    ctx.status = 404;
    ctx.body = {ID: id, exists: false};
  }
}


async function addRecipes(ctx) {
  // Checks if body inputted can be added
  const body = ctx.request.body;
  const result = await model.add(body);
  // If it can, return success, else failure
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true};
  } else {
    ctx.status = 400;
    ctx.body = {ID: id, created: false};
  }
}


async function updateRecipes(ctx) {
  // Checks if the id inputted from the ctx.body exists
  const id = ctx.params.id;
  let result = await model.getById(id);
  // If it does, check for permission
  if (result.length) {
    const newData = ctx.request.body;
    Object.assign(newData, {ID: id});
    result = await model.update(newData);
    if (result.affectedRows) {
      ctx.body = {ID: id, updated: true};
    } else {
      ctx.status = 404;
      ctx.body = {ID: id, updated: false};
    }
  }
}


async function deleteRecipes(ctx) {
  // Checks if the id inputted exists
  const id = ctx.params.id;
  let result = await model.getById(id);
  // If it does, check for permissions
  if (result.length) {
    result = await model.delById(id);
    if (result.affectedRows) {
      ctx.body = {ID: id, deleted: true}
    } else {
      ctx.status = 404;
      ctx.body = {ID: id, deleted: false}
    }    
  }
}

module.exports = router;
