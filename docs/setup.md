Setup instructions for creating documentation pages

1. Download [Github Desktop](https://desktop.github.com/)
2. Clone this repository on your local computer. Recommend using the path code/applications/kgjs.
3. Open a Terminal window (if you're on a mac) and type ``ruby -v``. This tells you your version of Ruby. If it's at least 2.1, you're good to go. Otherwise talk to Chris.
4. Still in terminal, go into your kgjs directory. Do this by opening that directory in finder, typing ``cd`` in Terminal, and then dragging the icon for the directory into Terminal.
5. Type ``sudo gem install bundler``
6. Type ``sudo bundle install``
7. Typd ``cd docs``
8. Type ``bundle exec jekyll serve`` and navigate to [localhost:4000](localhost:4000). You should see the Github pages!
