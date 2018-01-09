# So You Think You Can Cater

Name: Alec Trievel
Pitt ID: abt22

## Installation

1. Create a virtual environment for Python.
2. From the root of the repository run `pip install -r requirements.txt`
3. Add the `FLASK_APP` variable to your path. (e.g. `export FLASK_APP=catering.py`).
4. From the command prompt, run `flask initdb`.

## Running the App

Once installed, the application can be started with `flask run`.

### Other Information

The only error I saw in my application was regarding the AJAX calls to get new messages. On very rare occasions, the messages are returned twice from Flask. When tracing the GET calls from client to server, you can see that sometimes two requests are made per second instead of one. I did not find a way to fix it online either. Apparently this is just the nature of the setTimeout() calls, as they are not 100% guaranteed to fire at the specified intervals.  

Additionally, sometimes the browsers appear to freeze and nothing happens. I read this is an issue with Flask and I could not find a fix.