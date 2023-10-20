**1. Project team information**

- Zelda Lu (wlu27).

  

- Deci Horine (djhorine).

  

- Pham Thanh Nam (pthanhn).

**2. Project Title**

  

Our web-application is called ‘Wolfnotes’.

**3. Current progress**


Done:

 - Mock API endpoints.
 - Register and login pages.

Not done:
- API endpoints and front-end integration.
- Home, note editor, browse tags, user agreement, user settings.

**4. Pages status**
| Pages   | Status | Wireframe  |
|---------|--------|------------|
| Login   |  90%  |   |
| Register |  90%   |            |
| Home   |  65%  |[Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Proposal/Wireframes/home.png?raw=true)|
| Note editor |   50%   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupV/blob/main/Proposal/Wireframes/notes.png)  |
| Browse tags | 0%    |            |
| User agreement|0%     |  |
|User settings|0%|

**5. API Endpoints**
| Method | Route         | Description                                            |
|--------|---------------|--------------------------------------------------------|
| POST   | /api/auth/register        | Register a new user                         |
| POST   | /api/auth/signin     | User sign-in |
| POST    | /api/auth/user-agreement        | A user agreement page before register    |
|  POST   | /api/auth/user-settings | A user setting                              |
|POST|/api/auth/user-profile|A user profile setting|
|GET|/api/auth/user-profile/:picture|Getting the profile picture |
|POST|/api/notes/|Create a new note|
|GET|/api/notes/all|Get a list of all notes|
|GET|/api/notes/suggested|Get a list of suggested notes
|GET|/api/notes/:noteID|Get a specific note by its ID|
|PUT|/api/notes/:noteID|Update an existing note|
|DELETE|/api/notes/:noteID|Delete a specific note by its ID|
|GET|/api/notes/search|Search for notes based on a keyword or phrase|
|GET|/api/notes/searchByTag|Search for notes based on tags|
|POST|/api/data/:noteID/chunk|Send a chunk (1 slide) of note data - main endpoint for saving notes|
|GET|/api/data/:noteID/chunks|Retrieve the entire set of chunks for a specific note - used for downloading a note for offline editing/viewing|
|POST|/api/data/:noteID/definition|Create a new definition. If the definition ID is null or does not yet exist, a new definition will be created. If the definition ID matches an existing definition, that definition will be uploaded.|
|GET|/api/data/:noteID/definitions|Retrieve all existing definitions for a specific note|
|GET|/api/data/:tagName/tag_definitions|Retrieve a list of definitions for a specific tag- used for browsing definitions by class|
|POST|/api/data/:noteID/slides|Assign a set of slides to a specific note|
|GET|/api/data/:noteID/slide/:slideNumber|Get the image for a specific slide|

**6. Contributions**
| Team member | Team contributions                 |
|----:|-------------------------|
|  **Zelda Lu**  | -   Created all the signin and register API endpoints. <br />-   Created the register and login pages. |
|  **Deci Horine**  | -   Created all the note data API endpoints.<br />-   Created the home page.<br />- Applied the Vite frontend tool to the project.<br />    |
|  **Nam Pham** | -   Created all the note management API endpoints.<br />-   Created the note editor page.<br />
