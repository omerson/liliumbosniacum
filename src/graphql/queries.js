/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNews = `query GetNews($id: ID!) {
  getNews(id: $id) {
    id
    title
    content
    image
    published
  }
}
`;
export const listNewss = `query ListNewss(
  $filter: ModelNewsFilterInput
  $limit: Int
  $nextToken: String
) {
  listNewss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      content
      image
      published
    }
    nextToken
  }
}
`;
