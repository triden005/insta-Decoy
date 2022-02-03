# InstaDecoy

Environment setup for local Run

-   Clone The repo and install dependencies

    ```
    git clone <ulr of repo>
    cd insta-Decoy
    yarn install
    ```

    for running the email service in dev
    `yarn dev_email`
    and the main service
    `yarn dev`

    will add concurrently some day :relieved:

-   create a .env in the parent folder -Template .env.development

    The bare minimum requrement is MONGODBURL
    And Cloudinary Credentails that are
    CLOUDNAME=
    CLOUDAPIKEY=
    CLOUDAPISECRET=
    These are used in only upload routes

-   If you want to have Real Mails Then Set

    ```
    EMAIL= //email
    EMAILKEY= // email password or authtoken
    EMAILTRANSPORTER= // gmail or Ethereal


    ```

    Note:-Please see nodemailer gmail setup if this donot succeeds because Gmail settings had to be changed for a account to sent email using nodemailer

-   Else you can have it handelled by ethereal account
    and you can login to view emails at

    -   user: smwtrsmjipejx63c@ethereal.email
    -   pass: Kz5jEsRGrTJPjY7XfM

Api Documentation Can be found at

-   [Email Service](https://documenter.getpostman.com/view/18846856/UVRHjPqi)
-   [User Service](https://documenter.getpostman.com/view/18846856/UVRHjPqm)
-   [Friends Collection](https://documenter.getpostman.com/view/18846856/UVXnFtWv)
-   [Friends2 Collection](https://documenter.getpostman.com/view/18846856/UVXnFtWw)
-   [Image Upload Service](https://documenter.getpostman.com/view/18846856/UVXnFtWx)
-   [Comment Service](https://documenter.getpostman.com/view/18846856/UVeAvpAN)
-   [Posts Service](https://documenter.getpostman.com/view/18846856/UVeAvpAQ)

-   [Public workspace Link](https://www.postman.com/altimetry-operator-38048751/workspace/instadecoy)

## Technologies Used

-   Node Js Express
-   Cloudinary for file upload
-   Multer
-   morgan
-   Nodemailer
-   validator
