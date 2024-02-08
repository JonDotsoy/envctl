# envctl

## Guide

1. Make your sources write many `.env.<source_name>` files.
2. Write your template on `.env.template`

**Example:**

```
# find .*
.env.template
.env.staging
.env.rc1
.env.rc2
```

3. Now run the next command `envctl build --ctx <source_name>` to write the final `.env` file and enjoy.
