import re

with open("CV_Harsh_Raj_12309410.pdf", "rb") as f:
    data = f.read()
    uris = re.findall(b'/URI \((.*?)\)', data)
    urls = [u.decode('utf-8', errors='ignore') for u in set(uris)]
    print("Found URLs:")
    for u in urls:
        print(u)
