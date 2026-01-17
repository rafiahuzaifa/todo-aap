"""Validation error exception for input validation failures."""


class ValidationError(Exception):
    """
    Raised when user input fails validation.
    
    Used for validation failures such as:
    - Empty or too long title
    - Invalid description length
    - Invalid task ID format
    - Any other input validation failure
    """

    def __init__(self, message: str) -> None:
        """
        Initialize ValidationError.
        
        Args:
            message: Descriptive error message for the validation failure
        """
        self.message = message
        super().__init__(self.message)
