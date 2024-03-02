# envctl

To manager many env files.

## Guide

1. Make your sources write many `.envs/<source_name>` files.
2. Write your template on `.env.template`

**Example:**

```
# find .*
.env.template
.env.staging
.envs/rc1
.envs/rc2
```

3. Now run the next command `envctl use <staging|rc1|rc2>` to write the final `.env` file and enjoy.
