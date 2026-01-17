"""Formatting utilities for CLI output."""

from typing import List
from ..models import Task


def format_table(headers: List[str], rows: List[List[str]]) -> str:
    """
    Format table output with aligned columns.
    
    Args:
        headers: Column header names
        rows: List of rows (each row is list of strings)
        
    Returns:
        Formatted table string
    """
    if not headers:
        return ""
    
    if not rows:
        # Just show headers with no data
        header_row = " | ".join(headers)
        separator = "-" * len(header_row)
        return f"{header_row}\n{separator}"
    
    # Calculate column widths
    widths = [len(h) for h in headers]
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(cell))
    
    # Build header
    formatted_headers = []
    for i, h in enumerate(headers):
        formatted_headers.append(h.ljust(widths[i]))
    header_row = " | ".join(formatted_headers)
    separator = "-" * len(header_row)
    
    # Build rows
    formatted_rows = []
    for row in rows:
        formatted_cells = []
        for i, cell in enumerate(row):
            formatted_cells.append(str(cell).ljust(widths[i]))
        formatted_rows.append(" | ".join(formatted_cells))
    
    result = f"{header_row}\n{separator}\n"
    result += "\n".join(formatted_rows)
    return result


def format_task_brief(task: Task) -> str:
    """
    Format task as single line summary.
    
    Args:
        task: Task to format
        
    Returns:
        Brief task representation
    """
    status = "[X]" if task.completed else "[ ]"
    return f"{status} {task.id[:8]}... | {task.title}"


def format_task_detailed(task: Task) -> str:
    """
    Format task with all details.
    
    Args:
        task: Task to format
        
    Returns:
        Detailed task representation
    """
    status = "COMPLETED" if task.completed else "PENDING"
    lines = [
        f"ID: {task.id}",
        f"Title: {task.title}",
        f"Description: {task.description if task.description else '(none)'}",
        f"Status: {status}",
        f"Created: {task.created_at.strftime('%Y-%m-%d %H:%M:%S')} UTC",
        f"Updated: {task.updated_at.strftime('%Y-%m-%d %H:%M:%S')} UTC",
    ]
    return "\n".join(lines)


def format_error(message: str) -> str:
    """
    Format error message.
    
    Args:
        message: Error message
        
    Returns:
        Formatted error
    """
    return f"ERROR: {message}"


def format_success(message: str) -> str:
    """
    Format success message.
    
    Args:
        message: Success message
        
    Returns:
        Formatted success
    """
    return f"SUCCESS: {message}"
