"""
Entry point for MediaDC tasks python module.
"""

import argparse
import os
import signal
import sys

import db
import task
from install import extend_module_path

# @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
#
# @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
#
# @author 2021 Alexander Piskun <bigcat88@icloud.com>
#
# @license AGPL-3.0-or-later
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


def signal_handler(signum=None, _frame=None):
    """Ideally we want gracefully shutdown to be able to free task we working on."""
    print("Got signal:", signum)
    sys.exit(0)


if __name__ == "__main__":
    for sig in [signal.SIGINT, signal.SIGQUIT, signal.SIGTERM, signal.SIGHUP]:
        signal.signal(sig, signal_handler)
    print(f"Started with pid={os.getpid()}")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    extend_module_path()
    errors = db.check_db()
    if errors:
        print(*errors, sep="\n")
        sys.exit(1)
    parser = argparse.ArgumentParser(description="Module for comparing media for content difference.", add_help=True)
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "-t",
        dest="task",
        type=int,
        action="append",
        help="Process task with specified ID. Can be specified multiply times.",
    )
    group.add_argument("-a", dest="all", action="store_true", help="Process all unfinished tasks.")
    args = parser.parse_args()
    if args.all or args.task:
        tasks_to_process = db.get_tasks()
        if args.task is not None:
            tasks_to_process = list(filter(lambda row: row["id"] in args.task, tasks_to_process))
            missing_tasks = list(filter(lambda r: not any(row["id"] == r for row in tasks_to_process), args.task))
            for x in missing_tasks:
                print(f"Cant find task with id={x}")
        for x in tasks_to_process:
            task.process(x, not args.all)
    else:
        parser.print_help()
    sys.exit(0)
