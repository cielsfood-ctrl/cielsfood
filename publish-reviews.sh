#!/usr/bin/env bash
# publish-reviews.sh — Notion → data.js automated publisher
# Usage: ./publish-reviews.sh [--dry-run]
#   --dry-run  Fetch, parse, show diff, test Notion PATCH calls,
#              but do NOT write src/data.js or commit/push.
# Requires: $NOTION_KEY, curl, python3, git

set -euo pipefail

DRY_RUN=0
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_JS="$SCRIPT_DIR/src/data.js"

# All temp files live in the repo directory (resolved from the script's own
# location — ~/cielsfood in the normal setup — never a hardcoded path).
TMP_DIR="$SCRIPT_DIR"
TMP_REST="$TMP_DIR/.tmp-notion-restaurants.json"
TMP_REV="$TMP_DIR/.tmp-notion-reviews.json"
TMP_REST_IDS="$TMP_DIR/.tmp-notion-rest-ids"
TMP_REV_IDS="$TMP_DIR/.tmp-notion-rev-ids"
TMP_CURL="$TMP_DIR/.tmp-notion-curl-response"

NOTION_REST_DB="298028b6e10280788b1ee47e7cacd57b"
NOTION_REV_DB="298028b6e10280139d12d35f33c66e1f"

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  rm -f "$TMP_REST" "$TMP_REV" "$TMP_REST_IDS" "$TMP_REV_IDS" "$TMP_CURL"
}
trap cleanup EXIT

# ── Prerequisites ─────────────────────────────────────────────────────────────
if [ -z "${NOTION_KEY:-}" ]; then
  echo "Error: NOTION_KEY is not set. Run: export NOTION_KEY=your_key" >&2
  exit 1
fi

for cmd in curl python3 git; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: '$cmd' is required but not found." >&2
    exit 1
  fi
done

if [ "$DRY_RUN" = "1" ]; then
  echo ""
  echo "── DRY RUN ───────────────────────────────────────────────────────────"
  echo "  src/data.js will NOT be modified. Git commit/push skipped."
  echo "  Notion PATCH calls will run to test connectivity."
fi

# ── 1. Fetch from Notion ──────────────────────────────────────────────────────
echo ""
echo "── Fetching from Notion ──────────────────────────────────────────────"

curl -sf -X POST "https://api.notion.com/v1/databases/${NOTION_REST_DB}/query" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"property":"Status","status":{"equals":"Ready to Publish"}}}' \
  -o "$TMP_REST"

curl -sf -X POST "https://api.notion.com/v1/databases/${NOTION_REV_DB}/query" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"property":"Status","status":{"equals":"Ready to Publish"}}}' \
  -o "$TMP_REV"

for f in "$TMP_REST" "$TMP_REV"; do
  if ! python3 -c "import json,sys; d=json.load(open('$f')); sys.exit(0 if d.get('object')=='list' else 1)" 2>/dev/null; then
    echo "Error: Unexpected Notion API response:" >&2
    cat "$f" >&2
    exit 1
  fi
done

NREST=$(python3 -c "import json; print(len(json.load(open('$TMP_REST'))['results']))")
NREV=$(python3 -c  "import json; print(len(json.load(open('$TMP_REV'))['results']))")
echo "  Found $NREST restaurant(s) and $NREV review(s) ready to publish."

if [ "$NREST" -eq 0 ] && [ "$NREV" -eq 0 ]; then
  echo "  Nothing to publish."
  exit 0
fi

# ── 2. Parse and update src/data.js ──────────────────────────────────────────
echo ""
echo "── Parsing and updating src/data.js ─────────────────────────────────"

DATA_JS="$DATA_JS" \
TMP_REST="$TMP_REST" \
TMP_REV="$TMP_REV" \
TMP_REST_IDS="$TMP_REST_IDS" \
TMP_REV_IDS="$TMP_REV_IDS" \
python3 << 'PYTHON'
import json, re, sys, os

DATA_JS_PATH = os.environ['DATA_JS']
TMP_REST     = os.environ['TMP_REST']
TMP_REV      = os.environ['TMP_REV']
TMP_REST_IDS = os.environ['TMP_REST_IDS']
TMP_REV_IDS  = os.environ['TMP_REV_IDS']

with open(DATA_JS_PATH) as f:
    data_js = f.read()
with open(TMP_REST) as f:
    restaurants_data = json.load(f)
with open(TMP_REV) as f:
    reviews_data = json.load(f)

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_text(arr):
    return ''.join(t.get('plain_text', '') for t in (arr or []))

def parse_urls(arr):
    raw = get_text(arr)
    return [p.strip() for p in re.split(r';\s*', raw) if p.strip().startswith('http')]

def parse_captions(arr):
    raw = get_text(arr)
    return [p.strip() for p in raw.split(';') if p.strip()]

def parse_value(select):
    if not select:
        return 4
    count = (select.get('name') or '').count('£')
    return count if 1 <= count <= 5 else 4

def js_str(s):
    return s.strip().replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

def next_rev_id(rest_num, used):
    base = f'rv{rest_num}'
    for ch in 'abcdefghijklmnopqrstuvwxyz':
        cid = f'{base}{ch}'
        if cid not in used:
            return cid
    raise RuntimeError(f'Ran out of review ID letters for {base}')

# ── Read existing state ───────────────────────────────────────────────────────

# Restaurant IDs and names already in data.js
rest_id_nums = [int(m) for m in re.findall(r'id:\s*"r(\d+)"', data_js)]
max_rest_num = max(rest_id_nums) if rest_id_nums else 0

existing_name_to_id = {}
for m in re.finditer(r'\{\s*id:\s*"(r\d+)"[^}]*name:\s*"([^"]+)"', data_js):
    existing_name_to_id[m.group(2).lower()] = m.group(1)

used_rev_ids = set(re.findall(r'id:\s*"(rv\d+\w*)"', data_js))

# ── Build Notion review map: restaurant page ID → [review pages] ──────────────

notion_reviews = {}
for page in reviews_data['results']:
    for rel in (page['properties'].get('Restaurant', {}).get('relation') or []):
        notion_reviews.setdefault(rel['id'], []).append(page)

# ── Process each restaurant ───────────────────────────────────────────────────

new_rest_entries = []
new_rev_entries  = []
notion_rest_ids  = []
notion_rev_ids   = []
summary          = []

for page in restaurants_data['results']:
    props      = page['properties']
    notion_pid = page['id']
    name       = get_text(props.get('Restaurant', {}).get('title') or [])
    cuisine    = ((props.get('Cuisine', {}).get('select')) or {}).get('name', '')
    location   = ((props.get('Location', {}).get('select')) or {}).get('name', '')
    place      = (props.get('Address', {}) or {}).get('place') or {}
    address    = place.get('address', '')
    lat        = place.get('lat')
    lng        = place.get('lon')
    url        = (props.get('URL', {}) or {}).get('url') or ''
    phone      = (props.get('Phone', {}) or {}).get('phone_number') or ''
    michelin   = ((props.get('Michelin', {}).get('select')) or {}).get('name', 'None')
    is_new     = name.lower() not in existing_name_to_id

    if is_new:
        max_rest_num += 1
        rest_id = f'r{max_rest_num}'
        lat_s       = str(lat) if lat is not None else 'null'
        lng_s       = str(lng) if lng is not None else 'null'
        phone_field = f', phone: "{js_str(phone)}"' if phone else ''
        new_rest_entries.append(
            f'  {{ id: "{rest_id}", name: "{js_str(name)}", cuisine: "{cuisine}", '
            f'location: "{location}", address: "{js_str(address)}", '
            f'website: "{url}"{phone_field}, michelin: "{michelin}", '
            f'value: 4, mapX: 0.50, mapY: 0.40, lat: {lat_s}, lng: {lng_s} }}'
        )
        existing_name_to_id[name.lower()] = rest_id
        summary.append(f'\n  [NEW] {name} ({rest_id})')
        summary.append(f'        {cuisine} · {location} · Michelin: {michelin}')
        summary.append(f'        {address}')
        if phone:
            summary.append(f'        Phone: {phone}')
    else:
        rest_id = existing_name_to_id[name.lower()]
        summary.append(f'\n  [SKIP] {name} ({rest_id}) — already in data.js; skipping')
        continue

    notion_rest_ids.append(f'{notion_pid}\t{name}')
    rest_num = re.search(r'\d+', rest_id).group()

    for rev_page in notion_reviews.get(notion_pid, []):
        rp           = rev_page['properties']
        notion_rev_pid = rev_page['id']
        date         = ((rp.get('Review Date', {}) or {}).get('date') or {}).get('start', '')
        tastiness    = (rp.get('Tastiness',   {}) or {}).get('number') or 0
        specialness  = (rp.get('Specialness', {}) or {}).get('number') or 0
        service      = (rp.get('Service',     {}) or {}).get('number') or 0
        environment  = (rp.get('Environment', {}) or {}).get('number') or 0
        value        = parse_value((rp.get('Value of Money', {}) or {}).get('select'))
        body         = js_str(get_text((rp.get('Review Body', {}) or {}).get('rich_text') or []))
        urls         = parse_urls((rp.get('Image URLs', {}) or {}).get('rich_text') or [])
        captions     = parse_captions((rp.get('Image Captions', {}) or {}).get('rich_text') or [])

        photos = []
        for i, u in enumerate(urls):
            cap = js_str(captions[i]) if i < len(captions) else ''
            photos.append(f'      {{ src: "{u}", caption: "{cap}" }}')

        rev_id = next_rev_id(rest_num, used_rev_ids)
        used_rev_ids.add(rev_id)
        notion_rev_ids.append(f'{notion_rev_pid}\t{name} — {date}')

        new_rev_entries.append(
            f'  // {rest_id} {name}\n'
            f'  {{ id: "{rev_id}", restaurantId: "{rest_id}", date: "{date}", '
            f'tastiness: {tastiness}, specialness: {specialness}, service: {service}, '
            f'environment: {environment}, value: {value},\n'
            f'    body: "{body}",\n'
            f'    photos: [\n'
            + ',\n'.join(photos) +
            f'\n    ]\n  }}'
        )

        summary.append(f'    Review {rev_id}: {date}')
        summary.append(f'    T:{tastiness}  Sp:{specialness}  Sv:{service}  E:{environment}  V:{value}')
        summary.append(f'    Photos: {len(photos)}' +
                       (f'  ⚠ caption count mismatch ({len(urls)} URLs / {len(captions)} captions)'
                        if len(urls) != len(captions) else ''))

# ── Patch data.js ─────────────────────────────────────────────────────────────

if not new_rest_entries and not new_rev_entries:
    print('\n  No new content — all entries already exist in data.js.')
    sys.exit(0)

updated = data_js

if new_rest_entries:
    insert = ',\n' + ',\n'.join(new_rest_entries)
    if '\n];\n\n// Photo placeholder' not in updated:
        print('Error: could not find RESTAURANTS insertion point in data.js.', file=sys.stderr)
        sys.exit(1)
    updated = updated.replace('\n];\n\n// Photo placeholder',
                               insert + '\n];\n\n// Photo placeholder', 1)

if new_rev_entries:
    insert = ',\n\n' + ',\n\n'.join(new_rev_entries)
    if '\n];\n\n// Personal favourite' not in updated:
        print('Error: could not find REVIEWS insertion point in data.js.', file=sys.stderr)
        sys.exit(1)
    updated = updated.replace('\n];\n\n// Personal favourite',
                               insert + '\n];\n\n// Personal favourite', 1)

with open(DATA_JS_PATH, 'w') as f:
    f.write(updated)

# ── Write Notion IDs for shell PATCH step ─────────────────────────────────────
# One "page_id<TAB>label" per line, each line newline-terminated. The trailing
# newline matters: `while read` skips a final unterminated line, which silently
# dropped the last entry from the PATCH loop.

with open(TMP_REST_IDS, 'w') as f:
    for line in notion_rest_ids:
        f.write(line + '\n')
with open(TMP_REV_IDS, 'w') as f:
    for line in notion_rev_ids:
        f.write(line + '\n')

# ── Print summary ─────────────────────────────────────────────────────────────

print('')
print('─' * 62)
print('  CHANGES SUMMARY')
print('─' * 62)
for line in summary:
    print(line)
print('─' * 62)
print(f'  {len(new_rest_entries)} new restaurant(s), {len(new_rev_entries)} new review(s)')
print('─' * 62)

PYTHON

# The Python step exits early (without writing the ID files) when there is no
# new content — make sure they exist before anything below reads them.
[ -f "$TMP_REST_IDS" ] || : > "$TMP_REST_IDS"
[ -f "$TMP_REV_IDS" ]  || : > "$TMP_REV_IDS"

# ── 3. Show diff and prompt for approval ─────────────────────────────────────
echo ""
echo "── Git diff ──────────────────────────────────────────────────────────"
git diff src/data.js

if [ "$DRY_RUN" = "1" ]; then
  echo ""
  echo "── [DRY RUN] Reverting src/data.js ──────────────────────────────────"
  git checkout -- src/data.js
  echo "  src/data.js reverted — no changes written."
else
  echo ""
  echo "Type 'approve' to commit, push, and mark Published in Notion."
  echo "Type anything else to abort (changes to src/data.js will be reverted)."
  printf "> "
  read -r RESPONSE

  if [ "$RESPONSE" != "approve" ]; then
    echo "Aborted — reverting src/data.js."
    git checkout -- src/data.js
    exit 0
  fi

  # ── 4. Commit and push ──────────────────────────────────────────────────────
  echo ""
  echo "── Committing and pushing ────────────────────────────────────────────"

  NREST_NEW=$(python3 -c "print(sum(1 for l in open('$TMP_REST_IDS') if l.strip()))")
  NREV_NEW=$(python3  -c "print(sum(1 for l in open('$TMP_REV_IDS')  if l.strip()))")

  echo "  Pulling latest remote changes before commit..."
  git stash
  git pull --rebase origin main
  git stash pop

  git add src/data.js
  git commit -m "Publish ${NREST_NEW} restaurant(s) and ${NREV_NEW} review(s) from Notion"

  git push origin main
  echo "  Pushed to main."
fi

# ── 5. Mark Published in Notion ───────────────────────────────────────────────
# Guard: create the ID files if they don't exist so the read loops below can't
# crash with a missing-file error.
[ -f "$TMP_REST_IDS" ] || : > "$TMP_REST_IDS"
[ -f "$TMP_REV_IDS" ]  || : > "$TMP_REV_IDS"

echo ""
if [ "$DRY_RUN" = "1" ]; then
  echo "── [DRY RUN] Testing Notion PATCH calls ──────────────────────────────"
else
  echo "── Marking as Published in Notion ───────────────────────────────────"
fi

PATCH_BODY='{"properties":{"Status":{"status":{"name":"Published"}}}}'
PATCH_FAILED=0

# ── PATCH helper: one call with one retry, full output on failure ─────────────
# Always returns 0 so a failed PATCH never aborts the loop under `set -e` —
# failures are recorded in PATCH_FAILED and the loop continues to the next entry.
notion_patch() {
  local kind="$1"
  local page_id="$2"
  local label="${3:-$page_id}"
  local attempt http_code result status

  for attempt in 1 2; do
    http_code=$(curl -s \
      -o "$TMP_CURL" \
      -w "%{http_code}" \
      -X PATCH "https://api.notion.com/v1/pages/${page_id}" \
      -H "Authorization: Bearer $NOTION_KEY" \
      -H "Notion-Version: 2022-06-28" \
      -H "Content-Type: application/json" \
      -d "$PATCH_BODY")
    result=$(cat "$TMP_CURL" 2>/dev/null || echo "")

    status=$(echo "$result" | python3 -c \
      "import json,sys; d=json.load(sys.stdin); print(d.get('properties',{}).get('Status',{}).get('status',{}).get('name','?'))" \
      2>/dev/null || echo "parse-error")

    if [ "$status" = "Published" ]; then
      if [ "$attempt" -eq 1 ]; then
        echo "  OK  ${kind} '${label}' (${page_id}) → Published"
      else
        echo "  OK  ${kind} '${label}' (${page_id}) → Published (succeeded on retry)"
      fi
      return 0
    fi

    echo "  FAIL  ${kind} '${label}' (${page_id})" >&2
    echo "        Attempt ${attempt} — HTTP ${http_code} | parsed status: '${status}'" >&2
    echo "        Response body:" >&2
    echo "$result" | python3 -c \
      "import json,sys
try:
    d=json.load(sys.stdin)
    print('        ' + json.dumps(d, indent=2).replace('\n', '\n        '))
except Exception:
    import sys as _s; print('        (unparseable) ' + open('${TMP_CURL}').read())" >&2

    if [ "$attempt" -eq 1 ]; then
      echo "        Retrying in 3s..." >&2
      sleep 3
    fi
  done

  echo "" >&2
  echo "  ERROR ${kind} '${label}' (${page_id}) — failed after retry, continuing with next entry." >&2
  echo "        Mark it Published manually in Notion to prevent re-processing." >&2
  PATCH_FAILED=1
  return 0
}

# Lines are "page_id<TAB>label". The `|| [ -n "$page_id" ]` guard processes a
# final line even if it lacks a trailing newline — previously the last entry
# of each file was silently skipped, so only the first restaurant/review of a
# multi-entry publish was marked Published.
while IFS=$'\t' read -r page_id label || [ -n "$page_id" ]; do
  [ -z "$page_id" ] && continue
  notion_patch "Restaurant" "$page_id" "$label"
done < "$TMP_REST_IDS"

while IFS=$'\t' read -r page_id label || [ -n "$page_id" ]; do
  [ -z "$page_id" ] && continue
  notion_patch "Review    " "$page_id" "$label"
done < "$TMP_REV_IDS"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "── Done ──────────────────────────────────────────────────────────────"
if [ "$PATCH_FAILED" -eq 1 ]; then
  if [ "$DRY_RUN" = "1" ]; then
    echo "  [DRY RUN] One or more PATCH calls failed — see errors above."
  else
    echo "  Site updated. WARNING: one or more Notion PATCH calls failed."
    echo "  Pages still marked 'Ready to Publish' will be re-fetched on the next"
    echo "  run but skipped (already in data.js). Mark them Published manually."
  fi
  echo ""
  exit 1
else
  if [ "$DRY_RUN" = "1" ]; then
    echo "  [DRY RUN] All PATCH calls succeeded. Run without --dry-run to publish."
  else
    echo "  Site updated and Notion statuses set to Published."
  fi
fi
echo ""
