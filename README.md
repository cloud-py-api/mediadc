# Nextcloud MediaDC

**📸📹 Collect photo and video duplicates to save your cloud storage**

![Home page](/screenshots/screenshot.png)
Nextcloud Media Duplicate Collector application

## Why is this so awesome?

* **♻ Delete a huge amount of duplicate photos/videos with different resolutions, sizes and formats**
* **💡 Easily save your cloud storage space and time for sorting**
* **⚙ Flexible configuration**

## 🚀 Installation

In your Nextcloud, simply enable the MediaDC app through the Apps management
and configure application dependencies on Configuration page (only for administrators).
The Nextcloud MediaDC app is only included in nextcloud v21 and higher.

## Maintainers

* [Andrey Borysenko](https://github.com/andrey18106)
* [Alexander Piskun](https://github.com/bigcat88)

If you'd like to join, just go through the [issues list](https://github.com/andrey18106/mediadc/issues) and fix some!

## 🏗 Development setup

To start working on frontend follow this steps:

1. ☁ Clone this into your `apps` folder of your Nextcloud.
1. 👩‍💻 In a terminal, run the command `make dev-setup` to install the dependencies.
1. 🏗 Then to build the frontend application run `make build-js` (builds Vue application in production mode), or watch changes with: `make watch-js` (in development mode).
1. ✅ Enable the app through the app management of your Nextcloud.
1. 💻 Fix easily linting issues with `npm run lint:fix`.
