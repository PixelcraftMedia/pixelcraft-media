const POST_GRAPHQL_FIELDS = `
  worktextCollection(limit: 12) {
    items {
      worktext
      workdescription
      animation
workimage {
        url   
        title 
      }
    }
  }

  
    imggradient1{
    url
    }
     imggradient2{
    url
    }
     imggradient3{
    url
    }
    
  homedecoration {
    url
    title
  }
  homebuttonstar {
    url
    title
  }
  hometitle
  homedescription
  homeimage {
    url
    title
  }
  metatitle
  metadescription
  homebuttontext
  h1
 
  tags {
    homepage
  }
  
 
  date
`;
// Функция для выполнения GraphQL-запроса с учётом локали
async function fetchGraphQL(query: string, locale: string, preview = true): Promise<any> {
  try {
    const response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            preview
              ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
              : process.env.CONTENTFUL_ACCESS_TOKEN
          }`,
        },
        body: JSON.stringify({ query }),
        next: { tags: ["posts"] },
      }
    );
    
    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error("GraphQL error:", data.errors || response.statusText);
      throw new Error(
        `Error fetching data: ${data.errors ? JSON.stringify(data.errors) : response.statusText}`
      );
    }

    return data;

  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to fetch data from Contentful");
  }
}

// Функция для извлечения поста из ответа
function extractPost(fetchResponse: any): any {
  return fetchResponse?.data?.postCollection?.items?.[0];
}

// Функция для извлечения всех постов из ответа
function extractPostEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.postCollection?.items;
}

// Получение превью поста по slug с учётом локали
export async function getPreviewPostBySlug(slug: string | null, locale: string): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1, locale: "${locale}") {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    locale,
    true
  );
  return extractPost(entry);
}

// Получение всех постов с учётом локали
export async function getAllPosts(isDraftMode: boolean, locale: string): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC, preview: ${
        isDraftMode ? "true" : "false"
      }, locale: "${locale}") {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    locale,
    isDraftMode
  );
  return extractPostEntries(entries);
}

// Получение поста и дополнительных постов с учётом локали
export async function getPostAndMorePosts(
  slug: string,
  preview: boolean,
  locale: string
): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
        preview ? "true" : "false"
      }, limit: 1, locale: "${locale}") {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    locale,
    preview
  );

  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
        preview ? "true" : "false"
      }, limit: 2, locale: "${locale}") {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    locale,
    preview
  );

  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  };
}





// Функция для извлечения всех записей из blogCollection
function extractBlogEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.blogCollection?.items || [];
}

// Получение всех записей из blogCollection с лимитом 5
export async function getAllBlogs(locale: string, preview = false): Promise<any[]> {
  const query = `
    query {
      blogCollection(limit: 5, preview: ${preview ? "true" : "false"}, locale: "${locale}") {
        items {
          content {
            json
            links {
              assets {
                block {
                 sys{
                id}
                  url
                  title
                  description
                  width
                  height
                  contentType
                }
              }
            }
          }
          image {
            url
            title
          }
          data
          title
        excerpt
          slug
           metatitle
        metadescription
        }
      }
    }
  `;

  const response = await fetchGraphQL(query, locale, preview);
  return extractBlogEntries(response);
}

// Получение записи из blogCollection по слагу
export async function getBlogBySlug(slug: string, locale: string, preview = false): Promise<any> {
  const query = `
    query {
      blogCollection(where: { slug: "${slug}" }, limit: 1, preview: ${preview ? "true" : "false"}, locale: "${locale}") {
        items {
          title
         excerpt
          slug
           data
         metatitle
         metadescription

          content {
            json
            links {
              assets {
                block {
                sys{
                id}
                  url
                  title
                  description
                  width
                  height
                  contentType
                }
              }
            }
          }
          image {
            url
            title
          }
        }
      }
    }
  `;

  const response = await fetchGraphQL(query, locale, preview);
  return extractBlogEntries(response)?.[0] || null; // Возвращаем первый элемент или null
}
