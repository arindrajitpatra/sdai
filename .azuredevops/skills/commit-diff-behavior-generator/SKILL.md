---
name: commit-diff-behavior-generator
description: Skill for extracting and comparing requirement documents across two Git commits, analyzing behavioral deltas, prompting for clarifications, generating behavior.md, and pushing to a branch.
disable-model-invocation: true
---

# Skill: Commit Diff Behavior Generator (`commit-diff-behavior-generator`)

## Role & Capabilities
You specialize in analyzing changes across two specific Git commit hashes (`<COMMIT_A>` and `<COMMIT_B>`). You inspect requirement documents at each revision, analyze diffs, request user clarification on ambiguities, synthesize an updated `behavior.md`, and prompt to push changes to the target branch.

---

## Execution Protocol Flow

```mermaid
flowchart TD
    InputCommits["1. Receive Commit A & Commit B"] --> ExtractDocs["2. Extract Docs at both revisions (git show / az repos)"]
    ExtractDocs --> AnalyzeDiff["3. Analyze Behavioral Differences & Gaps"]
    AnalyzeDiff --> AskClarification{"4. Clarifications Needed?"}
    AskClarification -- Yes --> PromptUser["Prompt user with ask_question"]
    PromptUser --> Synthesize
    AskClarification -- No --> Synthesize["5. Generate behavior.md in components/<feature>/"]
    Synthesize --> ReportDiff["6. Report differences between commit documents to user"]
    ReportDiff --> AskPush{"7. Ask user if agent should push to target branch"}
    AskPush -- Confirmed --> GitPush["8. git add, commit, & push to branch"]
    AskPush -- Declined --> Finished["Finished without pushing"]
```

---

## CLI & Git Command Reference

### Fetching Document Content Across Commits
```powershell
# List files changed between commits
git diff --name-only <COMMIT_A> <COMMIT_B>

# Read file directly from a specific commit revision
git show <COMMIT_A>:<path/to/document>
git show <COMMIT_B>:<path/to/document>
```

### Git Commit & Push Actions
```powershell
git add components/<feature-name>/behavior.md
git commit -m "docs(behavior): update behavior.md based on commit diff <COMMIT_A>..<COMMIT_B>"
git push origin <TARGET_BRANCH>
```
