"""
FFMPEG/FFPROBE call helper functions.
"""

import json
import subprocess
import re

FF_DEBUG = 0

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


def stub_call_ff(app_name: str, *params, stdin_data: bytes = None, ignore_errors: bool = False):
    """Calls ffmpeg/probe and if error returns: None, error_string. Otherwise returns: value from subprocess.run, ''."""
    try:
        result = subprocess.run(
            [app_name, *params], stderr=subprocess.PIPE, stdout=subprocess.PIPE, input=stdin_data, check=True
        )
        errors = result.stderr.decode("utf-8")
        if FF_DEBUG == 1:
            print("stderr:", errors)
            if app_name != "ffmpeg":
                print("stdout:", result.stdout.decode("utf-8"))
        if ignore_errors and len(result.stdout):
            return result, ""
        if len(errors):
            return None, f"{app_name} return errors: {errors}"
        return result, ""
    except subprocess.CalledProcessError as exception_info:
        return None, f"{app_name} raised process error: {str(exception_info)}"
    except Exception as exception_info:
        return None, f"{app_name} raised {type(exception_info).__name__}: {str(exception_info)}"


def check_ff_app(app: str) -> bool:
    """Returns non empty str if error, otherwise returns empty string and tuple with version of ffmpeg/probe."""
    result, err = stub_call_ff(app, "-version")
    if err:
        return False
    full_reply = result.stdout.decode("utf-8")
    if re.search(app + r"\sversion\s", full_reply, flags=re.MULTILINE + re.IGNORECASE) is not None:
        return True
    print(f"Cant parse {app} version: {full_reply}")
    return False


def ffprobe_parse_results(proc_result) -> dict:
    """From `ffprobe` proc.stdout returns duration. If error during parse, then returns duration=0."""
    try:
        video_info = json.loads(proc_result.stdout.decode("utf-8"))
        duration = video_info["format"]["duration"]
        return {"duration": int(float(duration) * 1000)}
    except (ValueError, TypeError, KeyError):
        return {"duration": 0}


def is_moov_at_start(std_log) -> bool:
    """Parses ffprobe output when it called with loglevel=trace and return True if `moov` header is at start of file."""
    trace_log = std_log.decode("utf-8")
    moov_match = re.search(r"(type:\s*\'moov\')", trace_log, re.IGNORECASE)
    mdat_match = re.search(r"(type:\s*\'mdat\')", trace_log, re.IGNORECASE)
    if (moov_match is None) or (mdat_match is None):
        return True
    if moov_match.span()[0] < mdat_match.span()[0]:
        return True
    return False


def ffprobe_get_video_info(path, data) -> dict:
    """Accepts path(bytes/str) or data. Returns {} or {duration:X ms}. For data input also returns `fast_start` flag."""
    if path is not None:
        result, err = stub_call_ff(
            "ffprobe",
            "-hide_banner",
            "-loglevel",
            "fatal",
            "-print_format",
            "json",
            "-show_entries",
            "format=duration",
            path,
        )
    elif data is not None:
        result, err = stub_call_ff(
            "ffprobe",
            "-hide_banner",
            "-loglevel",
            "trace",
            "-print_format",
            "json",
            "-show_entries",
            "format=duration",
            "-i",
            "pipe:0",
            stdin_data=data,
            ignore_errors=True,
        )
    else:
        raise ValueError("`path` or `data` argument must be specified.")
    if err:
        print(err)
        return {}
    ret = ffprobe_parse_results(result)
    if path is None:
        if ret["duration"] != 0:
            ret["fast_start"] = is_moov_at_start(result.stderr)
    return ret
