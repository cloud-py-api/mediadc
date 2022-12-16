from nc_py_api import CONFIG


class Tables:
    @property
    def tasks(self):
        return CONFIG["dbtprefix"] + "mediadc_tasks"

    @property
    def tasks_details(self):
        return CONFIG["dbtprefix"] + "mediadc_tasks_details"

    @property
    def photos(self):
        return CONFIG["dbtprefix"] + "mediadc_photos"

    @property
    def videos(self):
        return CONFIG["dbtprefix"] + "mediadc_videos"

    @property
    def settings(self):
        return CONFIG["dbtprefix"] + "mediadc_settings"


MDC_TABLES = Tables()
