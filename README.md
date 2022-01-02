# InstaDecoy

Environment setup for local Run

-   Clone The repo and install dependencies
-   create a .env in the parent folder -TemplateFollows
    ```
    EMAIL=
    EMAILPASSWORD=
    EMAILSERVICE=
    MONGODBURL=
    ```
    The bare minimum requrement is MONGODBURL There is no fallback if it is not provided
-   If you want to have Real Mails Then Set
    ```
    EMAILSERVICE=gmail
    EMAIL=your real gmail email
    EMAILPASSWORD= your real password
    ```
    Note:-Please see nodemailer gmail setup if this donot suceeds because Gmail settings had to be changed for a account to sent email using nodemailer
-   Else you can have it handelled by ethereal account
    and you can login to view emails at

    -   user: smwtrsmjipejx63c@ethereal.email
    -   pass: Kz5jEsRGrTJPjY7XfM

Api Documentation Can be found at

-   Email Service
    [View in Postman](https://www.postman.com/altimetry-operator-38048751/workspace/instadecoy/documentation/18846856-ed23335b-556f-4bc5-bfca-06f25245c128)
-   Main Service
    [View in Postman](https://www.postman.com/altimetry-operator-38048751/workspace/instadecoy/documentation/18846856-7b80e25b-56f8-46b7-b8d0-5ef8344885ff)
