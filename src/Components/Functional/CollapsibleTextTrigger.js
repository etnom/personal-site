import React from 'react';

import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';


const CollapsibleTextTrigger = props => {
  const { isExpanded, 
    setIsExpanded, 
    
    children, 
    
    containerClassName, 
    containerStyle } = props;

  return (
    <div className={`CollapsibleTextTrigger ${containerClassName} mouse-on-hover flex-container-vertically-center`}
      onClick={e => setIsExpanded(prev => !prev)}
      style={containerStyle}
    >
      {children}

      { isExpanded && 
        <ArrowDropUp/>
      }

      { !isExpanded && 
        <ArrowDropDown/>
      }
      
    </div>
  )
}

export default CollapsibleTextTrigger;