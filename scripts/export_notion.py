#  scripts/export_notion.py
#
#  Legge tutte le pagine di un database Notion e le
#  salva in public/notion.json (UTF-8, formattato).

import os
import json
import pathlib
from notion_client import Client

NOTION_TOKEN = os.environ["NOTION_TOKEN"]      # impostato come secret
DATABASE_ID  = os.environ["DATABASE_ID"]       # impostato come secret

client = Client(auth=NOTION_TOKEN)


def fetch_all_pages(db_id: str):
    """Itera su tutte le pagine del database, gestendo la paginazione."""
    cursor = None
    while True:
        resp = client.databases.query(
            database_id=db_id,
            start_cursor=cursor,          # None alla prima chiamata va bene
            page_size=100                 # massimo consentito
        )
        yield from resp["results"]

        if not resp["has_more"]:
            break
        cursor = resp["next_cursor"]


def main():
    data = list(fetch_all_pages(DATABASE_ID))

    out_dir = pathlib.Path("public")
    out_dir.mkdir(exist_ok=True)

    out_file = out_dir / "notion.json"
    out_file.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    # Variante 2: calcola la relativa rispetto alla cwd solo se possibile
    try:
        display_path = out_file.resolve().relative_to(pathlib.Path.cwd())
    except ValueError:
        display_path = out_file  # fallback
    print(f"✔  Esportazione completata: {display_path}")


if __name__ == "__main__":
    main()
