"""Task-related error exceptions."""


class TaskNotFoundError(Exception):
    """
    Raised when a task cannot be found in the store.
    
    Used when attempting to:
    - Update a non-existent task
    - Delete a non-existent task
    - Get a non-existent task
    """

    def __init__(self, task_id: str) -> None:
        """
        Initialize TaskNotFoundError.
        
        Args:
            task_id: The ID of the task that was not found
        """
        self.task_id = task_id
        self.message = f"Task not found: {task_id}"
        super().__init__(self.message)
