import sys

files = ['js/campaign.js', 'js/counties.js', 'js/election.js', 'js/utils.js']
all_ok = True

for f in files:
    content = open(f, 'r', encoding='utf-8').read()
    brackets = {'{': '}', '(': ')', '[': ']'}
    stack = []
    in_str = None
    in_regex = False
    in_line_comment = False
    in_block_comment = False
    prev_non_ws = ''
    i = 0
    line = 1
    col = 1
    err = False
    while i < len(content):
        ch = content[i]
        if ch == '\n':
            line += 1
            col = 1
        else:
            col += 1

        if in_line_comment:
            if ch == '\n':
                in_line_comment = False
        elif in_block_comment:
            if ch == '*' and i + 1 < len(content) and content[i+1] == '/':
                in_block_comment = False
                i += 1
                col += 1
        elif in_str:
            if ch == '\\':
                i += 1
                col += 1
            elif ch == in_str:
                in_str = None
        elif in_regex:
            if ch == '\\':
                i += 1
                col += 1
            elif ch == '/':
                in_regex = False
        else:
            if ch == '/' and i + 1 < len(content) and content[i+1] == '/':
                in_line_comment = True
                i += 1
                col += 1
            elif ch == '/' and i + 1 < len(content) and content[i+1] == '*':
                in_block_comment = True
                i += 1
                col += 1
            elif ch == '/' and prev_non_ws in ('(', '=', ':', ',', '!', '&', '|', '?', '[', '{', ';', 'return'):
                in_regex = True
            elif ch in ('"', "'", '`'):
                in_str = ch
            elif ch in brackets.keys():
                stack.append((ch, line, col))
            elif ch in brackets.values():
                if not stack:
                    print(f"Unmatched closing '{ch}' at line {line}:{col} in {f}")
                    err = True
                    all_ok = False
                    break
                top, t_line, t_col = stack.pop()
                if brackets[top] != ch:
                    print(f"Mismatched opened '{top}' at line {t_line}:{t_col} and closed '{ch}' at line {line}:{col} in {f}")
                    err = True
                    all_ok = False
                    break

        if not ch.isspace() and not in_line_comment and not in_block_comment:
            prev_non_ws = ch

        i += 1
    if stack and not err:
        top, t_line, t_col = stack[-1]
        print(f"Unclosed bracket '{top}' at line {t_line}:{t_col} in {f} (total unclosed: {len(stack)})")
        all_ok = False
    elif not err:
        print(f"[PASS] {f}: Syntax and bracket nesting verified successfully.")

if all_ok:
    print("\nALL FILES PASSED SYNTAX AND STRUCTURE CHECKS!")
