const db = require('../../data/db-config.js');

function find() {
 return db('users').select('user_id', 'username' , 'role_id');

  /**
    You will need to join two tables.
    Resolves to an ARRAY with all users.

    [
      {
        "user_id": 1,
        "username": "mohamed",
        "role_name": "admin"
      },
      {
        "user_id": 2,
        "username": "hamdi",
        "role_name": "instructor"
      }
    ]
   */


}

function findBy(filter) {
  return db('users')
  .where(filter);
  
  /**
    You will need to join two tables.
    Resolves to an ARRAY with all users that match the filter condition.

    [
      {
        "user_id": 1,
        "username": "mohamed",
        "password": "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq",
        "role_name": "admin",
      }
    ]
   */
}

function findById(user_id) {
  return db('users')
  .where({ user_id })
  .first()
  /**
    You will need to join two tables.
    Resolves to the user with the given user_id.

    {
      "user_id": 2,
      "username": "hamdi",
      "role_name": "instructor"
    }
   */
 
}

/**
  Creating a user requires a single insert (into users) if the role record with the given
  role_name already exists in the db, or two inserts (into roles and then into users)
  if the given role_name does not exist yet.

  When an operation like creating a user involves inserts to several tables,
  we want the operation to succeed or fail as a whole. It would not do to
  insert a new role record and then have the insertion of the user fail.

  In situations like these we use transactions: if anything inside the transaction
  fails, all the database changes in it are rolled back.

  {
    "user_id": 7,
    "username": "anna",
    "role_name": "team lead"
  }
 */
async function add(user) { 
  // done for you
  const [id] = await db('users').insert(user)
  console.log(user)
  return findById(id)
 
}

module.exports = {
  add,
  find,
  findBy,
  findById,
};
