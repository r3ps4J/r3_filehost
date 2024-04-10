# r3_filehost

Simple resource allowing you to host files directly on FXServer. Meant to be used with phone scripts that upload image/video/audio files.

## Configuration

Configuration is done through convars. The following convars are available:

| convar | type | default | description |
| - | - | - | - |
| filehost_uploadsPath | string | `<resource path>/uploads` | Path to store uploaded files. Must be absolute. Files are stored in `uploads` folder in the resource folder by default.|
| filehost_apiKey | string | `false` | Api key needed for uploading files. Set to `false` to disable. If set, must be provided in `X-API-Key` header when uploading files.|

Example `server.cfg`:

```ini
# Save uploads to filehost_uploads folder on root of C drive.
set filehost_uploadsPath "C:\filehost_uploads"

# Disable api key requirement.
set filehost_apiKey "false"
```
