# Plan layouts rollback

The last main commit before the optional Plan layouts release is
`99eb49d9c45586c2282ecc01caa0acdef17d3e8f`. It is preserved on the remote branch
`rollback/pre-plan-layouts-2026-10-08`.

Release: Original (default), Quick Call, Coaching Board, Formation First, and
visible pressure status. The complete release is merged with a single squash
commit titled **Add optional Plan layouts and visible pressure status**.

## Roll back this release

1. Find the squash commit in the merged release PR or main history.
2. Revert that commit on a new branch based on current main. This preserves
   unrelated later commits; resolve any conflicts against later Plan changes.
3. Merge the revert PR to main. The normal test, audit, build and GitHub Pages
   workflow redeploys the previous behavior. Confirm successful deployment and
   reload the site.

Example commands, substituting the actual release commit SHA:

```sh
git fetch origin
git switch -c rollback/plan-layouts origin/main
git revert <release-squash-commit-sha>
git push -u origin rollback/plan-layouts
```

Open a PR from that branch to main and merge after checks pass. Do not force
reset main to the backup: a revert keeps the release and any subsequent work
in history. The backup branch is a reference point, not a deployment trigger.

This release does not migrate saved scouts, teams or call logs. Its only new
saved preference is `sb_plan_layout`; rolling back leaves that preference
unused. Switching to Original is also available without rolling back.
