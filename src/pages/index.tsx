import { CardPost } from "@/components/CardPost";
import { Header } from "@/components/Header";
import Head from "next/head";
import { gql, useQuery } from "@apollo/client"
import Image from "next/image";
import Link from "next/link"
import { Loading } from "@/components/Loading";
import { Empty } from "@/components/Empty";

export default function Home() {

  const GET_ALL_POSTS = gql`
    query GetAllPosts {
      posts(orderBy: createdAt_DESC) {
        id
        publishedAt
        slug
        subtitle
        title
        createdAt
        coverImage {
          url
        }
        author {
          name
        }
      }
    }
  `

  interface AllPosts{
    posts:{
      id: string;
      slug: string;
      subtitle: string;
      title: string;
      createdAt: string;
      coverImage: {
        url: string;
      }
      author: {
        name: string;
      }
    }[]
  }

  const { loading, data, error } = useQuery<AllPosts>(GET_ALL_POSTS)

  if(loading) return <Loading />

  return (
    <>
      <Head>
        <title>BlogJunk</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className='w-full max-w-[1120px] flex flex-col mx-auto pb-12 px-4'>
        <Header/>
        {data ?
          <>
            <Link href={`/post/${data.posts[0].slug}`} className='w-full h-full flex gap-4 lg:gap-8 flex-col sm:flex-row items-center justify-center mt-12 hover:brightness-75 transition-all'>
        <div className='flex flex-1 w-full h-full min-h-[248px] md:min-h-[334px] relative rounded-2xl overflow-hidden'>
          <Image
            src={data?.posts[0].coverImage.url}
            alt=""
            fill={true}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className='flex flex-1 h-full flex-col gap-3 lg:gap-6'>
          <h1 className='font-bold text-3xl md:text-[40px] text-blue-600'>{data?.posts[0].title}</h1>
          <p className='text-zinc-600 text-sm md:text-base text-justify lg:text-left'>{data?.posts[0].subtitle}</p>
          <div>
            <p className='font-bold text-zinc-900 text-sm md:text-base'>{data?.posts[0].author.name}</p>
            <p className='text-zinc-600 text-xs md:text-sn'>{data?.posts[0].createdAt}</p>
          </div>
        </div>
        </Link>
        <div className='flex flex-col items-center sm:grid grid-cols-2  md:grid-cols-3 gap-4 lg:gap-8 mt-12'>
          {data?.posts.map((post, index) => {
            if(index != 0){
              return(
                <CardPost 
                  key={post.id}
                  title={post.title}
                  author={post.author.name}
                  createdAt={post.createdAt}
                  subtitle={post.subtitle}
                  urlImage={post.coverImage.url}
                  slug={post.slug}
                />
              )
            }
          })}
        </div>
          </>
          :
          <Empty />
        }
      </div>
    </>
  )
}
