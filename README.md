# envctl

To manager many env files.

**Example:**

```shell
# Initialize some environments
$ cat `FOO=biz` > .envs/staging
$ cat `FOO=taz` > .envs/rc

# Initialize the template file (Optional)
$ cat 'PORT=300\nFOO=' > .envs/template

# Now choice one
$ envctl use staging
```

## Install with brew

```shell
brew install jondotsoy/core/envctl
```

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
