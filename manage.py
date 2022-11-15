from app import create_api, watch_files
from app.functions import run_secondary_checks
from app.prep import run_checks

if __name__ == '__main__':
    run_checks()
    # watch_files()
    # app = create_api()
    # app.run(debug=True, threaded=True, host="0.0.0.0", port=1977, use_reloader=False)
    run_secondary_checks()
