import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu';
import { Collapse } from '@material-ui/core';

import Links from './links';

import scrollToElement from 'scroll-to-element';

import useWindowSize from '../../hooks/useWindowSize';
import useOpacityBasedOnScrollPosition from '../../hooks/useOpacityBasedOnScrollPosition';
import useIsOnBlogPath from '../../hooks/useIsOnBlogPath';

import './index.css';


const Nav = props => {
  const { width } = useWindowSize();
  const bgOpacity = useOpacityBasedOnScrollPosition(0.95);

  // Hamburger menu state
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  
  const isOnBlogPath = useIsOnBlogPath();

  console.log(isOnBlogPath)

  return (
    <div id="Nav"
      style={{
        backgroundColor: `rgba(40, 44, 52, ${bgOpacity})`
      }}
    >
      { width > 550 &&  // Show only links for desktop
        <Links/>
      }

      { width < 550 &&  // Show mobile stuff
        <div className="mobile flex-container-horizontally-center flex-container-vertically-center"
          style={ isMenuOpen ? { paddingBottom: 0 } : {} }
        >
          <p id="name-txt" className="mouse-on-hover"
            onClick={ () => scrollToElement("#Home") }
          >
            { isOnBlogPath && <Link to={"/"}>Monty Choy</Link> }
            { !isOnBlogPath && "Monty Choy" }
          </p>

          <HamburgerMenu
            isOpen={isMenuOpen}
            menuClicked={() => setIsMenuOpen(prev => !prev)}
            className="mouse-on-hover"
            width={23}
            height={20}
            strokeWidth={1}
            rotate={0}
            color='white'
            borderRadius={0}
            animationDuration={0.5}
          />

          <Collapse in={isMenuOpen}>
            <Links/>
          </Collapse>

        </div>
      }
      
    </div>
  )
  
}

export default Nav;