#!/usr/bin/env python3
"""Extract visible text from all SubtitleOps pages for SEO audit."""

import re
import urllib.request

PAGES = [
    ("/", "首页 /", "subtitle"),
    ("/tools/ass-to-srt", "/tools/ass-to-srt", "ass to srt"),
    ("/tools/vtt-to-srt", "/tools/vtt-to-srt", "vtt to srt"),
    ("/tools/txt-to-srt", "/tools/txt-to-srt", "txt to srt"),
    ("/tools/srt-to-vtt", "/tools/srt-to-vtt", "srt to vtt"),
    ("/tools/srt-to-txt", "/tools/srt-to-txt", "srt to txt"),
]

def extract_text(html):
    # Remove script/style/head
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.S)
    html = re.sub(r'<head[^>]*>.*?</head>', '', html, flags=re.S)

    # Mark headings
    html = re.sub(r'<h1[^>]*>', '\n\n**[H1]** ', html)
    html = re.sub(r'</h1>', '\n', html)
    html = re.sub(r'<h2[^>]*>', '\n\n**[H2]** ', html)
    html = re.sub(r'</h2>', '\n', html)
    html = re.sub(r'<h3[^>]*>', '\n\n**[H3]** ', html)
    html = re.sub(r'</h3>', '\n', html)

    # Table cells
    html = re.sub(r'<th[^>]*>', ' | ', html)
    html = re.sub(r'<td[^>]*>', ' | ', html)
    html = re.sub(r'</tr>', ' |\n', html)

    # Block elements to newlines
    for tag in ['div','section','p','li','br','hr','button','header','footer','nav','main','article','table','thead','tbody','ol','ul','pre']:
        html = re.sub(f'<{tag}[^>]*>', '\n', html)
        html = re.sub(f'</{tag}>', '', html)

    # Remove remaining tags
    text = re.sub(r'<[^>]+>', '', html)

    # Clean entities
    for old, new in [('&amp;','&'),('&lt;','<'),('&gt;','>'),('&quot;','"'),('&#x27;',"'"),('&middot;','·'),('&copy;','©'),('&#39;',"'")]:
        text = text.replace(old, new)

    lines = [l.strip() for l in text.split('\n') if l.strip()]
    return '\n'.join(lines)

def count_words(text):
    return len([w for w in text.split() if any(c.isalpha() for c in w)])

output = []
output.append("# SubtitleOps 全站页面原文内容（逐段）")
output.append("")
output.append("**导出日期**: 2026-03-19")
output.append("**说明**: 每个页面的完整SSR渲染可见文字，含H标签标注。用于人工评审SEO内容质量。")
output.append("")
output.append("---")
output.append("")

for url, label, kw in PAGES:
    try:
        resp = urllib.request.urlopen(f"http://localhost:3456{url}")
        html = resp.read().decode('utf-8')
    except:
        output.append(f"## {label}\n\n**ERROR: Could not fetch page**\n\n---\n")
        continue

    text = extract_text(html)
    wc = count_words(text)
    kw_count = text.lower().count(kw)

    output.append(f"## {label}")
    output.append("")
    output.append(f"| 指标 | 值 |")
    output.append(f"|------|-----|")
    output.append(f"| 词数 | **{wc}** |")
    output.append(f"| 主关键词 | \"{kw}\" |")
    output.append(f"| 关键词出现次数 | **{kw_count}** 次 |")
    output.append("")
    output.append("### 页面原文")
    output.append("")
    output.append("```text")
    output.append(text)
    output.append("```")
    output.append("")
    output.append("---")
    output.append("")

with open("/Users/jasperchou/subtitle-tools-project/SEO_FULL_PAGE_CONTENT.md", "w") as f:
    f.write('\n'.join(output))

print(f"Done. Total lines: {len(output)}")
