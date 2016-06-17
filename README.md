# gola

## Install Python environment

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

## Install MongoDB

- Ubuntu: <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/>
- OS X: <https://docs.mongodb.com/v3.0/tutorial/install-mongodb-on-os-x/>

## Setting up webpack

```
cd gola
npm init
npm install
```

## Local settings

If you need to add machine-dependent settings like db password,
DO NOT modify `base.py` directly. Instead,

```
cd gola/gola/settings
cp local.py.template local.py
```

Then add settings to `local.py`.

## Run

```
cd gola
./node_modules/.bin/webpack --config webpack.config.js
./manage.py runserver 0.0.0.0:8000
```

