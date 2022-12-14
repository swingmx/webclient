from app import create_api
from app.functions import run_secondary_checks
from app.prep import run_checks
from app.utils import background

app = create_api()
app.static_folder = "./client"

@app.route("/<path:path>")
def serve_client_files(path):
    """
    Serves the static files in the client folder.
    """
    return app.send_static_file(path)


@app.route("/")
def serve_client():
    """
    Serves the index.html file at client/index.html.
    """
    print(app.static_folder)

    import pathlib

    this_path = pathlib.Path(__file__).parent.resolve()
    print(this_path)
    return app.send_static_file("index.html")


@background
def run_bg_checks():
    run_checks()
    run_secondary_checks()


if __name__ == "__main__":
    run_bg_checks()
    # watch_files()
    app.run(debug=True, threaded=True, host="0.0.0.0", port=1970, use_reloader=False)
