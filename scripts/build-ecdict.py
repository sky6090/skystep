"""Build public/data/dictionary.json from ECDICT.

ECDICT: https://github.com/skywind3000/ECDICT (MIT).
Usage:
  python scripts/build-ecdict.py .cache/ecdict.csv --limit 18000
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

WORD_RE = re.compile(r"^[A-Za-z][A-Za-z'\-]{1,29}$")
POS_RE = re.compile(r"^([a-z]+)\.\s*")


def clean_translation(raw: str) -> str:
    lines = []
    for line in raw.replace("\\n", "\n").splitlines():
        line = line.strip()
        if not line or line.startswith("[网络]"):
            continue
        lines.append(line)
    text = "；".join(lines[:2])
    text = re.sub(r"^[a-z]{1,5}\.\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip("； ")
    return text[:160]


def derive_pos(translation: str, raw_pos: str) -> str:
    match = POS_RE.match(translation)
    if match:
        return f"{match.group(1)}."
    first = raw_pos.split("/")[0].strip() if raw_pos else ""
    if ":" in first:
        first = first.split(":", 1)[0]
    return first if 1 <= len(first) <= 12 else ""


def parse_forms(exchange: str, word: str) -> list[str]:
    forms: list[str] = []
    for part in (exchange or "").split("/"):
        if ":" not in part:
            continue
        code, value = part.split(":", 1)
        value = value.strip()
        if code == "0" or not value:
            continue
        if value.lower() == word.lower():
            continue
        if value not in forms:
            forms.append(value)
    return forms[:8]


def tag_of(raw_tag: str) -> str:
    tags = (raw_tag or "").lower().split()
    if "cet6" in tags:
        return "CET-6"
    if "cet4" in tags:
        return "CET-4"
    if "ky" in tags:
        return "考研"
    return "高频"


def frequency(row: dict[str, str]) -> int:
    values = []
    for key in ("frq", "bnc"):
        try:
            value = int(row.get(key) or 0)
        except ValueError:
            value = 0
        if value > 0:
            values.append(value)
    return min(values) if values else 10**9


def build(source: Path, limit: int) -> list[dict]:
    seen: set[str] = set()
    rows: list[tuple[int, dict]] = []

    with source.open("r", encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            word = (row.get("word") or "").strip()
            if not WORD_RE.fullmatch(word):
                continue
            key = word.lower()
            if key in seen:
                continue
            translation = clean_translation(row.get("translation") or "")
            if not translation:
                continue
            seen.add(key)
            phonetic = (row.get("phonetic") or "").strip()
            if phonetic and not phonetic.startswith("/"):
                phonetic = f"/{phonetic}/"
            rows.append(
                (
                    frequency(row),
                    {
                        "id": key,
                        "w": word,
                        "p": phonetic,
                        "t": translation,
                        "pos": derive_pos(
                            row.get("translation") or "",
                            row.get("pos") or "",
                        ),
                        "ex": "",
                        "exZh": "",
                        "phr": [],
                        "syn": [],
                        "forms": parse_forms(row.get("exchange") or "", word),
                        "rank": 0,
                        "tag": tag_of(row.get("tag") or ""),
                    },
                )
            )

    rows.sort(key=lambda item: (item[0], len(item[1]["w"]), item[1]["w"]))
    selected = rows[:limit]
    entries = []
    for rank, (_, entry) in enumerate(selected, start=1):
        entry["rank"] = rank
        entries.append(entry)
    return entries


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", nargs="?", default=".cache/ecdict.csv")
    parser.add_argument("--limit", type=int, default=18000)
    parser.add_argument("--out", default="public/data/dictionary.json")
    args = parser.parse_args()

    source = Path(args.source)
    if not source.exists():
        print(f"missing {source}; download ECDICT ecdict.csv first", file=sys.stderr)
        return 1

    entries = build(source, args.limit)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(entries, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

    by_tag: dict[str, int] = {}
    for entry in entries:
        by_tag[entry["tag"]] = by_tag.get(entry["tag"], 0) + 1
    print(f"wrote {len(entries)} entries to {out} ({out.stat().st_size / 1024 / 1024:.2f} MB)")
    print("tags:", by_tag)
    print("first:", [entry["w"] for entry in entries[:10]])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
