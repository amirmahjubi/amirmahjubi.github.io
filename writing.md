---
layout: page
title: Writing
eyebrow: Notes
subtitle: Essays and field notes on building AI systems that ship.
permalink: /writing/
---

<ul class="post-list writing-archive">
  {% for post in site.posts %}
    <li class="post-list__item">
      <a class="post-list__link" href="{{ post.url | relative_url }}">
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %Y" }}</time>
        <span class="post-list__title">{{ post.title }}</span>
        {% if post.description %}
          <span class="post-list__desc">{{ post.description }}</span>
        {% endif %}
      </a>
    </li>
  {% else %}
    <li>
      <p>No posts yet — check back soon.</p>
    </li>
  {% endfor %}
</ul>
