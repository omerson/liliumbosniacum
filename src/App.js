import React, { useState, useEffect } from 'react';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation, Storage } from 'aws-amplify';

import { listNewss } from './graphql/queries';
import { createNews } from './graphql/mutations';

function App() {
  const [newsList, setNewsList] = useState([]);
  const [news, setNews] = useState({
    title: '',
    content: '',
    image: '',
    published: false
  });
  const [image, setImage] = useState({
    fileUrl: '',
    file: '',
    filename: ''
  });
  useEffect(() => {
      API.graphql(graphqlOperation(listNewss))
        .then((result) => {
          let rowNews = result.data.listNewss.items;
          let s3Names = rowNews.map(n => Storage.get(n.image));
          Promise.all(s3Names).then((s3values) => {
            s3values.map((s, i) => rowNews[i].image = s);
            setNewsList(rowNews);
          });
        })
        .catch((err) => console.log(err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImage({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name
    });
    setNews(
      {
        ...news,
        image: file.name
      }
    )
  }

  const handleInputChange = (e) => {
    setNews(
      {
        ...news,
        [e.target.name]: e.target.value,
      }
    )
  }

  const saveNews = (e) => {
    saveFile();
    API.graphql(graphqlOperation(createNews, {input: news}))
        .then((result) => {
          let rowNews = result.data.createNews;
          Storage.get(rowNews.image)
            .then((s3value) => {
              rowNews.image = s3value;
              setNewsList([
                ...newsList,
                {
                  title: rowNews.title,
                  content: rowNews.content,
                  image: rowNews.image
                }
              ]);
            });
          
          setNews({
            title: '',
            content: '',
            image: '',
            published: false
          });
        })
        .catch((err) => console.log(err));
  }

  const saveFile = () => {
    Storage.put(image.filename, image.file)
      .then(() => {
        setImage({
          fileUrl: '',
          file: '',
          filename: ''
        })
      })
      .catch((err) => {
        console.log('err');
        console.log(err);
      });
  }
  
  const displayNews = newsList.map((n) => {
    return <div className="news" key={n.title.toString()}>
              <p>
                {n.title}
              </p>
              <span>{n.content}</span>
              <img src={n.image} height="30" alt="alt"/>
           </div>
          });

  return (
    <div className="App">
      {displayNews}

      <div className="addNews">
        <label>Add News</label><br/>  
        <input onChange={handleInputChange} value={news.title} name="title" type="text"></input><br/>
        <textarea onChange={handleInputChange} value={news.content}  name="content"></textarea><br/>
        <input name="image" type='file' onChange={handleFileChange} /><br/>
        <button onClick={saveNews}>Save News</button>
      </div>
    </div>

  );
}

export default withAuthenticator(App, { includeGreetings: true });
