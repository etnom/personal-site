import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'

import Loading from '../Functional/Loading';
import Cover from './Cover';
import DateInfo from './DateInfo';

import useBlogPosts from '../../hooks/useBlogPosts';

import { ReactGACtx } from '../App';

import './index.css';
import './blog-content.css';


const Blog = props => {  
  const ReactGA = useContext(ReactGACtx);

  const [ posts, isLoading ] = useBlogPosts();

  return (
    <div id="Blog">
      
      <Cover/>

      <Loading isLoading={isLoading}/>

      <div id="post-previews" className="blog-content">
        { !isLoading && posts.map((post, i) => {
          const { title, url, previewMd, isPreview} = post;

          // class for disabled link if post is preview, gets appended to classname
          const disabledLink = isPreview ? " disabled-link" : "text-hover-grey";

          return (
            <div key={i} className="post-preview">
              <Link className={`no-style-link ${disabledLink}`} to={url}
                onClick={() => {
                  ReactGA.event({
                    category: 'Blog',
                    action: 'Click Link to Post from Post Preview',
                    label: `Title to '${title}'`
                  });
                }}
              >
                <h2>{title}</h2>
              </Link>

              <DateInfo post={post}/>
              
              <ReactMarkdown className="preview-md" source={previewMd}/>

              <Link to={url} className={`no-style-link ${disabledLink}`}
                onClick={() => {
                  ReactGA.event({
                    category: 'Blog',
                    action: 'Click Link to Post from Post Preview',
                    label: `Read More to '${title}'`
                  });
                }}
              >
                <p>{isPreview ? "Coming Soon!" : "Read More"}</p>
              </Link>
            </div>
          )
        })

        }
      </div>
      
    </div>
  );
};

export default Blog;