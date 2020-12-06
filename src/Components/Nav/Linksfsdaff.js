import React from 'react';
import { Link } from 'react-router-dom';
import scrollToElement from 'scroll-to-element';

import { scrollToOffset } from '../../consts';
import uppercaseFirstChar from '../../helpers/uppercaseFirstChar';
import useIsOnBlogPath from '../../hooks/useIsOnBlogPath';


const Links = props => {
  const isOnBlogPath = useIsOnBlogPath();

  return (
    <div id="Links" className="flex-container-horizontally-center">
      {["home", "about", "experience", "projects"].map((link, i) => {
        return (
          <p className="text-center mouse-on-hover" 
            key={i}
            onClick={() => 
              scrollToElement(
                `#${uppercaseFirstChar(link)}`, 
                { offset: scrollToOffset } 
              )
            }
          >
            { isOnBlogPath && <Link to={`/${link}`}>{link}</Link> }
            { !isOnBlogPath && link }
          </p>
        )
      })}
      <p className="text-center mouse-on-hover"><Link to={"/blog"}>Blog</Link></p>
    </div>
  )
}

export default Links;