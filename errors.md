
```sh
  File "/usr/lib/python3.10/threading.py", line 1016, in _bootstrap_inner
    self.run()
  File "/usr/lib/python3.10/threading.py", line 953, in run
    self._target(*self._args, **self._kwargs)
  File "/home/cwilvx/code/alice-core/app/functions.py", line 37, in run_checks
    CreateAlbums()
  File "/home/cwilvx/code/alice-core/app/lib/populate.py", line 92, in __init__
    a = self.create_album(album)
  File "/home/cwilvx/code/alice-core/app/lib/populate.py", line 148, in create_album
    album = create_album(track)
  File "/home/cwilvx/code/alice-core/app/lib/albumslib.py", line 151, in create_album
    img_p = get_album_image(track)
  File "/home/cwilvx/code/alice-core/app/lib/albumslib.py", line 109, in get_album_image
    success = taglib.extract_thumb(track.filepath, webp_path=img_p)
  File "/home/cwilvx/code/alice-core/app/lib/taglib.py", line 46, in extract_thumb
    img = Image.open(BytesIO(album_art))
  File "/home/cwilvx/.cache/pypoetry/virtualenvs/alice_server-kcHojEf4-py3.10/lib/python3.10/site-packages/PIL/Image.py", line 3123, in open
    raise UnidentifiedImageError(
PIL.UnidentifiedImageError: cannot identify image file <_io.BytesIO object at 0x7fc9b4557510>
```