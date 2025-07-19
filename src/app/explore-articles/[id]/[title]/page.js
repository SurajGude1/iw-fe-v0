'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStopwatch, faShare, faEye } from '@fortawesome/free-solid-svg-icons';
import FormatNumber from '@/app/components/global/format-number/format-number';
import { fetchPosts } from '@/app/services/get-apis';
import styles from './page.module.css';
import { GOLANG_API_BASE_URL } from '@/app/config/constants';

config.autoAddCss = false;

export default function Blog() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isHeartRed, setIsHeartRed] = useState(false);

    // 🔔 Track unique view
    const trackView = async (postId) => {
        try {
            await fetch(`${GOLANG_API_BASE_URL}/admin/posts/views`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            });
        } catch (err) {
            console.error('Error tracking view:', err);
        }
    };

    const toggleHeartColor = () => {
        setIsHeartRed(!isHeartRed);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const posts = await fetchPosts();

                if (!posts || !Array.isArray(posts)) {
                    throw new Error('Invalid data received from server');
                }

                const currentPost = posts.find(item => item.postId?.toString() === id);
                if (!currentPost) {
                    throw new Error('Post not found');
                }

                const recommended = posts
                    .filter(item => item.postId?.toString() !== id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 5);

                setPost(currentPost);
                setRecommendedPosts(recommended);

                // 📡 Call the view‑tracker API once we have the post
                await trackView(currentPost.postId);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchData, retryCount * 1000);
        return () => clearTimeout(timer);
    }, [id, retryCount]);

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    const createSlug = (title) => {
        return title?.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    };

    if (loading) {
        return (
            <div className={styles.BlogWrapper}>
                <div className={styles.Blog}>
                    <div className={`${styles.SkeletonTitle} ${styles.SkeletonShimmer}`}></div>
                    <div className={styles.SkeletonActions}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`${styles.SkeletonIconLabel} ${styles.SkeletonShimmer}`}></div>
                        ))}
                    </div>
                    <div className={`${styles.SkeletonContent} ${styles.SkeletonShimmer}`}></div>
                </div>
                <div className={styles.Recommended}>
                    <div className={`${styles.SkeletonRecommendedHeading} ${styles.SkeletonShimmer}`}></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={styles.SkeletonRecommendedCard}>
                            <div className={`${styles.SkeletonRecommendedImage} ${styles.SkeletonShimmer}`}></div>
                            <div className={`${styles.SkeletonRecommendedTitle} ${styles.SkeletonShimmer}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.BlogWrapper}>
                <div className={styles.Error}>
                    <p>{error}</p>
                    {retryCount < 3 ? (
                        <button
                            onClick={handleRetry}
                            className={styles.RetryButton}
                            disabled={loading}
                        >
                            {loading ? 'Retrying...' : 'Retry'}
                        </button>
                    ) : (
                        <div className={styles.ErrorHelp}>
                            <p>Still having trouble? Try again later or contact support.</p>
                            <Link href="/" className={styles.HomeLink}>Return to Home</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.BlogWrapper}>
                <div className={styles.Blog}>
                    <p>Post not found</p>
                    <Link href="/" className={styles.HomeLink}>Browse all articles</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.BlogWrapper}>
            <div className={styles.Blog}>
                <h1 className={styles.Title}>
                    {post.postTitle}
                </h1>
                <div className={styles.Actions}>
                    <div className={styles.IconLabel}>
                        <FontAwesomeIcon icon={faEye} className={styles.Icon} />
                        <span className={styles.Span}><FormatNumber value={post.views || 0} /></span>
                    </div>
                    <div className={styles.IconLabel} onClick={toggleHeartColor}>
                        <FontAwesomeIcon 
                            icon={faHeart} 
                            className={styles.Icon} 
                            style={{ color: isHeartRed ? 'var(--coke-red)' : 'white' }} 
                        />
                        <span className={styles.Span}><FormatNumber value={post.likes || 0} /></span>
                    </div>
                    <div className={styles.IconLabel}>
                        <FontAwesomeIcon icon={faShare} className={styles.Icon} />
                        <span className={styles.Span}><FormatNumber value={post.shares || 0} /></span>
                    </div>
                    <div className={styles.IconLabel}>
                        <FontAwesomeIcon icon={faStopwatch} className={styles.Icon} />
                        <span className={styles.Span}>{post.readMinutes || 0} min/s</span>
                    </div>
                </div>
                <article
                    className={styles.Content}
                    dangerouslySetInnerHTML={{ __html: post.postContent }}
                />
            </div>
            <aside className={styles.Recommended}>
                <h2 className={styles.RecommendedHeading}>Recommended Reads</h2>
                {recommendedPosts.map(post => {
                    const postSlug = createSlug(post.postTitle);
                    return (
                        <div key={post.postId} className={styles.RecommendedCard}>
                            <Link
                                href={`/explore-articles/${post.postId}/${postSlug}`}
                                className={styles.RecommendedLink}
                                prefetch={false}
                            >
                                <div className={styles.RecommendedCardContent}>
                                    <div className={styles.RecommendedImageContainer}>
                                        <Image
                                            src={post.thumbnailUrl}
                                            alt={post.postTitle}
                                            fill
                                            className={styles.RecommendedImage}
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={false}
                                        />
                                    </div>
                                    <h3 className={styles.RecommendedTitle}>{post.postTitle}</h3>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </aside>
        </div>
    );
}