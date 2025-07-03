import os
import json
import pathlib
import datetime
from notion_client import Client

NOTION_TOKEN = os.environ["NOTION_TOKEN"]
DATABASE_ID = os.environ["DATABASE_ID"]

client = Client(auth=NOTION_TOKEN)

def fetch_all_pages(db_id):
    cursor = None
    while True:
        resp = client.databases.query(database_id=db_id, start_cursor=cursor, page_size=100)
        yield from resp["results"]
        if not resp["has_more"]:
            break
        cursor = resp["next_cursor"]

def main():
    today = datetime.date.today()
    pages = list(fetch_all_pages(DATABASE_ID))
    past = []
    for page in pages:
        date_prop = page.get("properties", {}).get("Data")
        date_info = date_prop.get("date") if date_prop else None
        if not date_info:
            continue
        date_str = date_info.get("start")
        if not date_str:
            continue
        try:
            date_value = (
                datetime.datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                .date()
            )
        except ValueError:
            try:
                date_value = datetime.date.fromisoformat(date_str)
            except ValueError:
                continue
        if date_value < today:
            past.append(page)

    out_dir = pathlib.Path("public")
    out_dir.mkdir(exist_ok=True)
    out_file = out_dir / "past-notion.json"
    out_file.write_text(json.dumps(past, ensure_ascii=False, indent=2), encoding="utf-8")
    try:
        display_path = out_file.resolve().relative_to(pathlib.Path.cwd())
    except ValueError:
        display_path = out_file
    print(f"\u2714 Exported {display_path}")

if __name__ == "__main__":
    main()
