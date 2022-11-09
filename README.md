# Reader API for Rs-Reader

Webscraping RESTful API to get posts from a thread in the art forum (doujin board) of 2chsc.

## API Endpoints

The API endpoints follow how 2chsc routes its threads.

Note: v1 of this API will ONLY fetch doujin board threads. It will not return thread data for any other boards on 2chsc.

/v1/:threadId/last50

- Gets the last 50 posts for a thread

/v1/:threadId/

- Gets all posts for a thread

/v1/:threadId/new/:postId

- Gets new posts if available, starting from the provided postId

## JSON response

| Key        | Description                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| id         | Thread ID                                                                                                 |
| title      | Title of thread                                                                                           |
| totalCount | Total post count for thread                                                                               |
| lastUpdate | Date and time (ISO8601 format) of the last post made to thread, if available - undefined if not available |
| posts      | Array of post data objects                                                                                |

Post data is an object with the following:

| Key     | Description                                    |
| ------- | ---------------------------------------------- |
| postId  | Post number                                    |
| name    | Name of poster                                 |
| date    | Date when posted - undefined if not available  |
| time    | Time when posted - undefined if not available  |
| userId  | User ID of poster - undefined if not available |
| message | Post message                                   |

## Running Locally

1.  Download the repo by clicking Code -> Download Zip
2.  Unzip the folder and then using your IDE of choice (i.e. VSCode), open the folder
3.  Run the following command

```
npm install
```

4. Run the following command to start server

```
npm start
```

5. API can now be accessed on localhost:8080

If you'd like to remove or adjust the API rate limiter:

1. Open app.js and edit the following code block to your desired values or remove entirely:

```
const limiter = rateLimit({

    //Sets the time frame - this one is set to 15 minutes
	windowMs: 15 * 60 * 1000,

    //Sets how many requests allowed in the given time frame - this one is set to 100 req / 15 min
	max: 100,

	standardHeaders: true,
	message: 'Too many requests, try again in 15 minutes'
});
```

You can read more about the rate limiter at [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit/blob/master/readme.md)

If you'd like to edit which forum the API webscrapes from:

1. Open api_controller_v1.js and edit the following variable:

```
const baseUrl = 'https://nozomi.2ch.sc/test/read.cgi/doujin/';
```
