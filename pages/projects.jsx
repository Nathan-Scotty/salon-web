import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { posts as postsApi } from '../lib/api';
import styles from '../styles/Gallery.module.css';

export default function GalleryPage() {
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi.getAll(true)
      .then(setPostList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}><FormattedMessage id="gallery.eyebrow" /></p>
        <h1 className={styles.title}><FormattedMessage id="gallery.title" /></h1>
        <p className={styles.subtitle}><FormattedMessage id="gallery.sub" /></p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      {loading && <p className={styles.loading}><FormattedMessage id="gallery.loading" /></p>}
      {!loading && postList.length === 0 && (
        <p className={styles.empty}><FormattedMessage id="gallery.empty" /></p>
      )}

      {!loading && postList.length > 0 && (
        <div className={styles.grid}>
          {postList.map((post) => {
            const firstMedia = post.media?.[0];
            return (
              <div key={post.id} className={styles.post}>
                <div className={styles.mediaWrap}>
                  {firstMedia ? (
                    firstMedia.type === 'VIDEO' ? (
                      <video src={firstMedia.url} controls />
                    ) : (
                      <img src={firstMedia.url} alt={firstMedia.altText || post.title || 'Gallery image'} />
                    )
                  ) : (
                    <div className={styles.noMedia}><FormattedMessage id="gallery.noMedia" /></div>
                  )}
                </div>
                <div className={styles.postBody}>
                  {post.title && <h3 className={styles.postTitle}>{post.title}</h3>}
                  {post.caption && <p className={styles.postCaption}>{post.caption}</p>}
                  <div className={styles.postMeta}>
                    <span>{post.author?.name}</span>
                    <span className={styles.dot} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
