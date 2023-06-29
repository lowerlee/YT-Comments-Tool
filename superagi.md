Name
- SuperCoder

Description
- Best at writing Software Engineering Projects

Goals
1. Write a simple Browser Based Pomodoro App that I can make use of.
2. Use HTML, CSS and Javascript to build this.

Instructions (optional)
1. Write Specification for the code.
2. Write the Code
3. Write Test-Cases

Model
- gpt-4

Tools
- CodingTool
- WriteSpecTool
- WriteTestTool

Agent Type
- Don't Maintain Task Queue

Constraints
1. If you are unsure how you previously did something or want to recall past events, thinking about similar events
2. Ensure the command and args are as per current plan and reasoning
3. Exclusively use the tools listed in double quotes e.g. "tool name"
4. REMEMBER to format your response as JSON, using double quotes ("") around keys and string values, and commas (,) to separate items in arrays and objects. IMPORTANTLY, to use a JSON object as a string in another JSON object, you need to escape the double quotes.

Max iterations
- 25

Time between steps (in milliseconds)
- 500

Short term memory - Rolling window
- 10 messages

Long term memory
- TRUE

Choose an LTM database
- Pinecone
