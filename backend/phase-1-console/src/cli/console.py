"""Main console CLI application."""

from ..services import TaskService
from .menu import display_menu, display_filter_menu
from .commands import CommandHandler


def run_console() -> None:
    """
    Run main console application loop.
    
    Displays menu, processes user commands, and maintains application state.
    """
    service = TaskService()
    handler = CommandHandler(service)
    
    print("\nWelcome to Evolution of Todo - Phase 1 Console")
    print("Type your command choice (A/L/V/U/D/C/Q)")
    
    while True:
        display_menu()
        choice = input("Choose command: ").strip().upper()
        
        if choice == "A":
            handler.add_task()
        
        elif choice == "L":
            # Show filter menu
            display_filter_menu()
            filter_choice = input("Choose filter: ").strip().upper()
            
            if filter_choice == "A":
                handler.list_tasks(completed=None)
            elif filter_choice == "P":
                handler.list_tasks(completed=False)
            elif filter_choice == "C":
                handler.list_tasks(completed=True)
            else:
                print("Invalid filter choice")
        
        elif choice == "V":
            task_id = input("Enter task ID: ").strip()
            handler.view_task(task_id)
        
        elif choice == "U":
            task_id = input("Enter task ID: ").strip()
            handler.update_task(task_id)
        
        elif choice == "D":
            task_id = input("Enter task ID: ").strip()
            handler.delete_task(task_id)
        
        elif choice == "C":
            task_id = input("Enter task ID: ").strip()
            handler.complete_task(task_id)
        
        elif choice == "Q":
            print("\nGoodbye!")
            break
        
        else:
            print("Invalid command. Please try again.")


if __name__ == "__main__":
    run_console()
