import { useState, useEffect } from 'react';

import posts from '../assets/blog';
import { maxNumOfWordsInBlogPostPrev } from '../consts';
import stringToUrl from '../helpers/stringToUrl';


/**
 * Hook to handle all logic for dealing with blogs. Parameters should be passed
 * in as members in an object. Return vals are returned in arr, so destructuring
 * is required.
 * 
 * @param {String} searchUrl: Url of post to search for, returns matching posts 
 *    based off of post's url prop
 * 
 * @return {Array} posts: blog posts retrieved based on input parameters
 * @return {Boolean} isLoading: true if blog post(s) is being fetched, else false
 */
const useBlogPosts = params => {
  // If there are params specified, destructure them
  if (!!params) {
    // Use var so I have scope outside of the if statement
    var { searchUrl } = params;
  }

  const [ isLoading, setIsLoading ] = useState(true);

  const [ postsState, setPostsState ] = useState([]);
  const [ prevPost, setPrevPost ] = useState({});
  const [ nextPost, setNextPost ] = useState({});

  // Fetch posts, set to postsState
  useEffect(() => {
    (async function fetchAndSavePosts () {
      setIsLoading(true);

      // Clear prev and next post so when user goes to another post, they don't 
      // roll over
      setPrevPost({});
      setNextPost({});

      // Fetch and filter posts and convert to text
      //
      // https://stackoverflow.com/questions/33438158/best-way-to-call-an-async-function-within-map
      const fetchedPosts = await findAndCleanPosts(searchUrl);

      setPostsState(fetchedPosts);
      
      // If only searching for 1 post (searchUrl is specified), find that post's 
      // prev and next posts and save to state
      if (!!searchUrl && fetchedPosts.length === 1) {
        const { prev, next } = fetchedPosts[0];

        if (!!prev) {
          setPrevPost((await findAndCleanPosts(prev))[0]);
        } 

        if (!!next) {
          setNextPost((await findAndCleanPosts(next))[0]);
        }
      }

      setIsLoading(false);
    })();
    // https://medium.com/javascript-in-plain-english/https-medium-com-javascript-in-plain-english-stop-feeling-iffy-about-using-an-iife-7b0292aba174

  }, [searchUrl]);

  return [
    postsState, 
    isLoading,
    
    prevPost,
    nextPost
  ];
};

// Return post.url if specified, else generate a new url based on title
const getPostUrl = post => {
  return !!post.url ? post.url : stringToUrl(post.title);
}

// Find and clean data on posts based on search url. Async because data cleaning
// is async
async function findAndCleanPosts (searchUrl) {
  return await Promise.all(
    posts
      // Get posts that match searchUrl if specified
      .filter(post => !!searchUrl ? getPostUrl(post) === searchUrl : true)

      // Remove isPreview posts if a searchURL is specified. I still want to 
      // show posts preview for posts that are in preview mode, but I don't 
      // want the entire post to be available on its own page and everything
      .filter(post => !!searchUrl ? !post.isPreview : true)

      // Apply any sort of data cleaning on remaining posts that didn't get 
      // filtered out
      .map(cleanPostData)
  );
}

// Apply any sort of data cleaning on remaining posts that didn't get filtered
// out
async function cleanPostData (post) {
  const postText = await (await fetch(post.postFile)).text();
  const previewMd = generatePreviewMd(postText);

  const wordCount = postText.trim().split(/\s+/).length;

  // If url is defined, then that's the url, else generate one from title
  const detailUrl = getPostUrl(post);

  const tableOfContentsTree = generateTableOfContents(postText);
  const flattenedTableOfContents = flattenTableOfContents(tableOfContentsTree);

  // Final object to represent the post and its corresponding metadata
  return {
    ...post,
    wordCount: wordCount,
    readingTime: Math.ceil(wordCount/265),

    detailUrl: detailUrl,      // url of detail: .com/blog/{detailUrl}
    url: "/blog/" + detailUrl, // full url: .com/{url}

    md: postText,
    previewMd: previewMd,
    
    tableOfContentsTree: tableOfContentsTree,
    flattenedTableOfContents: flattenedTableOfContents
  }
}

// Create post preview, which should be the first paragraph of the post, but if
// that first paragraph has too many wprds, more than
// maxNumOfWordsInBlogPostPrev, then truncate all words after the max and append 
// a '...'
//
// Pass in post txt, returns preview markdown 
const generatePreviewMd = postText => {
  let previewMd = postText.split('\n')[0];    // Get first paragraph

  let previewWords = previewMd.split(" ");
  if (previewWords.length > maxNumOfWordsInBlogPostPrev) {
    previewMd = previewWords
      .slice(0, maxNumOfWordsInBlogPostPrev)
      .join(" ") + "...";
  }

  return previewMd;
}

// Generate table of contents based on header elements. 
// Returns ToC as an object in this form: 
// [
//   {
//     value: "",
//     children: [
//       { value: "" },
//       {
//         value: "",
//         children: [
//           { value: "" }
//         ]
//       }
//     ]
//   }, 
//   {
//     value: ""
//   }
// ]
//
// Algo: 
//  - Vars to track of most recent of each hierarchy
//  Data fixing:
//    - Split lines, but only deal with header lines
//    - For each header line, get hierarchy of header (ex: # = 1, ### = 3) and
//      header text
//  Tree population:
//    - Put current header as a child under the most recent previous header that
//      is 1 greater in hierarchy (ex, ## would go right under most recent #)
//    - Set this node as the most recent node in its hierarchy
//    - Clear other pointers that have less hierarchy (current node ##, clear 
//      ### and ####). This is to ensure that the next (following prev ex) ###
//      gets into the current ##, not the previous ##
const generateTableOfContents = postText => {
  let ToC = [];

  // Pointers to the most recent of each hierarchy (assume nothing after h4/####)
  let lastH1, lastH2, lastH3;

  postText.split('\n')
    // If first char of the line is a #, then it's a heading
    .filter(line => line[0] === "#")
    .forEach(line => {
      // The #'s at the beginning of the line are sep by a space before the txt,
      // so can use that pattern to get how many # there are to determine the 
      // heading hierarchy
      const splitLine = line.split(" ");


      // Hierarchy of the heading, 1 for lowest hierarchy/biggest txt
      const headingHierarchy = splitLine[0].length;

      // Text of actual heading
      const headingTxt = splitLine
        .slice(1, splitLine.length)
        .join(" ")
        .trim();

      // Node for this heading
      const node = {
        value: headingTxt,
        headingHierarchy: headingHierarchy,
        url: "#" + stringToUrl(headingTxt),
        children: []
      }

      // console.log(`${splitLine[0]}, ${headingHierarchy}: ${headingTxt}`);
      
      // Push nodes and set pointers
      switch (headingHierarchy) {
        // Push h1's direclty into ToC at root level, clear other node pointers
        case 1:
          ToC.push(node);
          lastH1 = node;

          lastH2 = null;
          lastH3 = null;
          
          break;
        // Push h2's directly to mose recent h1, set this h2 as most recent h2, 
        // clear other node pointers
        case 2:
          lastH1.children.push(node);
          lastH2 = node;

          lastH3 = null;

          break;
        // Push h3's directly to mose recent h2, set this h3 as most recent h3, 
        // clear other node pointers
        case 3:
          lastH2.children.push(node);
          lastH3 = node;

          break;

        // Push h4's directly to mose recent h3
        case 4:
          lastH3.children.push(node);

          break;
        default:
          break;
      }

    });   // for each

  return ToC;
};


// Flatten table of contents into a single array of objs so no recursion is 
// needed to render anything. Scrollspy seems to have trouble dealing with
// nested elements
const flattenTableOfContents = (tableOfContentsTree => {
  let flattenedToCArr = [];

  tableOfContentsTree.forEach(node => {
    const pushNode = node => {
      // Push node itself
      flattenedToCArr.push(node);

      // // Push into arr to keep track of section items
      // tocItems.push(node.url.replace("#", ""));


      // Push all of node's children
      node.children.forEach(childNode => pushNode(childNode))
    };

    pushNode(node);
    
  });

  return flattenedToCArr;

});

export default useBlogPosts;