
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
| Home | This page can be accessed through user sucessfully log in as an user or register as an user| Allows users to browse notes they have created in the past and create new notes and upload slides. The users can also nUser can navgative to offline functionailty through this page |
| Tag manager | 70% | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Proposal/Wireframes/notes.png) |
| Editor | 0% | |
| Offline list | 25% | |
| Offline viewer| 0% | |



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
| POST | /api/auth/avatar | A user profile setting |
| GET | /api/auth/avatar | Getting the profile picture from the user |
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

| Team member | Team contributions |
|-------------|--------------------|
| **Zelda Lu** | - Created authentication router and userDAO <br />- Updated the register and login pages. <br />- Created the token middleware<br /> - Created and populated the database<br />|
| **Deci Horine** | - Created all of the updated tag endpoints<br />- Developed the home page.<br />- Implemented the connection provider, noteDAO, note router, tagDAO, and tag router<br /> - Created the common javascripts.<br />|
| **Nam Pham** | - Created the dataDAO and data router.<br />- Updated the note editor. <br /> - Created the dictionary page. <br />|

