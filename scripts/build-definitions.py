"""Build a small English-definition map for CET/考研 words.

Source: ECDICT (MIT). This is used only as a fallback for daily translation
practice when a word has no example sentence.
"""

import csv
import json
import re
from pathlib import Path

WORD_RE = re.compile(r"^[A-Za-z][A-Za-z'\-]{1,29}$")
OUT = Path("public/data/definitions.json")


def clean(raw: str) -> str:
    text = (raw or "").replace("\\n", "\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return " ".join(lines)


def main() -> None:
    source = Path(".cache/ecdict.csv")
    definitions: dict[str, str] = {}
    with source.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            word = (row.get("word") or "").strip().lower()
            if not WORD_RE.fullmatch(word):
                continue
            tags = (row.get("tag") or "").lower().split()
            if not ("cet4" in tags or "cet6" in tags or "ky" in tags):
                continue
            text = clean(row.get("definition") or "")
            if text and word not in definitions:
                definitions[word] = text[:220]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(definitions, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {len(definitions)} definitions to {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
