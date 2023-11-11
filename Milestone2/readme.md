
**1. Project team information**

  

- Zelda Lu (wlu27).

  

  

- Deci Horine (djhorine).

  

  

- Pham Thanh Nam (pthanhn).

  

**2. Project Title**

  

  

Our web-application is called ‘Wolfnotes’.

  

**3. Current progress**

  
  

Done:

- API endpoints (Note management, Note data, Authentication, Tags)

- Login page.
- Note editor.
- Home page.
  

Not done:

- API endpoints (dictionary, shorthand) and front-end integration.

- Home, note editor, browse tags, user agreement, user settings.

  

**4. Pages status**

| Pages | Status | Wireframe |

|---------|--------|------------|

| Login | 95% | |

| Register | 90% | |

| Home | 80% |[Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Proposal/Wireframes/home.png?raw=true)|

| Note editor | 70% | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Proposal/Wireframes/notes.png) |

| Browse tags | 0% | |

| Dictionary| 25% | |

|User settings & Shorthands |0%|

  

**5. API Endpoints**

| Method | Route | Description |

|--------|---------------|--------------------------------------------------------|

| POST | /api/auth/register | Register a new user |

| POST | /api/auth/signin | User sign-in |

|POST /api/auth/signout| User sign-out |

|GET|/api/auth/user/|Get user information for the current user |

|POST/api/auth/avatar|A user profile setting |

|GET/api/auth/avatar|Getting the profile picture from the user |


|POST|/api/notes/|Create a new note|

|GET|/api/notes/all|Get a list of all notes|

|GET|/api/notes/suggested|Get a list of suggested notes

|GET|/api/notes/:noteID|Get a specific note by its ID|

|PUT|/api/notes/:noteID|Update an existing note|

|DELETE|/api/notes/:noteID|Delete a specific note by its ID|


|GET /api/tags|Get all tags for the logged-in user|

|POST /api/tags|Create a new tag for the logged-in user|

|DELETE /api/tags/:tagID|Delete a tag that belongs to the logged-in user|

|POST /api/data/:noteID/chunk|Send a chunk (1 slide) of note data - main endpoint for saving notes|

|GET /api/data/:noteID/:slideNumber/chunks|Retrieve the entire set of chunks for a specific note - used for viewing a note or downloading a note|

|GET /api/data/:noteID/|Get the image for a specific slide by a specific size (one of thumbnail, full)|

**6. ER Diagram**
![ER diagram of relationship schema](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Milestone2/Diagram.png)  
**7. Authorization and authentication**
The "TokenMiddleware" is applied as middleware to routes that require authentication, such as the "/" and "/:userID/current" routes. The generateToken function is used to create a JWT when a user is registered or logs in. The generated token is sent to the client for future requests. The userDao.addUser funtion is called to the user to the system. So if successful, a JWT is generated using "generateToken" and the response includes the user data and generated token. Data is being stored and managed by the userDao module and it is interacts with our database to store and retrieve user information. The TokenMiddleware is used to ensure that routes require authentication are only accessible with a valid token and that is allowing users to access what they are allowed to access.

**8. Contributions**

| Team member | Team contributions |

|----:|-------------------------|

| **Zelda Lu** | - Created authentication router and userDAO <br />- Updated the register and login pages. <br />- Created the token middleware<br /> - Created and populated the database<br />|

| **Deci Horine** | - Created all of the updated tag endpoints<br />- Developed the home page.<br />- Implemented the connection provider, noteDAO, note router, tagDAO, and tag router<br /> - Created the common javascripts.<br />|

| **Nam Pham** | - Created the dataDAO and data router.<br />- Updated the note editor. <br /> - Created the dictionary page. <br>
