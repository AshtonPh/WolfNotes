
**Group V: Final Project**

  

- Zelda Lu (wlu27).
 


- Deci Horine (djhorine).
 


- Pham Thanh Nam (pthanhn).

  

**What Works and what doesn't work**
  
Users are able to register as an authenticated user and have their information stored in the database. Once the user is registered and authenticated, they are able to sign in to the app. The home page of the app is fully working, meaning users are allowed to create new notes and browse all notes they have created in the past. They are able to use the tag feature to categorize notes on the home page. Users are also able to edit notes on the home screen. While using the editing notes feature, users are able to edit and take notes, changing the fonts and styles of their notes alongside loaded slides. The offline feature is able to allow users to download notes to view notes offline.

  

**Authentication and Authorization**

The "TokenMiddleware" is applied as middleware to routes that require authentication, such as the "/" and "/:userID/current" routes. The generateToken function is used to create a JWT when a user is registered or logs in. The generated token is sent to the client for future requests. The userDao.addUser funtion is called to the user to the system. So if successful, a JWT is generated using "generateToken" and the response includes the user data and generated token. Data is being stored and managed by the userDao module and it is interacts with our database to store and retrieve user information. The TokenMiddleware is used to ensure that routes require authentication are only accessible with a valid token and that is allowing users to access what they are allowed to access.


**Pages**

| Pages | Navigation | Functionality |
|-------|--------|-----------|
| Login | Users are allow to sign in  |Allows users to log in to the app as an authenticated user |
| Register | This can be access through login page and will return to homepage once user has register an account |Allows Users to create account wth a user name and password |
| Home | This page can be accessed through user sucessfully log in as an user or register as an user| Allows users to browse notes they have created in the past and create new notes and upload slides. The users can also view their notes using tags.User can navgative to offline functionailty through this page |
| Tag manager | User can access this page by having access to the home page | Users are able to edit existing tags and add more tags |
| Editor | User are able to access this page through the home page | The editor page allow users to take notes and edit notes alongside the slides they have upload it through the home page |
| Offline list | When user is offline, they will be able to acess to this page | Allows users to view a list of downloaded notes |
| Offline viewer| This page can be access if the user is offline | This page allows users to view doanloaded notes |



**Cashing Strategy**

For the production server, we use cache-first fetch requests. Whenever a request is made, our application checks the cache. If the request is not in the cache, it gets cached after a request. This allows us to utilize the cache for faster page loading times.

For the development server, we use a different service worker that does not check the cache for a match. This is because Vite performs live updates on these files and attempting to cache them caused the files to fail to load.


**API Endpoints**

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/signin | User sign-in |
| POST | /api/auth/signout | User sign-out |
| GET | /api/auth/user/ | Get user information for the current user |
| POST | /api/notes/ | Create a new note |
| GET | /api/notes/all | Get a list of all notes |
| GET | /api/notes/suggested | Get a list of suggested notes |
| GET | /api/notes/:noteID | Get a specific note by its ID |
| PUT | /api/notes/:noteID | Update an existing note |
| DELETE | /api/notes/:noteID | Delete a specific note by its ID |
| GET | /api/tags | Get all tags for the logged-in user |
| POST | /api/tags | Create a new tag for the logged-in user |
| DELETE | /api/tags/:tagID | Delete a tag that belongs to the logged-in user |
| POST | /api/data/:noteID/chunk | Send a chunk (1 slide) of note data - main endpoint for saving notes |
| GET | /api/data/:noteID/:slideNumber/chunks | Retrieve the entire set of chunks for a specific note - used for viewing a note or downloading a note |
| GET | /api/data/:noteID/ | Get the image for a specific slide by a specific size (one of thumbnail, full) |


**ER Diagram**


![ER diagram of relationship schema](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Milestone2/Diagram.png) 




**Contributions**

| Milestone 1| Team member | Team contributions |
|------------|-------------|--------------------|
|  **Zelda Lu**  | -   Created all the signin and register API endpoints. <br />-   Created the register and login pages. |
|  **Deci Horine**  | -   Created all the note data API endpoints.<br />-   Created the home page.<br />- Applied the Vite frontend tool to the project.<br />    |
|  **Nam Pham** | -   Created all the note management API endpoints.<br />-   Created the note editor page.<br />

| Milestone 2| Team member | Team contributions |
|------------|-------------|--------------------|
| **Zelda Lu** | - Created authentication router and userDAO <br />- Updated the register and login pages. <br />- Created the token middleware<br /> - Created and populated the database<br />|
| **Deci Horine** | - Created all of the updated tag endpoints<br />- Developed the home page.<br />- Implemented the connection provider, noteDAO, note router, tagDAO, and tag router<br /> - Created the common javascripts.<br />|
| **Nam Pham** | - Created the dataDAO and data router.<br />- Updated the note editor. <br /> - Created the dictionary page. <br />|


| Final Project | Team member | Team contributions |
|---------------|-------------|--------------------|
| **Zelda Lu** | - Make sure all register and login endpoints are fully functional<br />- Updated token middleware and authenticate users correctly  <br />- Make sure new users can be registered and uploaded it in the database<br /> - Changed and updated the database.<br />|
| **Deci Horine** | - created javascript modules for interacting with notes, interacting with tags, and making API requests<br />- created logo<br />- added offline functionality, service workers, and PWA installability.<br />|
| **Nam Pham** | - Make sure all notes endpoints are working<br />- Make sure note editor can populate slides images and note data <br /> - Created the autosave feature to make sure users can update the progress on notetaking. <br />|

