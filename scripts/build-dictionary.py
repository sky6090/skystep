import json
from pathlib import Path

src = Path("data/cet6.jsonl")
out = Path("public/data/dictionary.json")
out.parent.mkdir(parents=True, exist_ok=True)

entries: dict[str, dict] = {}

with src.open(encoding="utf-8") as handle:
    for line in handle:
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue

        word = (obj.get("headWord") or "").strip()
        word_obj = (obj.get("content") or {}).get("word") or {}
        content = word_obj.get("content") or {}
        if not word:
            word = (word_obj.get("wordHead") or "").strip()
        if not word:
            continue

        trans = content.get("trans") or []
        meanings: list[str] = []
        pos = ""
        for item in trans:
            cn = (item.get("tranCn") or "").strip()
            p = (item.get("pos") or "").strip()
            if not cn:
                continue
            meanings.append(f"{p}. {cn}" if p else cn)
            if not pos and p:
                pos = p

        if not meanings:
            continue

        phonetic = (content.get("usphone") or content.get("ukphone") or "").strip()
        if phonetic and not phonetic.startswith("/"):
            phonetic = f"/{phonetic}/"

        sentences = (content.get("sentence") or {}).get("sentences") or []
        first = sentences[0] if sentences else {}
        example = (first.get("sContent") or "").strip()
        example_zh = (first.get("sCn") or "").strip()

        phrases = (content.get("phrase") or {}).get("phrases") or []
        phrase_items = [
            f"{p.get('pContent')}：{p.get('pCn')}"
            for p in phrases[:3]
            if p.get("pContent")
        ]

        synos = (content.get("syno") or {}).get("synos") or []
        syn_items: list[str] = []
        for group in synos[:2]:
            for item in (group.get("hwds") or [])[:3]:
                candidate = (item.get("w") or "").strip()
                if candidate and candidate not in syn_items:
                    syn_items.append(candidate)

        key = word.lower()
        entries[key] = {
            "id": key,
            "w": word,
            "p": phonetic,
            "t": "；".join(meanings),
            "pos": pos,
            "ex": example,
            "exZh": example_zh,
            "phr": phrase_items,
            "syn": syn_items,
            "rank": obj.get("wordRank") or 999999,
            "tag": "CET-6",
        }

data = sorted(entries.values(), key=lambda item: item["rank"])
out.write_text(
    json.dumps(data, ensure_ascii=False, separators=(",", ":")),
    encoding="utf-8",
)
print(f"wrote {len(data)} entries, {out.stat().st_size / 1024 / 1024:.2f} MB")
