# SPECIFICATION: Console CLI Interface

**Specification Name:** Console CLI Interface  
**Specification ID:** console-cli  
**Version:** 1.0.0  
**Phase:** 1 (Console)  
**Status:** READY  
**Author:** AI Code Generator  
**Created:** January 17, 2026  
**Modified:** January 17, 2026  

---

## 1. OVERVIEW

This specification defines the user-facing console interface for the Phase 1 Todo application. The interface provides an interactive menu-driven experience for managing tasks through a command-line interface.

### Scope

- Interactive menu-driven CLI
- Command input and parsing
- User feedback and output formatting
- Error messaging and recovery
- Session management

### Out of Scope

- Persistence (handled by storage specification)
- Authentication (Phase 2)
- Scripting or batch mode (future phases)
- Remote access (Phase 2+)

---

## 2. UX REQUIREMENTS

### 2.1 Interaction Model

The console interface operates as an interactive menu loop:

1. Display main menu
2. Prompt user for command input
3. Execute selected command
4. Display command results
5. Return to step 1

**No exit condition except explicit quit command.**

### 2.2 Main Menu

The main menu displays available commands and accepts single-character input.

```
╔════════════════════════════════════════╗
║      Evolution of Todo - Phase 1       ║
║          Console Interface             ║
╚════════════════════════════════════════╝

[A]dd Task
[L]ist Tasks  
[V]iew Task Details
[U]pdate Task
[D]elete Task
[C]omplete Task
[Q]uit

Enter command (A/L/V/U/D/C/Q): _
```

#### Menu Properties
- Display once per session
- Display again after each command execution
- Input validation: Accept only valid command characters
- Case-insensitive input (accept 'a' or 'A')
- Invalid input: Prompt for retry without exiting

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Add Task (Command: A)

**Requirement:** FR-CLI-001-ADD

Prompt user to create a new task.

#### User Flow

```
Enter command: A

Task Title: Buy groceries
[Optional] Task Description (press Enter to skip): 
  Get milk, bread, eggs, coffee
Added task: Task #1
```

#### Prompts
| Prompt | Field | Validation | Default | Required |
|--------|-------|-----------|---------|----------|
| "Task Title: " | title | 1-200 chars, non-empty | — | Yes |
| "[Optional] Task Description: " | description | 0-2000 chars | Empty string | No |

#### Processing Steps
1. Display "Task Title: " prompt
2. Read user input, validate title
3. If invalid, show error and retry title input (max 3 attempts)
4. Display description prompt
5. Read user input (may be empty)
6. Call create_task(title, description)
7. Display success message with new task ID and title

#### Output Messages

**Success:**
```
✓ Added task #1: Buy groceries
```

**Error - Invalid Title (Empty):**
```
✗ Error: Title cannot be empty (1-200 characters)
Try again:
```

**Error - Invalid Title (Too Long):**
```
✗ Error: Title is too long (max 200 characters)
Try again:
```

**Error - Invalid Description (Too Long):**
```
✗ Error: Description is too long (max 2000 characters)
Try again:
```

**Error - Max Retries Exceeded:**
```
✗ Command cancelled after 3 failed attempts
```

#### Return Behavior
- On success: Return to main menu
- On max retries: Return to main menu
- On any error: Offer retry

---

### 3.2 List Tasks (Command: L)

**Requirement:** FR-CLI-002-LIST

Display all tasks in a formatted table.

#### User Flow

```
Enter command: L

Filter by status: [A]ll, [C]ompleted, [I]ncomplete (default: All) _

Sorting: [T]itle, [C]reated, [U]pdated (default: Created) _

[1] Buy groceries                [  ] Created: 2026-01-17 10:30
[2] Complete Phase 1 spec        [✓] Created: 2026-01-17 10:45
[3] Review pull requests         [  ] Created: 2026-01-17 11:00

Total: 3 tasks (1 completed, 2 incomplete)
```

#### Prompts
| Prompt | Options | Default | Required |
|--------|---------|---------|----------|
| "Filter by status: " | All/Completed/Incomplete | All | No |
| "Sorting: " | Title/Created/Updated | Created | No |

#### Processing Steps
1. Display filter options prompt
2. Read filter choice (case-insensitive)
3. Display sorting options prompt
4. Read sort choice (case-insensitive)
5. Call list_tasks() with filter and sort parameters
6. Format and display task table

#### Table Format

```
[ID] Title                       [Status] Created: Timestamp
─────────────────────────────────────────────────────────────
[1]  Task title here             [  ]     Created: 2026-01-17 10:30
[2]  Another task title          [✓]      Created: 2026-01-17 10:45
```

#### Column Details
- **ID** — 1-based counter for user reference
- **Title** — Truncated to 30 characters if longer (with "...")
- **Status** — "[✓]" if completed, "[  ]" if incomplete
- **Created** — ISO 8601 date and time

#### Empty List Behavior
```
No tasks found.
```

#### Return Behavior
- Return to main menu after displaying list

---

### 3.3 View Task Details (Command: V)

**Requirement:** FR-CLI-003-VIEW

Display full details of a single task.

#### User Flow

```
Enter command: V

Enter task ID (1-based): 1

Task #1: Buy groceries
─────────────────────────────────────
Description: Get milk, bread, eggs, coffee
Status: Incomplete
Created: 2026-01-17 10:30:45
Updated: 2026-01-17 10:30:45
```

#### Prompts
| Prompt | Field | Validation | Required |
|--------|-------|-----------|----------|
| "Enter task ID (1-based): " | task_id | Valid 1-based number | Yes |

#### Processing Steps
1. Display ID prompt
2. Read task ID from user
3. Convert 1-based ID to UUID (map display ID to actual task)
4. Call get_task(task_id)
5. Format and display task details

#### Output Format

```
Task #{display_id}: {title}
───────────────────────────────────────
Description: {description or "(none)"}
Status: Completed | Incomplete
Created: {ISO 8601 datetime}
Updated: {ISO 8601 datetime}
```

#### Error Messages

**Task Not Found:**
```
✗ Error: Task not found
```

**Invalid ID:**
```
✗ Error: Invalid task ID
```

#### Return Behavior
- Return to main menu after displaying task

---

### 3.4 Update Task (Command: U)

**Requirement:** FR-CLI-004-UPDATE

Modify an existing task's properties.

#### User Flow

```
Enter command: U

Enter task ID to update (1-based): 1

Current: Buy groceries
Update Title? [Y/n]: y
New Title: Go shopping for groceries

Update Description? [Y/n]: y
Current: Get milk, bread, eggs, coffee
New Description: Buy milk, bread, eggs, coffee, cheese

✓ Task updated successfully
```

#### Prompts
| Prompt | Field | Validation | Default | Required |
|--------|-------|-----------|---------|----------|
| "Enter task ID to update: " | task_id | Valid 1-based number | — | Yes |
| "Update Title? [Y/n]: " | update_title | Y/N | Y | No |
| "New Title: " | new_title | 1-200 chars if updating | — | Conditional |
| "Update Description? [Y/n]: " | update_desc | Y/N | Y | No |
| "New Description: " | new_desc | 0-2000 chars if updating | — | Conditional |

#### Processing Steps
1. Prompt for task ID
2. Validate task exists
3. For each field (title, description, completion):
   - Prompt user if they want to update
   - If yes, read new value and validate
   - If no, skip field
4. Call update_task() with provided fields
5. Display success message

#### Output Messages

**Success:**
```
✓ Task #{id} updated successfully
```

**Error - Task Not Found:**
```
✗ Error: Task not found
```

**Error - Invalid Input:**
```
✗ Error: Invalid title (must be 1-200 characters)
Try again or press Ctrl+C to cancel
```

#### Return Behavior
- Return to main menu after update

---

### 3.5 Delete Task (Command: D)

**Requirement:** FR-CLI-005-DELETE

Remove a task from the list.

#### User Flow

```
Enter command: D

Enter task ID to delete (1-based): 2

Task #2: "Complete Phase 1 spec"
Confirm deletion? (y/N): y

✓ Task deleted successfully
```

#### Prompts
| Prompt | Field | Validation | Default | Required |
|--------|-------|-----------|---------|----------|
| "Enter task ID to delete: " | task_id | Valid 1-based number | — | Yes |
| "Confirm deletion? (y/N): " | confirm | Y/N | N | Yes |

#### Processing Steps
1. Prompt for task ID
2. Retrieve and display task details for confirmation
3. Prompt for confirmation
4. If confirmed, call delete_task()
5. If not confirmed, abort with message

#### Output Messages

**Success:**
```
✓ Task deleted successfully
```

**Cancelled:**
```
✗ Deletion cancelled
```

**Error - Task Not Found:**
```
✗ Error: Task not found
```

#### Return Behavior
- Return to main menu after delete

---

### 3.6 Complete Task (Command: C)

**Requirement:** FR-CLI-006-COMPLETE

Mark a task as complete.

#### User Flow

```
Enter command: C

Enter task ID to complete (1-based): 1

Task #1: "Buy groceries"
Current Status: Incomplete
Mark as complete? (y/N): y

✓ Task marked as complete
```

#### Prompts
| Prompt | Field | Validation | Default | Required |
|--------|-------|-----------|---------|----------|
| "Enter task ID to complete: " | task_id | Valid 1-based number | — | Yes |
| "Mark as complete? (y/N): " | confirm | Y/N | N | Yes |

#### Processing Steps
1. Prompt for task ID
2. Retrieve task and display current status
3. Prompt for confirmation
4. If confirmed, call update_task(completed=True)
5. If not confirmed, abort

#### Output Messages

**Success:**
```
✓ Task marked as complete
```

**Already Complete:**
```
ℹ Task is already complete
```

**Cancelled:**
```
✗ Operation cancelled
```

**Error - Task Not Found:**
```
✗ Error: Task not found
```

#### Return Behavior
- Return to main menu after completion

---

### 3.7 Quit Application (Command: Q)

**Requirement:** FR-CLI-007-QUIT

Exit the application gracefully.

#### User Flow

```
Enter command: Q

Goodbye!
```

#### Processing Steps
1. Display farewell message
2. Exit application with code 0

#### Output
```
Goodbye!
```

#### Return Behavior
- Exit program

---

## 4. ERROR HANDLING

### 4.1 User Input Errors

| Error Type | Handling | User Message |
|-----------|----------|--------------|
| Invalid menu choice | Retry loop (3 attempts) | "Invalid command. Try again (A/L/V/U/D/C/Q)" |
| Invalid task ID | Retry loop (3 attempts) | "Invalid task ID. Please enter a valid number" |
| Invalid yes/no input | Default to 'n', continue | "Assuming 'no', continuing..." |
| Empty required field | Retry loop (3 attempts) | "Input required. Try again" |

### 4.2 System Errors

| Error Type | Handling | User Message |
|-----------|----------|--------------|
| Task not found | Display error, return to menu | "✗ Error: Task not found" |
| Validation error | Display error, retry input | "✗ Error: {validation_message}" |
| Unexpected error | Display error, return to menu | "✗ Unexpected error. Please try again" |

### 4.3 Error Recovery

- **Max retries exceeded** — Return to main menu
- **Fatal error** — Display error and return to main menu
- **User cancel (Ctrl+C)** — Gracefully exit with "Goodbye!"

---

## 5. UI/UX STANDARDS

### 5.1 Visual Design

- **Clear separation** — Blank lines between sections
- **Status indicators** — ✓ for success, ✗ for error, ℹ for info
- **Consistent formatting** — Table format for lists
- **Readable typography** — 80-character line limit
- **Color support** — Optional color output (can be disabled)

### 5.2 Accessibility

- **No ambiguous prompts** — Clear instructions
- **Default values shown** — [Default: X]
- **Case-insensitive input** — Accept upper/lowercase
- **Screen reader friendly** — Plain text output
- **Simple language** — No jargon, clear error messages

### 5.3 Command Abbreviations

All commands accept single-letter input (case-insensitive):

| Command | Accepts | Display |
|---------|---------|---------|
| Add | a/A | [A]dd Task |
| List | l/L | [L]ist Tasks |
| View | v/V | [V]iew Task Details |
| Update | u/U | [U]pdate Task |
| Delete | d/D | [D]elete Task |
| Complete | c/C | [C]omplete Task |
| Quit | q/Q | [Q]uit |

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance

| Operation | Target | Notes |
|-----------|--------|-------|
| Menu display | < 100ms | Render and wait for input |
| List 100 tasks | < 200ms | Format and display |
| User input processing | < 50ms | Parse and validate |

### 6.2 Reliability

- Commands never crash the application
- Invalid input never corrupts state
- All errors gracefully handled
- Session survives indefinitely until quit

### 6.3 Usability

- Single-character commands minimize typing
- Confirmation for destructive operations
- Clear feedback for all actions
- Consistent input prompts

---

## 7. DEPENDENCIES

### Specification Dependencies
- task-crud.md — Task CRUD operations

### External Dependencies
- Python 3.13+ standard library only
- typing (stdlib) — Type hints
- uuid (stdlib) — UUID handling for mapping
- datetime (stdlib) — Timestamp display

### Optional Dependencies
- colorama (optional) — Color output in console

---

## 8. GENERATED ARTIFACTS

These artifacts will be generated by Spec-Kit Plus:

```
backend/phase-1-console/
├── src/
│   ├── cli/
│   │   ├── __init__.py
│   │   ├── console.py             # Main CLI interface
│   │   ├── menu.py                # Menu rendering
│   │   ├── commands.py            # Command handlers
│   │   └── formatter.py           # Output formatting
│   └── __init__.py
└── tests/
    ├── __init__.py
    └── test_console_cli.py        # CLI integration tests
```

---

## 9. ACCEPTANCE CRITERIA

- ✅ Main menu displays all 7 commands
- ✅ Add command creates tasks with validation
- ✅ List command displays tasks in table format
- ✅ View command shows task details correctly
- ✅ Update command modifies task properties
- ✅ Delete command removes tasks with confirmation
- ✅ Complete command marks tasks as done
- ✅ Quit command exits gracefully
- ✅ All user input validated and sanitized
- ✅ Error messages are descriptive and actionable
- ✅ All commands return to main menu (except Quit)
- ✅ Application handles Ctrl+C gracefully
- ✅ No crashes on invalid input
- ✅ Performance targets met

---

## 10. AMENDMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 17, 2026 | Initial specification |

---

**Specification v1.0.0 — Ready for Code Generation**
