#!/usr/bin/env python3
"""LPのローカルプレビュー用サーバー。

標準の `python3 -m http.server` はブラウザにキャッシュを許すため、
CSS/JSを直してもリロードで反映されず「直っていない」と誤解する原因になる。
このサーバーは常に no-store を返すので、普通のリロードで必ず最新が出る。

実行: python3 scripts/serve.py [port]
"""

import functools
import http.server
import socketserver
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8811
ROOT = Path(__file__).resolve().parent.parent / "lp"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # アクセスログは出さない
        return


class ReusableServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=str(ROOT))
    with ReusableServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"http://localhost:{PORT}/  ({ROOT})  ※キャッシュ無効")
        httpd.serve_forever()
