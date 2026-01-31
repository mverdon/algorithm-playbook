#!/bin/bash

set -e

copilot -p "@plans/prd.json @plans/progress.txt \
1. Setup tasks are always done first. \
2. Find the highest-priority task to work on and work only on that task. \
This should be the one YOU decide has the highest priority - not necessarily the first in the list. \
3. Check that the types check via npm run typecheck and that the tests pass via npm run test. \
4. Update the PRD with the work that was done. \
5. Append your progress to the progress.txt file. \
Use this to leave a note for the next person working in the codebase. \
6. Make a git commit of that task. \
ONLY WORK ON A SINGLE TASK. \
If, while implementing the task, you notice the PRD is complete, output <promise>COMPLETE</promise>. \
NEVER OUTPUT <promise>COMPLETE</promise> UNLESS THE PRD IS ACTUALLY COMPLETE. \
" --allow-all-tools
