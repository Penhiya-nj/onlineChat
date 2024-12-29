/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Auth module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  - email
 *              properties:
 *                  email:
 *                      type: string
 *          CheckOTP:
 *              type: object
 *              required:
 *                  - email
 *                  - code
 *              properties:
 *                  email:
 *                      type: string
 *                  code:
 *                      type: string
 *          login:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *          UpdateUser:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  mobile:
 *                      type: string
 *                  role:
 *                      type: string
 *          changePassword:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  otp:
 *                      type: string
 *                  password:
 *                      type: string
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     security: []
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Valid email address.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Strong password for the account.
 *                 example: "Passw0rd!"
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the user.
 *                   example: "12345"
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       400:
 *         description: Bad Request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email format."
 *       500:
 *         description: Internal Server Error - Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unexpected error occurred."
 */


/**
 * @swagger
 *
 *  /auth/send-otp:
 *      post:
 *          summary: login with OTP in this end-point
 *          security: []
 *          tags:
 *              - Auth
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/SendOTP"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/SendOTP"
 *          responses:
 *              200:
 *                  description: success
 *
 */

/**
 * @swagger
 *
 *  /auth/check-otp:
 *      post:
 *          summary: check OTP for Login User
 *          security: []
 *          tags:
 *              - Auth
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/CheckOTP"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/CheckOTP"
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /auth/login :
 *      post:
 *          summary: login
 *          security: []
 *          tags:
 *              - Auth
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/login"
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /auth/whoami:
 *      get:
 *          summary: get the user
 *          tags:
 *              - Auth
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /website:
 *      get:
 *          summary: get the user
 *          tags:
 *              - Auth
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /auth/change-password:
 *      get:
 *          summary: request a pass change 
 *          tags:
 *              - Auth
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /auth/reset-password:
 *      post:
 *          summary: change the user password 
 *          tags:
 *              - Auth
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/changePassword"
 *          responses:
 *              200:
 *                  description: success
 *
 */
/**
 * @swagger
 *
 *  /auth/logout:
 *      get:
 *          summary: logouts the user
 *          tags:
 *              - Auth
 *          responses:
 *              200:
 *                  description: success
 *
 */

/**
 * @swagger
 *
 *  /auth/user/{id}:
 *      patch:
 *          summary: Update user information
 *          tags:
 *              - Auth
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          requestBody:
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateUser"
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/UpdateUser"
 *          responses:
 *              200:
 *                  description: User updated successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  statuscode:
 *                                      type: integer
 *                                      example: 200
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          result:
 *                                              type: object
 *                                              description: The updated user object
 *                                          message:
 *                                              type: string
 *                                              example: edited
 */

/**
 * @swagger
 *
 *  /auth/user/{id}:
 *      delete:
 *          summary: Delete a user by ID
 *          tags:
 *              - Auth
 *          security:
 *              - BearerAuth: []
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: User deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  statuscode:
 *                                      type: integer
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      example: User deleted successfully
 *              403:
 *                  description: Forbidden - Only superAdmins can delete users
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  statuscode:
 *                                      type: integer
 *                                      example: 403
 *                                  message:
 *                                      type: string
 *                                      example: Forbidden
 */

/**
 * @swagger
 *
 *  /auth/user:
 *      get:
 *          summary: Get all users
 *          tags:
 *              - Auth
 *          security:
 *              - BearerAuth: []
 *          responses:
 *              200:
 *                  description: A list of users
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  statuscode:
 *                                      type: integer
 *                                      example: 200
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                              email:
 *                                                  type: string
 *                                              role:
 *                                                  type: string
 *              403:
 *                  description: Forbidden - Only superAdmins and admins can access this route
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  statuscode:
 *                                      type: integer
 *                                      example: 403
 *                                  message:
 *                                      type: string
 *                                      example: Forbidden
 */
