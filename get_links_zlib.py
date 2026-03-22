import zlib
import re

with open("CV_Harsh_Raj_12309410.pdf", "rb") as f:
    pdf = f.read()

streams = re.findall(b'stream[\r\n]+(.*?)[\r\n]*endstream', pdf, re.S)
print("Found", len(streams), "streams.")
urls = set()
for s in streams:
    try:
        decompressed = zlib.decompress(s)
        uris = re.findall(b'/URI \((.*?)\)', decompressed)
        for u in uris:
            urls.add(u.decode('utf-8', errors='ignore'))
    except Exception as e:
        pass

print("Extracted URLs:")
for u in urls:
    print(u)
