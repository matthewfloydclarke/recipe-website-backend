const Router = require(`koa-router`);
const bodyParser = require(`koa-bodyparser`);
const model = require(`../models/users`);

// Setup route
const router = Router({prefix: `/recipe_website/v1/users`});

// Setup authentication and validation for routes
router.get(`/`, getAll);
router.post(`/`, bodyParser(), createUser);
router.get(`/:id([0-9]{1,})`, getById);
router.put(`/:id([0-9]{1,})`, bodyParser(), updateUser);
router.del(`/:id([0-9]{1,})`, deleteUser);
router.del(`/`, deleteAllUsers);


// Gets all users
async function getAll(ctx) {
  try {
      const result = await model.getAll();
      if (result.length) {
          ctx.body = result;
          ctx.status = 200;
          console.log(`Successfully accessed all users`);
      } else {
          console.error(`No users`);
          ctx.body = {message: `No users`};
          ctx.status = 404;
    }
  } catch (error) {
    console.error(`Error getting all users: ${error}`);
    ctx.status = 500;
    ctx.body = {message: `Error `}
  }
}

// Gets user from specific ID
async function getById(ctx) {
  try {
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
      ctx.body = {message: `No user`};
      ctx.status = 404;
    }
  } catch (error) {
    console.error(`Error getting user by ID: ${error}`);
    ctx.status = 500;
    ctx.body = {message: `Error getting user by ID`}
  }
}

// Creates user
async function createUser(ctx) {
  try {
    // Check if body inputted can be added
    const body = ctx.request.body;
    const result = await model.add(body);
    // If it can, return success
    if (result.affectedRows) {
      const id = result.insertId;
      ctx.status = 201;
      ctx.body = { ID: id, created: true };
      console.log(`User successfully added`);
    } else {
      // Handle unexpected case where no rows were affected
      console.error(`Unexpected result from database operation`);
      ctx.body = { ID: null, created: false };
      ctx.status = 500;
    }
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    if (error.code === `ER_DUP_ENTRY`) {
      // Duplicate entry
      ctx.status = 409;
      ctx.body = { message: `Username or email already exists`, created: false };
    } else {
      // Internal Server Error
      ctx.status = 500;
      ctx.body = { message: `An unexpected error occurred`, created: false };
    }
  }
}

// Updates user
async function updateUser(ctx) {
  try {
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
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    ctx.status = 500;
    ctx.body = {message: `Error updating user`, updated: false};
  }
}

// Deletes user
async function deleteUser(ctx) {
  try {
    // Check if body inputted can be deleted
    const id = ctx.params.id;
    let result = await model.getById(id);
    // If user was deleted, return success, else failure
    if (result.length) {
      const data = result[0];
        result = await model.delById(id);
        if (result.affectedRows) {
          ctx.body = {ID: id, deleted: true}
          console.log(`User ${id} deleted successfully`);     
          ctx.status = 200;
          }
      } else {
        console.error(`No user with id ${id} to delete`);
        ctx.body = {ID: id, deleted: false};
        ctx.status = 404;
      }
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
      ctx.status = 500;
      ctx.body = {message: `Error deleting user`, deleted: false};
    }
  }

// Deletes all users
async function deleteAllUsers(ctx) {
  try {
    result = await model.delAllUsers();
    if (result.affectedRows) {
      ctx.body = {deleted: true}
      console.log(`Users deleted successfully`);     
      ctx.status = 200;
      }
    } catch (error) {
      console.error(`Error deleting all users: ${error}`);
      ctx.status = 500;
      ctx.body = {message: `Error deleting all users`, deleted: false};
    }
  } 

// Exports router
module.exports = router;
