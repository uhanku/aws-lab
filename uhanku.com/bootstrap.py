#!/usr/bin/env python3
"""
Serve the website built in the local ./dist directory.

Usage:
    python serve.py
    python serve.py --port 8080
    python serve.py --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"


class WebsiteHandler(SimpleHTTPRequestHandler):
    """Static-file handler with fallback to index.html for client-side routes."""

    def do_GET(self) -> None:
        parsed_path = urlparse(self.path)
        request_path = unquote(parsed_path.path).lstrip("/")
        requested_file = DIST_DIR / request_path

        # For SPA routes such as /about, return index.html when there is no
        # matching file. Missing assets still return a normal 404.
        if (
            request_path
            and not requested_file.exists()
            and not Path(request_path).suffix
        ):
            self.path = "/index.html"

        super().do_GET()

    def end_headers(self) -> None:
        # Avoid stale HTML while testing local builds.
        if self.path in ("/", "/index.html"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Serve the website from the ./dist directory."
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="Interface to bind to (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to listen on (default: 8000)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    index_file = DIST_DIR / "index.html"
    if not index_file.is_file():
        raise SystemExit(
            f"Could not find {index_file}\n"
            "Run this script from the uhanku.com project and build the site "
            "first with: npm run build"
        )

    handler = partial(WebsiteHandler, directory=str(DIST_DIR))
    server = ThreadingHTTPServer((args.host, args.port), handler)

    display_host = "localhost" if args.host in {"127.0.0.1", "0.0.0.0"} else args.host
    print(f"Serving: {DIST_DIR}")
    print(f"Open:    http://{display_host}:{args.port}")
    print("Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
