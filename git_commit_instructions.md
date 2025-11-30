# Automated Commit Instructions for AI

The following instructions are used by the AI to automatically commit changes to the project. Commits are performed **per feature/related change**, based on **detected modifications**, using the **semantic commit** format plus **gitmoji**, with the entire message in **lowercase**.

---

## 🧠 General Rules

- Commits are grouped by **feature** or **related changes** (e.g., a feature implementation involving multiple files should be a single commit).
- Commit messages must:
  - Start with a **gitmoji**.
  - Follow the **semantic commit** pattern.
  - Be entirely in **lowercase**.
  - Be in **English**.
- If a set of changes includes multiple types (e.g., fix + docs), choose the **most significant** change type.

---

## 📦 Commit Message Format

```text
:gitmoji: type(scope): short description of changes

optional: additional description
```

### Examples

```text
:bug: fix(auth): fix expired token validation logic
```

```text
:sparkles: feat(ui): add new dropdown component and update styles
```

---

## 🧩 Semantic Commit List + Gitmoji

| Type | Gitmoji | Description |
|------|---------|-----------|
| feat | :sparkles: | new feature |
| fix | :bug: | bug fix |
| docs | :memo: | documentation changes |
| style | :art: | formatting/style changes without logic modification |
| refactor | :recycle: | code refactoring |
| perf | :zap: | performance improvement |
| test | :white_check_mark: | adding/modifying tests |
| chore | :wrench: | non-code changes (config, build, etc.) |
| ci | :construction_worker: | CI related changes |
| deps | :package: | dependency updates |

---

## 🔍 How AI Determines Commits

1. Identify the changed files.
2. Group related files into a single logical unit (e.g., frontend component + backend API for a new feature).
3. Analyze the type of change for the group.
4. Determine the most relevant semantic type.
5. Select the appropriate gitmoji.
6. Generate the commit message in **lowercase English**.
7. Commit the group of files with this message.

---

## 📝 Automated Commit Template (used by AI)

```text
for each logical group of changes:
    identify change type → determine type
    match with gitmoji
    generate message with format:
        :gitmoji: type(scope): short description in lowercase english
    commit the group of files with this message
```

---

## 🚀 Example AI Output

```text
:art: style(header): fix indentation and formatting in header.jsx
:bug: fix(api): resolve null error in response handler
:memo: docs(readme): add installation instructions
:sparkles: feat(auth): implement google login integration
```

---

If there are any parts you'd like to add or revise, let me know!

