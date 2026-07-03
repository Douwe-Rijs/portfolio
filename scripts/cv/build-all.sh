#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CV_SOURCE="${1:-scripts/cv/cv.html}"
PDF_OUTPUT="public/cv-douwe-rijs.pdf"
CV_IMAGES_DIR="src/assets/cv"

cd "$ROOT_DIR"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required."
  exit 1
fi

if ! command -v wkhtmltopdf >/dev/null 2>&1; then
  echo "Error: wkhtmltopdf is required."
  echo "Install it, then rerun this script."
  exit 1
fi

if ! python3 -c "import fitz" >/dev/null 2>&1; then
  echo "Error: PyMuPDF is not available. Install it with: pip install pymupdf"
  exit 1
fi

echo "1/5 Generating PDF from ${CV_SOURCE} with wkhtmltopdf..."
wkhtmltopdf --enable-local-file-access "$CV_SOURCE" "$PDF_OUTPUT"

echo "2/5 Verifying 1-page output and rendering resume page PNGs..."
mkdir -p "$CV_IMAGES_DIR"
python3 - <<'PY'
from pathlib import Path
import fitz

pdf_path = Path("public/cv-douwe-rijs.pdf")
images_dir = Path("src/assets/cv")

doc = fitz.open(pdf_path)
if len(doc) != 1:
    raise SystemExit(f"Expected a 1-page CV PDF, got {len(doc)} pages.")

for index, page in enumerate(doc, start=1):
    output = images_dir / f"cv-page-{index}.png"
    page.get_pixmap(dpi=150).save(output)

# Remove stale images when the page count shrinks.
max_page = len(doc)
for image in images_dir.glob("cv-page-*.png"):
    stem = image.stem.removeprefix("cv-page-")
    if stem.isdigit() and int(stem) > max_page:
        image.unlink()
PY

echo "3/5 Formatting CV source..."
npx prettier --write "$CV_SOURCE"

echo "4/5 Running lint..."
npm run lint

echo "5/5 Building site..."
npm run build

echo "Done. CV assets and production build are up to date."
