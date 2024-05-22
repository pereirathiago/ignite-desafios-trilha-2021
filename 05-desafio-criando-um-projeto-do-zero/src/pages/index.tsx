import { GetStaticProps } from 'next';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from "react-icons/fi";
import { prismic } from '../services/prismic';
import { RichText } from 'prismic-dom'
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts]  = useState<Post[]>(postsPagination.results)


  async function handleNextPosts()  {

    try {

    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => {
            return (
              <Link href={`/posts/${post.uid}`} key={post.uid}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <time>
                    <FiCalendar />
                    {post.first_publication_date}
                  </time>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </Link>
            )
          })
          }

          {postsPagination.next_page ? (
            <button type='button' onClick={handleNextPosts}>
              Carregar mais posts
            </button>
          ) : (
            <></>
          )}

        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await prismic.getByType('post', {
    fetch: ["post.title", "post.subtitle", "post.author"],
    pageSize: 1,
  })

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  const postsPagination: PostPagination = {
    next_page: response.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    }
  }
};
