# Taken off the site, kept

The writing behind the pages marketing asked to be removed — Deep Dives,
Templates' neighbours in Build (Showcase, Capstones, Apps) and Editorial.

It is here rather than in `src/content` because everything under `src/content`
is compiled into the bundle whether or not a page renders it. Removing the pages
and leaving the files there would have kept shipping every one of these articles
to every visitor, for nothing.

Putting a collection back is moving its folder back and restoring its route.
Nothing else was changed: the frontmatter, the images and the authors are as
they were.
