const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');

// Setup route
const router = Router({prefix: '/recipe_website/v1/users'});

// Setup authentication and validation for routes
router.get('/', getAll);
router.post('/', bodyParser(), createUser);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateUser);
router.del('/:id([0-9]{1,})', deleteUser);


async function getAll(ctx) {
    const result = await model.getAll();
    if (result.length) {
        ctx.body = result;
        ctx.status = 200;
        console.log("Successfully accessed all users");
    } else {
        console.error(`No users`);
        ctx.body = {Message: `No users`};
        ctx.status = 404;
  }
}


async function getById(ctx) {
  // Check if id inputted exists
  const id = ctx.params.id;
  const result = await model.getById(id);
  // If it does, check permissions
  if (result.length) {
    const data = result[0]
    ctx.status = 200;
    ctx.body = data;
    console.log(`Successfully received user ${id}`);
  } else {
    console.error(`Error getById for user ${id}`);
    ctx.body = {Message: `No user`};
    ctx.status = 404;
  }
}


async function createUser(ctx) {
  // Check if body inputted can be added
  const body = ctx.request.body;
  const result = await model.add(body);
  // If it can, return success, else failure
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true};
    console.log("User successfully added");
  } else {
    console.error(`Error creating user`);
    ctx.body = {ID: id, created: 'false'};
    ctx.status = 404;
  }
}


async function updateUser(ctx) {
  // Check if the body inputted can be updated
  let id = ctx.params.id;
  let result = await model.getById(id);
  // If it can be updated, return success, else failure
  if (result.length) {    
    let newData = ctx.request.body;
    Object.assign(newData, {ID: id});
    result = await model.update(newData);
    if (result.affectedRows) {
    ctx.body = {ID: id, updated: true};
    console.log(`User ${id} successfully updated`);
    ctx.status = 200;
    } else {
    console.error(`Couldn't update user ${id} - result returned: ${result}`);
    ctx.body = {ID: id, updated: false};
    ctx.status = 404;
    }
  }
}

/**
 * A function which deletes a user
 * @param {object} ctx - The Koa request/response context object
 * @throws {Error} an error is thrown when a user can't be deleted
 */
async function deleteUser(ctx) {
  // Check if body inputted can be deleted
  const id = ctx.params.id;
  let result = await model.getById(id);
  // If user was deleted, return success, else failure
  if (result.length) {
    const data = result[0];
    const permission = can.delete(ctx.state.user, data);
    // If permissions not granted, return failure, else success
    if (!permission.granted) {
      console.error(`Forbidden access for user ${id}`)
      ctx.status = 403;
    } else {
      result = await model.delById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true}
        console.log(`User ${id} deleted successfully`);     
        ctx.status = 200;
        }
      }
    } else {
      console.error(`No user with id ${id} to delete`);
      ctx.body = {ID: id, deleted: false};
      ctx.status = 404;
    }
  }

module.exports = router;
