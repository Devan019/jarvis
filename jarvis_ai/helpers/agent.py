from .client import GroqClient
from const.prompt_template import SPEECH_TOOL_PROMPT
from tools.tools import TOOLS_SCHEMA, TOOL_MAP
import json

client = GroqClient().client


class Agent:

    def __init__(self):
        self.__model = "openai/gpt-oss-120b"
        self.__max_tries = 50

    # call llm
    def __get_groq_response(self, messages: list):
        return client.chat.completions.create(
            model=self.__model,
            messages=messages,
            tools=TOOLS_SCHEMA,
            tool_choice="auto"
        )

   # run agent
    def run_agent(self, user_input: str):
        messages = [
            {"role": "system", "content": SPEECH_TOOL_PROMPT},
            {"role": "user", "content": user_input}
        ]

        for i in range(self.__max_tries):
            # Get LLM response
            response = self.__get_groq_response(messages)
            msg = response.choices[0].message

            # If no tool, final answer
            if not msg.tool_calls:
                return msg.content

            # Add assistant message to history
            messages.append(msg)

            # Execute all tool calls
            for tool in msg.tool_calls:
                tool_name = tool.function.name
                args = json.loads(tool.function.arguments)

                # --- LOGGING START ---
                print(f"\n[Iteration {i+1}] 🛠️ Calling Tool: {tool_name}")
                print(f"Arguments: {json.dumps(args, indent=2)}")
                # --- LOGGING END ---

                tool_fn = TOOL_MAP.get(tool_name)

                if not tool_fn:
                    result = {"error": f"Tool {tool_name} not found"}
                else:
                    try:
                        result = tool_fn(**args)
                        # Optional: Log the result
                        print(f"✅ Result: {result}")
                    except Exception as e:
                        result = {"error": str(e)}
                        print(f"❌ Error executing {tool_name}: {e}")

                # Add tool result
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool.id,
                    "name": tool_name,  # Helpful for tracking
                    "content": json.dumps(result)
                })

        return "Max iterations reached"
