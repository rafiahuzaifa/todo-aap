"""Menu rendering for console application."""


def display_menu() -> None:
    """Display main menu options."""
    print("\n" + "=" * 50)
    print("EVOLUTION OF TODO - Phase 1 Console")
    print("=" * 50)
    print("\n[A]dd task")
    print("[L]ist tasks")
    print("[V]iew task details")
    print("[U]pdate task")
    print("[D]elete task")
    print("[C]omplete task")
    print("[Q]uit")
    print("-" * 50)


def display_filter_menu() -> None:
    """Display filter options for list command."""
    print("\nFilter by status:")
    print("[A] All tasks")
    print("[P] Pending tasks")
    print("[C] Completed tasks")
    print("-" * 50)


def display_sort_menu() -> None:
    """Display sort options for list command."""
    print("\nSort by:")
    print("[C] Created date")
    print("[T] Title")
    print("[U] Updated date")
    print("-" * 50)


def display_direction_menu() -> None:
    """Display sort direction options."""
    print("\nSort direction:")
    print("[A] Ascending")
    print("[D] Descending")
    print("-" * 50)
