# import subprocess
# import sys
# from components.todo.todo_core import TodoCore


# class TodoTool:
#     def __init__(self):
#         self.__tc = TodoCore()
#         self.process = None

#     def get_todos(self):
#         return self.__tc.load_tasks()

#     def remove_todo(self, index):
#         return self.__tc.remove_task(index)

#     def add_todo(self, todo_date, todo_time, todo_text):
#         return self.__tc.add_task_core(todo_date, todo_time, todo_text)

#     def toggle_todo(self, index):
#         return self.__tc.toggle_task_core(index)

#     def open_ui(self):

#         # prevent multiple windows
#         if self.process is None or self.process.poll() is not None:
#             self.process = subprocess.Popen(
#                 [sys.executable, "-m", "components.todo.todo_ui"])

#     def close_ui(self):
#         if self.process and self.process.poll() is None:
#             self.process.terminate()   # closes UI

