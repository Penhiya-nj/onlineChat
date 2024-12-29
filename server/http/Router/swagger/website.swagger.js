/**
 * @swagger
 * tags:
 *  name: Website
 *  description: Website management module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateWebsite:
 *              type: object
 *              required:
 *                  - name
 *                  - domain
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Name of the website
 *                      example: "Example Website"
 *                  domain:
 *                      type: string
 *                      description: domain of the website
 *                      example: "www.exampleMarket.com" 
 *                  email:
 *                      type: string
 *                      description: email of the support
 *                      example: "user@example.com"
 *          UpdateWebsite:
 *              type: object
 *              required:
 *                  - name
 *                  - domain
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Updated name of the website
 *                      example: "Updated Website Name"
 *                  domain:
 *                      type: string
 *                      description: domain of the website
 *                      example: "www.exampleMarket.com" 
 *                  email:
 *                      type: string
 *                      description: email of the support
 *                      example: "user@example.com"
 *          WebsiteOperator:
 *              type: object
 *              required:
 *                  - websiteId
 *                  - operatorId
 *              properties:
 *                  websiteId:
 *                      type: string
 *                      description: ID of the website
 *                      example: "123"
 *                  operatorId:
 *                      type: string
 *                      description: ID of the operator
 *                      example: "456"
 */

/**
 * @swagger
 * /website:
 *   post:
 *     summary: Create a new website
 *     tags:
 *       - Website
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateWebsite"
 *     responses:
 *       201:
 *         description: Website created successfully.
 *       400:
 *         description: Invalid input.
 */

/**
 * @swagger
 * /website:
 *   get:
 *     summary: Get all websites
 *     tags:
 *       - Website
 *     responses:
 *       200:
 *         description: A list of websites.
 */

/**
 * @swagger
 * /website/{id}:
 *   get:
 *     summary: Get a specific website by ID
 *     tags:
 *       - Website
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Website ID
 *     responses:
 *       200:
 *         description: Website details retrieved successfully.
 *       404:
 *         description: Website not found.
 */

/**
 * @swagger
 * /website/{id}:
 *   patch:
 *     summary: Edit a website
 *     tags:
 *       - Website
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Website ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateWebsite"
 *     responses:
 *       200:
 *         description: Website updated successfully.
 *       400:
 *         description: Invalid input.
 */

/**
 * @swagger
 * /website/{id}:
 *   delete:
 *     summary: delete a specific website by ID
 *     tags:
 *       - Website
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Website ID
 *     responses:
 *       200:
 *         description: Website deleted successfully.
 *       404:
 *         description: Website not found.
 */
/**
 * @swagger
 * /website/operator:
 *   post:
 *     summary: Add an operator to a website
 *     tags:
 *       - Website
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WebsiteOperator"
 *     responses:
 *       200:
 *         description: Operator added successfully.
 *       400:
 *         description: Invalid input.
 */

/**
 * @swagger
 * /website/operator:
 *   delete:
 *     summary: Remove an operator from a website
 *     tags:
 *       - Website
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WebsiteOperator"
 *     responses:
 *       200:
 *         description: Operator removed successfully.
 *       404:
 *         description: Operator or website not found.
 */
