# r3_filehost

Simple resource allowing you to host files directly on FXServer. Meant to be used with resources that upload image, video, or audio files.

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

## Configuration for resources

You will have to configure your resources to use this script. Files can be uploaded to the following route with these settings, make sure to replace the right information with your server information:

| | |
| - | - |
| Url | `https://user-code.users.cfx.re/r3_filehost/api/upload` |
| Headers | `Content-Type: multipart/form-data`<br>`X-API-Key: yourKeyIfSet` |
| Field | Can be anything, `file` is a good choice. |
