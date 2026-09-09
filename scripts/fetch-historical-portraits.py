"""Fetch Wikipedia lead portraits and save centered square local assets."""
import io, json, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"images"/"historical"
PEOPLE={
 "gore":"Al Gore", "bush":"George W. Bush", "nader":"Ralph Nader",
 "kerry":"John Kerry", "obama":"Barack Obama", "mccain":"John McCain",
 "romney":"Mitt Romney", "clinton":"Hillary Clinton", "biden":"Joe Biden",
 "jorgensen":"Jo Jorgensen", "oliver":"Chase Oliver"
}
HEADERS={"User-Agent":"Decision2028Simulator/1.0 (historical portrait import)"}

def fetch(url):
 for attempt in range(4):
  req=urllib.request.Request(url,headers=HEADERS)
  try:
   with urllib.request.urlopen(req,timeout=30) as response:return response.read()
  except urllib.error.HTTPError as error:
   if error.code!=429 or attempt==3:raise
   time.sleep(3*(attempt+1))

def main():
 OUT.mkdir(parents=True,exist_ok=True); manifest={}
 for slug,title in PEOPLE.items():
  destination=OUT/(slug+".jpg")
  if destination.exists():
   manifest[slug]={"candidate":title,"page":"https://en.wikipedia.org/wiki/"+title.replace(" ","_"),"sourceImage":"downloaded in prior batch"}
   continue
  query=urllib.parse.urlencode({"action":"query","titles":title,"prop":"pageimages","piprop":"thumbnail","pithumbsize":900,"format":"json","formatversion":2})
  payload=json.loads(fetch("https://en.wikipedia.org/w/api.php?"+query))
  page=payload["query"]["pages"][0]; source=page.get("thumbnail",{}).get("source")
  if not source:raise RuntimeError("No Wikipedia lead image for "+title)
  image=Image.open(io.BytesIO(fetch(source))).convert("RGB"); width,height=image.size
  if height>=width:box=(0,0,width,width)
  else:
   left=(width-height)//2; box=(left,0,left+height,height)
  image.crop(box).resize((384,384),Image.Resampling.LANCZOS).save(destination,quality=90,optimize=True)
  manifest[slug]={"candidate":title,"page":"https://en.wikipedia.org/wiki/"+title.replace(" ","_"),"sourceImage":source}
  time.sleep(1.25)
 with (OUT/"sources.json").open("w",encoding="utf-8") as handle:json.dump(manifest,handle,indent=2)
 print("Fetched",len(manifest),"historical portraits")

if __name__=="__main__":main()
