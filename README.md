# gola

## Install

Using `virtualenvwrapper` is recommended.

```
pip install virtualenvwrapper
mkvirtualenv gola
pip install -r requirements.txt
```

Then, whenever you work on this project:

```
workon gola
```

## Local settings

If you need to add machine-dependent settings like db password,

```
cd gola/gola/settings
cp local.py.template local.py
```

Then add settings to `local.py`.

## Run

```
cd gola
./manage.py runserver 0.0.0.0:8000
```

