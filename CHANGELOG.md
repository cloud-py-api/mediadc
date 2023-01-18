# Changelog

All notable changes to this project will be documented in this file.

## [0.3.3 - 2023-01-19]

[`cloud_py_api`](https://github.com/cloud-py-api/cloud_py_api) is **required** to be installed
(or updated) and enabled first.

### Added

- Added sha256 checksum of pre-compiled python binaries

### Fixed

- Fixed mediadc cli command (https://github.com/andrey18106/mediadc/issues/102)
- Fixed icon on folders context menu (https://github.com/andrey18106/mediadc/issues/104)

## [0.3.2 - 2022-12-23]

[`cloud_py_api`](https://github.com/cloud-py-api/cloud_py_api) is **required** to be installed
and enabled first.

### Added

- Added option to export task details results (https://github.com/andrey18106/mediadc/issues/60)

### Changed

- Changed settings list

## [0.3.1 - 2022-12-20]

### Fixed

- Fixed critical bug with db connection in binaries

## [0.3.0 - 2022-12-18]

This is the first release with part of Python framework (no need of Python installation).
MediaDC now requires [`cloud_py_api`](https://github.com/cloud-py-api/cloud_py_api) to be installed
and enabled first.

### Added

- Added automatic download of pre-compiled Python binaries with all needed packages for work
- Added option to use Python sources and manually installed system packages (except nextcloud snap)
instead of binaries (to use python sources refer docs)

### Changed

- Removed Configuration page

### Fixed

- Fixed MediaDC now working on snap installations
- Fixed NC OCC is not broken when MediaDC enabled (https://github.com/andrey18106/mediadc/issues/93)

## [0.3.0-beta.1 - 2022-11-30]

This is the first beta release with part of Python Framework (no need of Python installation)

### Added

- Added automatic download of pre-compiled Python binaries with all needed packages for work
- Added option to use Python sources and manually installed system packages (except nextcloud snap)
instead of binaries

### Changed

### Fixed

- Fixed MediaDC now working on snap installations

### Removed

- Removed Configuration page

## [0.2.0 - 2022-11-16]

This is the first release for Nextcloud 25+ (https://github.com/andrey18106/mediadc/issues/73).

### Added

- Added support for Nextcloud 25 version

### Changed

- Changed Nextcloud Vue components to the latest redesigned (NC25+)
- Changed database schema of the task details table, so **all existing tasks needs a restart**

### Fixed

## [0.1.10 - 2022-10-28]

This is the last version working on Nextcloud 21-24. The next major versions would be for 25.

### Added

- Added duplicate task option in context menu on tasks list item
- Added "go to page" pagination option (https://github.com/andrey18106/mediadc/issues/63)
- Added toggle groups open state button in duplicates list
- Added new "Resolved" page with processed media files (https://github.com/andrey18106/mediadc/issues/31)
- Added new Admin settings options: php_path, use_php_path_from_settings (https://github.com/andrey18106/mediadc/issues/64)
- Added new Files app folder context menu option "Scan for duplicates"
- Added support for `.nomedia` and `.noimage` ingore flags (https://github.com/andrey18106/mediadc/issues/61)

### Changed

- Changed numeration of items in duplicates list (https://github.com/andrey18106/mediadc/issues/38)
- Changed filtering, filtering by single duplicate group id and by range of ids (e.g. 1-10)
- Changed admin settings layout
- Changed data initialization mechanizm, added automatic applying of the init data changes to the database

### Fixed

- Fixed batch editing action "Select all on page" with sorted groups

## [0.1.9 - 2022-02-14]

### Added

- Added Task finish notification option
- Added Bug report section to Admin settings for quick system info collection

### Changed

- Boost package hexhamming was updated. Now available on arm8 cpu and on Alpine Linux too.

### Fixed

- Fixed Python error: Out of range value for column `duration` (https://github.com/andrey18106/mediadc/issues/47)
- Fixed error "ffmpeg not found" when it was builded from source (thanks for issue to @sergeng)
- Fixed connect error when using Nextcloud Docker with MariaDB (thanks for issue to @Bennneeeet)
- Fixed connect error in some situations when using PGSQL with socket (thanks for issue to @pricly-yellow)

## [0.1.8 - 2021-12-20]

Updated `python_command` setting from alias to full/absolute path to the Python. PHP-FPM users should check and update it on Administration settings page if install fails on Configuration page

### Added

- Added Duplicates list batch editing and filtering
- Added Duplicate group batch editing, filtering and sorting
- Added Some title hints to action buttons
- Added Items per page setting for duplicate groups
- Added Auto open of the next detail group option

### Changed

- Changed Default path to Python (if install fails silently or can't find Python, update `python_command` on Administration settings page)
- Changed Some backend&frontend mechanisms of requesting and working with files
- Changed Supported Nextcloud versions (21-23)

### Fixed

- Fixed Python work with user shared, webdav shares, local shares files scan
- Fixed Python `dbtableprefix` undefined
- Fixed Parsing Python output in PHP and displaying propper error messages
- Fixed Python `hexhamming` module caused `Illegal instruction` issue on unsupported CPUs

## [0.1.7 - 2021-10-30]

### Added

- Added php `exec` function availability check

### Changed

- Changed missed PHP version requirement from 7.4 to 7.3
- Moved MediaDC admin settings from Groupware tab to separate Administrator menu item
- Changed server errors messages and moved them to the Configuration page

### Fixed

- Fixed Python version validation fails

## [0.1.6 - 2021-10-22]

### Added

- Added Delete file confirmation setting (sidebar settings)

### Fixed

- Fixed MediaDC not working if specified another apps directory in Nextcloud config (apps_paths)
- Fixed MediaDC install fails on Configuration page on some server configs
- Changed function callbacks syntax to support PHP 7.3

## [0.1.5 - 2021-10-12]

### Added

- Added some action loaders on Details page
- Added links to the list of target directories

### Fixed

- Fixed video processing broken by previous update.
- Fixed pip version parsing, install now works with last pip.
- Fixed processing files from other NC instances and remote shares.

## [0.1.4 - 2021-10-09]

### Fixed

- Proper work with non ascii characters in files names. Thanks to kovge.
- Minor frontend fixes

## [0.1.3 - 2021-10-04]

### Fixed

- Now properly parse configs for database connect.

## [0.1.2 - 2021-09-30]

### Added

- Added image and video previews support

### Fixed

- Fixed not disabled buttons for impossible actions on Configuration page (update/delete on not installed packages)
- Now properly display installation errors

## [0.1.1 - 2021-09-26]

### Added

### Changed

### Fixed

- Fixed opening photo&video via Viewer in Nextcloud 21, 22

## [0.1.0 - 2021-09-23]

### Added

### Changed

- First beta release available at Nextcloud App Store

### Fixed
