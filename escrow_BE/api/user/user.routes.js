const router = require("express").Router();
const { ENDPOINTS } = require("../common/members");
const { registerUser, logoutUser, loginUser, verifyUser} = require("./user.handlers");
const {auth} = require("./../middleware/auth.middleware");

/**
 * @apiGroup User
 * @apiName Register user
 * @api {POST} /user register user
 * @apiDescription register specific user
 * @apiSampleRequest /user
 * @apiVersion 0.1.0
 * @apiBody {string} fullName user's full name
 * @apiBody {string} emailAddress user's email address
 * @apiBody {string} password user's password
 * @apiSuccessExample {JSON} Success:
 * {
 *     "code": 200,
 *     "status": true,
 *     "message": "User created"
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post('/', registerUser);

/**
 * @apiGroup User
 * @apiName Login user
 * @api {POST} /user/login login user
 * @apiDescription login specific user
 * @apiSampleRequest /user/login
 * @apiVersion 0.1.0
 * @apiBody {string} emailAddress user's email address
 * @apiBody {string} password user's password
 * @apiSuccessExample {JSON} Success:
 * {
 *  {
 *      "code": 200,
 *      "status": true,
 *      "message": "User login success",
 *      "data": {
 *          "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0MDFhMTkwLTM1YjItMTFlZC1hYTc4LTMxNjE3MTk0YjI0MSIsImZ1bGxOYW1lIjoiUGFydGgiLCJlbWFpbEFkZHJlc3MiOiJjaG9rc2hpcGFydGgxM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6ImI4YWQwOGEzYTU0N2UzNTgyOWI4MjFiNzUzNzAzMDFkZDhjNGIwNmJkZDc3NzFmOWI1NDFhNzU5MTQwNjg3MTgiLCJjcmVhdGVkQXQiOiIyMDIyLTA5LTE2VDExOjI4OjM1LjAwMFoiLCJpYXQiOjE2NjMzMjc3NTF9.eci5Mwao3OV1acpic3nX8V1QDWg5RFkS0L-AFNkfNLP4Ptf4Heg-yjaO4nTJeWxs3x5sOT-OzldouRn1yAPvSsCOuXsoE_cCWAacBwtSAPC8zSa-thkbMK2vsyUhqjBk1FGZ5T1P0hjBHuWJL--xtGCVwkjZZOfmvcXMUY7hCLFDmJxV7mvgsgZdpl8HGBvszh8xKnit7rYOwj1RVv-1Z4dAKCQK3xJ-yz4Dd2KOjVNLqAuHw_xiZbpsV_emlG8in6f5-SRrI5R6MzV-OE6XK0X0lilZ99BX9X0V6w3w7fF00Y9iEc5ARerdFlCeWv9NQhg0JNVlvd5kJRL15GIbbw",
 *          "userInfo": {
 *              "id": "b401a190-35b2-11ed-aa78-31617194b241",
 *              "fullName": "Parth",
 *              "emailAddress": "chokshiparth13@gmail.com",
 *              "password": "b8ad08a3a547e35829b821b75370301dd8c4b06bdd7771f9b541a75914068718",
 *              "createdAt": "2022-09-16T11:28:35.000Z"
 *          }
 *      }
 *  }
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post(ENDPOINTS.LOGIN, loginUser);

/**
 * @apiGroup User
 * @apiName Verify user
 * @api {POST} /user/verify verify user
 * @apiDescription verify specific user
 * @apiSampleRequest /user/verify
 * @apiVersion 0.1.0
 * @apiBody {string} emailAddress user's email address
 * @apiBody {string} passcode user's password
 * @apiSuccessExample {JSON} Success:
 * {
 *     "code": 200,
 *     "status": true,
 *     "message": "User verified"
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post(ENDPOINTS.VERIFY, verifyUser);

/**
 * @apiGroup User
 * @apiName logout user
 * @api {POST} /user/logout logout user
 * @apiDescription logout specific user
 * @apiHeader {string} Authorization add Bearer token
 * @apiSampleRequest /user/logout
 * @apiVersion 0.1.0
 * @apiSuccessExample {JSON} Success:
 * {
 *     "code": 200,
 *     "status": true,
 *     "message": "User logged out"
 * }
 * @apiErrorExample {JSON} Error:
 * {
 *  "code": number,
 *  "status": false,
 *  "message": string,
 *  "data": { ... }
 * }
 */
router.post(ENDPOINTS.LOGOUT, [auth],logoutUser);
module.exports = router;