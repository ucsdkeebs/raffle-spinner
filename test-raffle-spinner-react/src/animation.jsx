import {useState, useEffect} from 'react';
function AnimationRenderer({onAnimate}) {
    
    const images = require.context('./img/Animation_Frames', true);
    const frames = images.keys().map(image => images(image));
  
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
  
    const handleImageClick = () => {
        setIsAnimating(prevIsAnimating => {
          if (!prevIsAnimating) {
            setCurrentFrameIndex(0); // Reset to the first frame if animation starts
            // onAnimate();
            setTimeout(() => {
                onAnimate(); // Call the function passed from App to perform additional actions
            }, 4500); // Delay of 3000 ms
            return !prevIsAnimating;
          }
          else {
            return prevIsAnimating;
          }
        });
      };
  
    useEffect(() => {
      let animationInterval;
      if (isAnimating) {
        animationInterval = setInterval(() => {
          // Check if we've reached the end of the frames
          if (currentFrameIndex === frames.length - 1) {
            clearInterval(animationInterval);
            setIsAnimating(false); // Stop the animation
            setCurrentFrameIndex(0); // Reset to the first frame
          } else {
            setCurrentFrameIndex((prevIndex) => prevIndex + 1);
          }
        }, 83); // Adjust the delay between frames as needed
      }
      return () => {
        if (animationInterval) clearInterval(animationInterval); // Clean up the interval
      };
    }, [isAnimating, currentFrameIndex]);
  
    return (
      <img
        id="animation_frame"
        src={frames[currentFrameIndex]}
        alt={`Frame ${currentFrameIndex + 1}`}
        onClick={handleImageClick}
      />
    );
  }
  
  export default AnimationRenderer;
// import React, { useState, useEffect } from 'react';

// function AnimationRenderer() {

//   const images =  require.context('./img/Animation_Frames', true);
//   const frames = images.keys().map(image => images(image));
// //   const frames = ['./img/Animation_Frames/kwibs_0000.png', './img/Animation_Frames/kwibs_0001.png', './img/Animation_Frames/kwibs_0002.png', './img/Animation_Frames/kwibs_0003.png', './img/Animation_Frames/kwibs_0004.png', './img/Animation_Frames/kwibs_0005.png', './img/Animation_Frames/kwibs_0006.png', './img/Animation_Frames/kwibs_0007.png', './img/Animation_Frames/kwibs_0008.png', './img/Animation_Frames/kwibs_0009.png', './img/Animation_Frames/kwibs_0011.png', './img/Animation_Frames/kwibs_0012.png', './img/Animation_Frames/kwibs_0013.png', './img/Animation_Frames/kwibs_0014.png', './img/Animation_Frames/kwibs_0015.png', './img/Animation_Frames/kwibs_0016.png', './img/Animation_Frames/kwibs_0017.png', './img/Animation_Frames/kwibs_0018.png', './img/Animation_Frames/kwibs_0019.png', './img/Animation_Frames/kwibs_0020.png', './img/Animation_Frames/kwibs_0021.png', './img/Animation_Frames/kwibs_0022.png', './img/Animation_Frames/kwibs_0023.png', './img/Animation_Frames/kwibs_0024.png', './img/Animation_Frames/kwibs_0025.png', './img/Animation_Frames/kwibs_0026.png', './img/Animation_Frames/kwibs_0027.png', './img/Animation_Frames/kwibs_0028.png', './img/Animation_Frames/kwibs_0029.png', './img/Animation_Frames/kwibs_0030.png', './img/Animation_Frames/kwibs_0031.png', './img/Animation_Frames/kwibs_0032.png', './img/Animation_Frames/kwibs_0033.png', './img/Animation_Frames/kwibs_0034.png', './img/Animation_Frames/kwibs_0035.png', './img/Animation_Frames/kwibs_0036.png', './img/Animation_Frames/kwibs_0037.png', './img/Animation_Frames/kwibs_0038.png', './img/Animation_Frames/kwibs_0039.png', './img/Animation_Frames/kwibs_0040.png', './img/Animation_Frames/kwibs_0041.png', './img/Animation_Frames/kwibs_0042.png', './img/Animation_Frames/kwibs_0043.png', './img/Animation_Frames/kwibs_0044.png', './img/Animation_Frames/kwibs_0045.png', './img/Animation_Frames/kwibs_0046.png', './img/Animation_Frames/kwibs_0047.png', './img/Animation_Frames/kwibs_0048.png', './img/Animation_Frames/kwibs_0049.png', './img/Animation_Frames/kwibs_0050.png', './img/Animation_Frames/kwibs_0051.png', './img/Animation_Frames/kwibs_0052.png', './img/Animation_Frames/kwibs_0053.png', './img/Animation_Frames/kwibs_0054.png', './img/Animation_Frames/kwibs_0055.png', './img/Animation_Frames/kwibs_0056.png', './img/Animation_Frames/kwibs_0057.png', './img/Animation_Frames/kwibs_0058.png', './img/Animation_Frames/kwibs_0059.png', './img/Animation_Frames/kwibs_0060.png', './img/Animation_Frames/kwibs_0061.png', './img/Animation_Frames/kwibs_0062.png', './img/Animation_Frames/kwibs_0063.png', './img/Animation_Frames/kwibs_0064.png', './img/Animation_Frames/kwibs_0065.png', './img/Animation_Frames/kwibs_0066.png', './img/Animation_Frames/kwibs_0067.png', './img/Animation_Frames/kwibs_0068.png', './img/Animation_Frames/kwibs_0069.png', './img/Animation_Frames/kwibs_0070.png', './img/Animation_Frames/kwibs_0071.png', './img/Animation_Frames/kwibs_0072.png', './img/Animation_Frames/kwibs_0073.png', './img/Animation_Frames/kwibs_0074.png', './img/Animation_Frames/kwibs_0075.png', './img/Animation_Frames/kwibs_0076.png', './img/Animation_Frames/kwibs_0077.png', './img/Animation_Frames/kwibs_0078.png', './img/Animation_Frames/kwibs_0079.png', './img/Animation_Frames/kwibs_0080.png', './img/Animation_Frames/kwibs_0081.png', './img/Animation_Frames/kwibs_0082.png', './img/Animation_Frames/kwibs_0083.png', './img/Animation_Frames/kwibs_0084.png', './img/Animation_Frames/kwibs_0085.png', './img/Animation_Frames/kwibs_0086.png', './img/Animation_Frames/kwibs_0087.png', './img/Animation_Frames/kwibs_0088.png', './img/Animation_Frames/kwibs_0089.png', './img/Animation_Frames/kwibs_0090.png', './img/Animation_Frames/kwibs_0091.png', './img/Animation_Frames/kwibs_0092.png', './img/Animation_Frames/kwibs_0093.png', './img/Animation_Frames/kwibs_0094.png', './img/Animation_Frames/kwibs_0095.png', './img/Animation_Frames/kwibs_0096.png', './img/Animation_Frames/kwibs_0097.png', './img/Animation_Frames/kwibs_0098.png', './img/Animation_Frames/kwibs_0099.png', './img/Animation_Frames/kwibs_0100.png', './img/Animation_Frames/kwibs_0101.png', './img/Animation_Frames/kwibs_0102.png', './img/Animation_Frames/kwibs_0103.png', './img/Animation_Frames/kwibs_0104.png', './img/Animation_Frames/kwibs_0105.png', './img/Animation_Frames/kwibs_0106.png', './img/Animation_Frames/kwibs_0107.png']; // Store all your frames in an array

//   const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

//   useEffect(() => {
//     const animationInterval = setInterval(() => {
//       // Check if we've reached the end of the frames
//       if (currentFrameIndex === frames.length - 1) {
//         clearInterval(animationInterval); // Stop the animation when it's done
//       } else {
//         setCurrentFrameIndex((prevIndex) => prevIndex + 1);
//       }
//     }, 83); // Adjust the delay between frames as needed (e.g., 100ms)

//     return () => {
//       clearInterval(animationInterval); // Clean up the interval when the component unmounts
//     };
//   }, [currentFrameIndex]);

//   return (
//       <img id = "animation_frame"src={frames[currentFrameIndex]} alt={`Frame ${currentFrameIndex + 1}`} onClick={() => AnimationRenderer()}/>
//   );
// }

// export default AnimationRenderer;