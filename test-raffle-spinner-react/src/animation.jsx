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
            setTimeout(async () => {
                await onAnimate(); // Call the function passed from App to perform additional actions
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
      let counter = 0;
      if (isAnimating) {
        animationInterval = setInterval(() => {
          // Check if we've reached the end of the frames
          if (currentFrameIndex === frames.length - 1) {
            clearInterval(animationInterval);
            setIsAnimating(false); // Stop the animation
            setCurrentFrameIndex(0); // Reset to the first frame
        //   } else if (currentFrameIndex == 67 && counter < 69){
        //     // setCurrentFrameIndex(67);
        //     counter+=1;
          }
          else {
            setCurrentFrameIndex((prevIndex) => prevIndex + 1);
          }
        }, 83); // Adjust the delay between frames as needed
      }
      counter = 0;
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