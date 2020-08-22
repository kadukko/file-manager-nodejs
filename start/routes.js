"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.get("/files", "FileController.index");
Route.post("/files", "FileController.store");
Route.post("/files/delete", "FileController.destroy");
Route.post("/files/move", "FileController.move");
Route.post("/files/copy", "FileController.copy");
Route.post("/files/newfolder", "FileController.newfolder");
