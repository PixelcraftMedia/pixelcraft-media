import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import RichTextRenderer from '@/components/richtext/RichTextRenderer';
import { useRouter } from 'next/router';
import { Document } from '@contentful/rich-text-types';
import { getAllCategory, getBlogsByCategorySlug, getBlogBySlug } from '../../../lib/api';
import Cards from "@/components/pages/Cards";
import Link from "next/link";

interface Blog {
  metatitle: string;
  metadescription: string;
  data: string;
  image: {
    url: string;
    title: string;
  };
  title: string;
  slug: string;
  excerpt: string;
  content: {
    json: Document;
    links: {
      assets: {
        block: {
          sys: { id: string };
          url: string;
          title: string;
          description: string;
          width: number;
          height: number;
          contentType: string;
        }[];
      };
    };
  };
  category: { name: string; slug: string };
}

interface Props {
  blogs?: Blog[];
  blog?: Blog;
  categories?: { name: string; slug: string }[];
  type: 'category' | 'post';
  currentSlug?: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategory('ro-RO'); // Получаем категории
  const paths: any[] = [];

  for (const category of categories) {
    // Добавляем маршрут для категории
    paths.push({ params: { slug: [category.slug] } });

    // Получаем блоги категории
    const blogs = await getBlogsByCategorySlug('ro-RO', category.slug);
    blogs.forEach((blog) => {
      // Добавляем маршрут для каждого блога
      paths.push({ params: { slug: [category.slug, blog.slug] } });
    });
  }

  return {
    paths,
    fallback: 'blocking', // Важно, если нужно поддерживать fallback
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string[] | undefined;
  const locale = context.locale || 'en-US';

  if (!slug) {
    return { notFound: true };
  }

  if (slug.length === 1) {
    const blogs = await getBlogsByCategorySlug(locale, slug[0]);
    const categories = await getAllCategory(locale);

    return {
      props: {
        blogs: blogs.map((blog) => ({
          ...blog,
          category: blog.category || { name: 'Uncategorized', slug: 'uncategorized' },
        })),
        categories,
        type: 'category',
        currentSlug: slug[0],
      },
      revalidate: 60,
    };
  }

  if (slug.length === 2) {
    const blog = await getBlogBySlug(slug[1], locale);

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog,
        type: 'post',
      },
      revalidate: 60,
    };
  }

  return { notFound: true };
};

const DynamicPage = ({ blogs, blog, categories, type, currentSlug }: Props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  if (type === 'category' && blogs && categories) {
    return (
      <Layout
      image={""}
      metatitle={""}
      metadescription={""}
      slug={`blog/${categories.find(cat => cat.slug === currentSlug)?.slug || ''}`}
    >
      <div className='mt-96'>
        <h1>Posts in Category: {currentSlug}</h1>
        <div>
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <a 
                  href={`/blog/${category.slug}`} 
                  style={{ fontWeight: category.slug === currentSlug ? 'bold' : 'normal' }}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Posts</h2>
          <Cards blogs={blogs} />
        </div>
      </div>
    </Layout>
    );
  }

  if (type === 'post' && blog) {
    return (
      <Layout
        image={blog.image.url}
        metatitle={blog.metatitle || blog.title}
        metadescription={blog.metadescription || blog.excerpt}
        slug={`blog/${blog.category.slug}/${blog.slug}`}
      >
        <section className="relative z-10 pb-18 pt-30 lg:pt-35 xl:pt-40">
          <div className="absolute left-0 top-25 -z-1 flex w-full flex-col gap-3 opacity-50">
            <div className="footer-bg-gradient h-[1.24px] w-full"></div>
            <div className="footer-bg-gradient h-[2.47px] w-full"></div>
            <div className="footer-bg-gradient h-[3.71px] w-full"></div>
            <div className="footer-bg-gradient h-[4.99px] w-full"></div>
            <div className="footer-bg-gradient h-[6.19px] w-full"></div>
            <div className="footer-bg-gradient h-[7.42px] w-full"></div>
            <div className="footer-bg-gradient h-[8.66px] w-full"></div>
            <div className="footer-bg-gradient h-[9.90px] w-full"></div>
            <div className="footer-bg-gradient h-[13px] w-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 -z-1 h-24 w-full bg-gradient-to-b from-dark/0 to-dark"></div>
          <div className="px-4 text-center">
            <h1 className="mb-5.5 text-heading-2 font-extrabold text-white">{blog.title}</h1>
            <ul className="flex items-center justify-center gap-2">
              <li className="font-medium">
                <a href="/">Home</a>
              </li>
              <li className="font-medium">/<Link href={`${blog.category.slug}`}>{blog.category.slug}</Link></li>
              <li className="font-medium">/{blog.slug}</li>
            </ul>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 mt-10">
        
          <div className="post-content">
            <RichTextRenderer
              content={blog.content?.json || { nodeType: 'document', content: [] }}
              links={blog.content?.links || {}}
              blog={blog}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return <p>Not Found</p>;
};

export default DynamicPage;
