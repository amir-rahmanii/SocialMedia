
# Social media application project

If you need the backend of a project like Instagram, this project is for you

# About The Project

This project includes many features such as Instagram for sharing images in the form of posts. In this project, features such as adding posts, saving posts, likes, comments, post management tools are used by the admin.
This project is developed using NodeJS and ExpressJS and requires MongoDB database.




## Built With
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)


[![Express js](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)](https://expressjs.com/)

[![momgodb](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white)](https://www.mongodb.com/)

[![Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?style=for-the-badge&logo=Swagger&logoColor=black)](https://swagger.io/)
## Features

- API base
- Developed with REST API
- Register and Login
- Update password
- Forget password (OTP Email)
- Ban The User
- Show user information
- Authentication (Access token and refresh token JWT)
- Create the post 
- Image uploader
- Like and dislike the post
- Save and unsave the post
- Add the comment 
- Edit the post
- Delete the post
- Delete the comment
- Get all posts
- Show all user posts
- Search the posts 
- Show the post details
- Show the save posts


## Prerequisites
- [mongodb](https://www.mongodb.com/)
- [express js](https://expressjs.com/)
- [node js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
- [git](https://git-scm.com/)

## Environment Variables

Because this is a public project, it doesn't matter if this part is available to everyone

To run this project, you will need to add the following environment variables to your .env file

`PORT`= 4002

`MONGO_URL`=mongodb://127.0.0.1:27017/store

`JWT_SECRET` = DFNGHRN647NJHV5463VXE

`REFRESH_JWT_EXP` = 30

`NODE_ENV` = "development"


## Run Locally

Clone the project

```bash
  git clone https://github.com/mohammadEbrahimzadeh/backend-social-media
```

Go to the project directory

```bash
  cd backend-social-media
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## API document
To access the API document after running the project, enter the following address in your browser
```
http://localhost:4002/api-doc
```
