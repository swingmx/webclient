from app import create_api
from app.functions import run_secondary_checks
from app.prep import run_checks
from app.utils import background


@background
def run_bg_checks():
    run_checks()
    run_secondary_checks()

if __name__ == '__main__':
    run_bg_checks()
    # watch_files()
    app = create_api()
    app.run(debug=True, threaded=True, host="0.0.0.0", port=1970, use_reloader=False)
