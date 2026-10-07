'use client';

import { useMemo, useState } from 'react';
import { PostCard } from '@/components/site/post-card';

export type PostCard = {
  slug: string;
  title: string;
  area: string;
  areaKey: string;
  description: string;
  readingTime: string;
};

export function BlogList({ posts }: { posts: PostCard[] }) {
  const filters = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of posts) if (!seen.has(p.areaKey)) seen.set(p.areaKey, p.area);
    return [{ key: 'todos', label: 'Todos' }, ...Array.from(seen, ([key, label]) => ({ key, label }))];
  }, [posts]);

  const [active, setActive] = useState('todos');
  const visible = posts.filter((p) => active === 'todos' || p.areaKey === active);

  return (
    <>
      <div className="filterbar" role="group" aria-label="Filtrar artigos por área">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-btn${active === f.key ? ' is-active' : ''}`}
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
