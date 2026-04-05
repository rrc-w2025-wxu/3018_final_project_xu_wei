# Backend component implementation and integration plan

## Project Overview
This is an e-commerce backend system. This system will implement 
the main e-commerce business processes, including creating products, 
displaying products, querying products, deleting products, creating 
orders, placing orders, making payments and user management.

Based on the characteristics of the e-commerce system, I have chosen 
to integrate the following three backend components:

### 4. In-Memory Caching for Firestore
Its function is to cache frequently accessed data in memory, such 
as product lists, categories, and user shopping carts, thereby speeding 
up data retrieval, reducing the number of Firestore read requests, and 
saving costs.

 - Install the node-cache caching library.

 - Add frequently accessed product data or order lists to the cache.

 - When a user queries a product, the system first checks the cache; if 
 the product is not found in the cache, it then queries the database.

### 6. Analytics Middleware for API Usage
It tracks API access volume, request sources, and response times. It can 
help identify popular products and APIs, monitor abnormal traffic to prevent 
abuse, and provide data support for subsequent database or API optimization.

It also allows users to analyze e-commerce user behavior (e.g., which 
products have high traffic) and determine which APIs need optimization.

 - Create middleware.
    - Record the start time of each request.
    - Record the API path, method, status code, and execution time after the
response is completed.
    - Option to write to a log file or database (such as Firestore's api_logs 
collection).

 - Apply globally.
    - Use app.use(apiUsageLogger) before routes in the Express app.

### 8. Deployment
It can deploy my e-commerce backend online. Users can access my 
application in real-world traffic to test performance.

 - Prepare the project
    - Add the start script to package.json.
    - Ensure the .env file contains Firebase environment variables.

 - Choose a platform
    - Render.com or Vercel.
    - Configure environment variables in the platform's management interface.

 - Deployment process
    - Push code to GitHub.
    - Create a new Node.js service in Render/Vercel and bind the repository
    - Set up build & start commands.
    - Obtain the public API URL after deployment.